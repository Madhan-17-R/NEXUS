"use client";

import React, { useState, useEffect } from "react";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { useReviews } from "@/context/funding/ReviewsContext";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { Tabs } from "@/components/funding/ui/Tabs";
import { ApplicationModals } from "./ApplicationModals";
import {
  User, CheckCircle2, AlertCircle, FileText, 
  MessageSquare, Users, Edit3, ChevronDown, Clock, ShieldCheck, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/funding/utils";

import { RubricBuilder } from "@/components/funding/reviews/RubricBuilder";
import { ReviewerEvaluationPanel } from "@/components/funding/reviews/ReviewerEvaluationPanel";
import { EvaluationSummary } from "@/components/funding/reviews/EvaluationSummary";
import { DecisionCenter } from "@/components/funding/reviews/DecisionCenter";
import { EvaluationRubric, ReviewerEvaluation, DecisionType } from "@/types/funding/reviews";

export function ReviewPanel() {
  const { selectedApp, reviewers, assignReviewer, addInternalNote, updatePriority, updateStatus } = useApplications();
  const { 
    loadContext, 
    loading: reviewsLoading,
    currentRubric, 
    assignments, 
    evaluations, 
    currentDecision,
    saveRubric,
    assignReviewer: assignPhase6Reviewer,
    saveEvaluation,
    submitEvaluation,
    makeDecision
  } = useReviews();

  const [noteContent, setNoteContent] = useState("");
  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"shortlist" | "award" | "reject" | "request_info" | null>(null);
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    if (selectedApp) {
      loadContext("grant", selectedApp.grantId, selectedApp.id);
    }
  }, [selectedApp?.id, selectedApp?.grantId, loadContext]);

  if (!selectedApp) return null;

  const currentReviewer = reviewers.find(r => r.id === selectedApp.assignedReviewerId);
  const phase6Assignment = assignments.find(a => a.reviewerId === "rev_2"); // Mock current user is rev_2 (Priya)
  const currentEvaluation = evaluations.find(e => e.reviewerId === "rev_2") || null;

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    addInternalNote(selectedApp.id, noteContent.trim());
    setNoteContent("");
  };

  const handlePhase6Assign = async (reviewerId: string, reviewerName: string) => {
    // Also sync with Phase 4 context for visual consistency
    assignReviewer(selectedApp.id, reviewerId);
    await assignPhase6Reviewer(reviewerId, reviewerName, "grant", selectedApp.id);
  };

  return (
    <div className="w-full xl:w-[480px] shrink-0 flex flex-col gap-6">
      
      <Tabs 
        tabs={[
          { id: "application", label: "Application" },
          { id: "evaluation", label: "Evaluation" },
          { id: "decisions", label: "Decisions" }
        ]} 
        activeTab={activeTab} 
        onChange={setActiveTab} 
      />

      {activeTab === "application" && (
        <div className="flex flex-col gap-6">
          {/* 1. Applicant Snapshot */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Applicant Snapshot</h3>
            <div className="flex items-center gap-4 mb-5">
              <img src={selectedApp.applicantSnapshot.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-surface-200" />
              <div>
                <div className="font-black text-surface-900 text-lg flex items-center gap-1.5">
                  {selectedApp.applicantSnapshot.fullName}
                  {selectedApp.applicantSnapshot.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="text-sm text-surface-500">{selectedApp.applicantSnapshot.location}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Education</span>
                <span className="font-semibold text-surface-900">{selectedApp.applicantSnapshot.education}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Institution</span>
                <span className="font-semibold text-surface-900">{selectedApp.applicantSnapshot.institution}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Domain</span>
                <span className="font-semibold text-surface-900">{selectedApp.applicantSnapshot.domain}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Experience</span>
                <span className="font-semibold text-surface-900">{selectedApp.applicantSnapshot.experience}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" size="sm" leftIcon={<User className="w-4 h-4" />}>
              View Full Profile
            </Button>
          </div>

          {/* 2. Review Assignment & Priority */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Assignment & Priority</h3>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-surface-500 mb-1.5">Assigned Reviewer</label>
                <button 
                  onClick={() => setAssignDropdownOpen(!assignDropdownOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg hover:bg-white hover:border-brand-300 transition-smooth"
                >
                  {currentReviewer ? (
                    <div className="flex items-center gap-2">
                      <img src={currentReviewer.avatar} alt="Avatar" className="w-5 h-5 rounded-full" />
                      <span className="text-sm font-bold text-surface-900">{currentReviewer.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-surface-500 italic">Unassigned</span>
                  )}
                  <ChevronDown className="w-4 h-4 text-surface-400" />
                </button>
                
                {assignDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-xl shadow-lg overflow-hidden z-20">
                    <button onClick={() => { assignReviewer(selectedApp.id, undefined); setAssignDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-surface-50 text-sm text-surface-500 italic border-b border-surface-100">
                      Unassigned
                    </button>
                    {reviewers.map(r => (
                      <button key={r.id} onClick={() => { handlePhase6Assign(r.id, r.name); setAssignDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-surface-50 flex items-center gap-2">
                        <img src={r.avatar} alt={r.name} className="w-5 h-5 rounded-full" />
                        <span className="text-sm font-bold text-surface-900">{r.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-500 mb-1.5">Priority</label>
                <div className="flex bg-surface-100 rounded-lg p-1">
                  <button 
                    onClick={() => updatePriority(selectedApp.id, "Normal")}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-smooth", selectedApp.priority === "Normal" ? "bg-white text-surface-900 shadow-sm" : "text-surface-500 hover:text-surface-700")}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => updatePriority(selectedApp.id, "High")}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-smooth", selectedApp.priority === "High" ? "bg-rose-500 text-white shadow-sm" : "text-surface-500 hover:text-surface-700")}
                  >
                    High
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Review Summary */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Review Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 font-medium">Eligibility</span>
                <Badge variant={selectedApp.review.eligibilityStatus === "Eligible" ? "success" : selectedApp.review.eligibilityStatus === "Ineligible" ? "danger" : "neutral"} size="sm">{selectedApp.review.eligibilityStatus}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 font-medium">Technical Review</span>
                <Badge variant={selectedApp.review.technicalStatus === "Pass" ? "success" : selectedApp.review.technicalStatus === "Fail" ? "danger" : "neutral"} size="sm">{selectedApp.review.technicalStatus}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-surface-600 font-medium">Funding Assessment</span>
                <Badge variant={selectedApp.review.fundingStatus === "Approved" ? "success" : selectedApp.review.fundingStatus === "Denied" ? "danger" : "neutral"} size="sm">{selectedApp.review.fundingStatus}</Badge>
              </div>
            </div>
          </div>

          {/* 4. Internal Notes */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">Internal Notes</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 uppercase tracking-wider">Internal Only</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 min-h-[150px]">
              {selectedApp.internalNotes.length === 0 ? (
                <div className="text-center py-6 text-sm text-surface-400 italic">No notes added yet.</div>
              ) : (
                selectedApp.internalNotes.map(note => (
                  <div key={note.id} className="bg-surface-50 rounded-xl p-3 border border-surface-100">
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-bold text-surface-900">{note.reviewerName}</span>
                      <span className="text-[10px] text-surface-400">{new Date(note.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-surface-600">{note.content}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-auto">
              <textarea
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                placeholder="Add an internal note..."
                className="w-full p-3 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white resize-none h-20 mb-2"
              />
              <Button variant="secondary" size="sm" className="w-full" onClick={handleAddNote} disabled={!noteContent.trim()}>
                Add Note
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "evaluation" && (
        <div className="flex flex-col gap-6">
          {reviewsLoading ? (
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm space-y-4 animate-pulse">
              <div className="w-48 h-5 bg-surface-200 rounded" />
              <div className="w-full h-32 bg-surface-100 rounded-xl" />
              <div className="w-full h-32 bg-surface-100 rounded-xl" />
            </div>
          ) : !currentRubric ? (
            <RubricBuilder 
              initialRubric={null} 
              onSave={saveRubric} 
              ownerType="grant" 
              ownerId={selectedApp.grantId} 
            />
          ) : (
            <>
              <EvaluationSummary 
                evaluations={evaluations} 
                assignments={assignments} 
              />
              <ReviewerEvaluationPanel 
                rubric={currentRubric}
                evaluation={currentEvaluation}
                onSaveDraft={saveEvaluation as any}
                onSubmit={submitEvaluation}
                reviewerId="rev_2"
                reviewerName="Priya Shah"
                applicationId={selectedApp.id}
                ownerType="grant"
              />
            </>
          )}
        </div>
      )}

      {activeTab === "decisions" && (
        <div className="flex flex-col gap-6">
          {reviewsLoading ? (
            <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm space-y-4 animate-pulse">
              <div className="w-48 h-5 bg-surface-200 rounded" />
              <div className="w-full h-48 bg-surface-100 rounded-xl" />
            </div>
          ) : (
          <DecisionCenter 
            currentDecision={currentDecision}
            onMakeDecision={async (decision, reason, notes, amount, infoRequested) => {
              const res = await makeDecision("grant", selectedApp.id, decision, reason, notes, amount, infoRequested);
              if (res.success && res.newStatus) {
                // Update the application status to trigger timeline events
                await updateStatus(selectedApp.id, res.newStatus as any);
              }
            }}
            applicantName={selectedApp.applicantSnapshot.fullName}
            overallScore={evaluations.length > 0 ? (evaluations.reduce((a, b) => a + b.totalScore, 0) / evaluations.length).toFixed(1) : "N/A"}
          />
          )}
        </div>
      )}

      {/* Modals Component */}
      <ApplicationModals activeModal={activeModal} onClose={() => setActiveModal(null)} appId={selectedApp.id} />
    </div>
  );
}
