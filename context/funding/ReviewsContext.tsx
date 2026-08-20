"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { 
  EvaluationRubric, 
  ReviewerAssignment, 
  ReviewerEvaluation, 
  DecisionRecord,
  EvaluationOwnerType,
  DecisionType
} from "@/types/funding/reviews";
import { ApplicationStatus } from "@/types/funding/applications";
import { reviewsApi } from "@/lib/funding/firebase/reviewsApi";

import { DirectPitchStatus } from "@/types/funding/directPitches";
import { useAlert } from "./AlertContext";

interface ReviewsContextType {
  // State
  currentRubric: EvaluationRubric | null;
  assignments: ReviewerAssignment[];
  evaluations: ReviewerEvaluation[];
  currentDecision: DecisionRecord | null;
  loading: boolean;
  saving: boolean;
  error: string | null;

  // Actions
  loadContext: (ownerType: EvaluationOwnerType, ownerId: string, applicationId: string) => Promise<void>;
  saveRubric: (rubric: EvaluationRubric) => Promise<void>;
  assignReviewer: (reviewerId: string, reviewerName: string, ownerType: EvaluationOwnerType, applicationId: string) => Promise<void>;
  saveEvaluation: (evaluation: ReviewerEvaluation) => Promise<void>;
  submitEvaluation: (evaluationId: string) => Promise<void>;
  makeDecision: (
    ownerType: EvaluationOwnerType, 
    applicationId: string, 
    decision: DecisionType, 
    reason?: string,
    notes?: string,
    amount?: number,
    informationRequested?: string
  ) => Promise<{ success: boolean; newStatus?: ApplicationStatus | DirectPitchStatus }>;
  clearContext: () => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [currentRubric, setCurrentRubric] = useState<EvaluationRubric | null>(null);
  const [assignments, setAssignments] = useState<ReviewerAssignment[]>([]);
  const [evaluations, setEvaluations] = useState<ReviewerEvaluation[]>([]);
  const [currentDecision, setCurrentDecision] = useState<DecisionRecord | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { showSuccess, showError } = useAlert();

  const loadContext = useCallback(async (ownerType: EvaluationOwnerType, ownerId: string, applicationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const [rubric, asgs, evals, decision] = await Promise.all([
        reviewsApi.getRubric(ownerType, ownerId),
        reviewsApi.getAssignments(applicationId),
        reviewsApi.getEvaluations(applicationId),
        reviewsApi.getDecision(applicationId)
      ]);
      setCurrentRubric(rubric);
      setAssignments(asgs);
      setEvaluations(evals);
      setCurrentDecision(decision);
    } catch (err: any) {
      setError(err.message || "Failed to load reviews context");
      showError("Load failed", "Failed to load reviews context");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const saveRubric = async (rubric: EvaluationRubric) => {
    setSaving(true);
    try {
      const saved = await reviewsApi.saveRubric(rubric);
      setCurrentRubric(saved);
      showSuccess("Rubric saved", "Rubric saved successfully");
    } catch (err: any) {
      showError("Save failed", err.message || "Failed to save rubric");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const assignReviewer = async (reviewerId: string, reviewerName: string, ownerType: EvaluationOwnerType, applicationId: string) => {
    setSaving(true);
    try {
      const newAsg = await reviewsApi.assignReviewer({
        ownerType,
        applicationId,
        reviewerId,
        reviewerName
      });
      setAssignments(prev => [...prev, newAsg]);
      showSuccess("Reviewer assigned", `${reviewerName} assigned as reviewer`);
    } catch (err: any) {
      showError("Assignment failed", err.message || "Failed to assign reviewer");
    } finally {
      setSaving(false);
    }
  };

  const saveEvaluation = async (evaluation: ReviewerEvaluation) => {
    setSaving(true);
    try {
      const saved = await reviewsApi.saveEvaluation(evaluation);
      setEvaluations(prev => {
        const idx = prev.findIndex(e => e.id === saved.id);
        if (idx >= 0) {
          const newEvals = [...prev];
          newEvals[idx] = saved;
          return newEvals;
        }
        return [...prev, saved];
      });
      
      // Update assignments local state implicitly if it went from Pending to In Progress
      if (saved.status === "Draft") {
         setAssignments(prev => prev.map(a => 
           (a.applicationId === saved.applicationId && a.reviewerId === saved.reviewerId && a.status === "Pending") 
             ? { ...a, status: "In Progress" } 
             : a
         ));
      }

      showSuccess("Draft saved", "Review draft saved.");
    } catch (err: any) {
      showError("Save failed", err.message || "Failed to save evaluation");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const submitEvaluation = async (evaluationId: string) => {
    setSaving(true);
    try {
      const submitted = await reviewsApi.submitEvaluation(evaluationId);
      setEvaluations(prev => {
        const idx = prev.findIndex(e => e.id === submitted.id);
        if (idx >= 0) {
          const newEvals = [...prev];
          newEvals[idx] = submitted;
          return newEvals;
        }
        return [...prev, submitted];
      });

      // Update assignment
      setAssignments(prev => prev.map(a => 
        (a.applicationId === submitted.applicationId && a.reviewerId === submitted.reviewerId) 
          ? { ...a, status: "Submitted" } 
          : a
      ));

      showSuccess("Review submitted", "Review submitted successfully.");
    } catch (err: any) {
      showError("Submission failed", "Could not submit review. Please try again.");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const makeDecision = async (
    ownerType: EvaluationOwnerType, 
    applicationId: string, 
    decision: DecisionType, 
    reason?: string,
    notes?: string,
    amount?: number,
    informationRequested?: string
  ): Promise<{ success: boolean; newStatus?: ApplicationStatus | DirectPitchStatus }> => {
    setSaving(true);
    try {
      const record = await reviewsApi.saveDecision({
        ownerType,
        applicationId,
        decision,
        reason,
        notes,
        amount,
        informationRequested,
        decidedBy: "Current User" // Mock user
      });
      setCurrentDecision(record);
      
      let mappedStatus: ApplicationStatus | DirectPitchStatus | undefined;

      // Map decision to actual core status
      if (decision === "Awarded") mappedStatus = "Awarded";
      if (decision === "Rejected") mappedStatus = "Rejected";
      if (decision === "Shortlisted") mappedStatus = "Shortlisted";
      if (decision === "More Information Required") {
         if (ownerType === "grant") mappedStatus = "More Information Required";
         if (ownerType === "directPitch") mappedStatus = "More Information Required"; // Or match actual DirectPitch status
      }

      showSuccess("Decision recorded", `Decision recorded: ${decision}`);
      return { success: true, newStatus: mappedStatus };
    } catch (err: any) {
      showError("Save failed", err.message || "Failed to save decision");
      return { success: false };
    } finally {
      setSaving(false);
    }
  };

  const clearContext = () => {
    setCurrentRubric(null);
    setAssignments([]);
    setEvaluations([]);
    setCurrentDecision(null);
    setError(null);
  };

  return (
    <ReviewsContext.Provider value={{
      currentRubric,
      assignments,
      evaluations,
      currentDecision,
      loading,
      saving,
      error,
      loadContext,
      saveRubric,
      assignReviewer,
      saveEvaluation,
      submitEvaluation,
      makeDecision,
      clearContext
    }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
