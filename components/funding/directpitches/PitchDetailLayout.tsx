"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDirectPitches } from "@/context/funding/DirectPitchesContext";
import { formsApi } from "@/lib/funding/firebase/formsApi";
import { FormDefinition } from "@/types/funding/forms";
import { DynamicFormRenderer } from "@/components/funding/applications/DynamicFormRenderer";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { ArrowLeft, User, ShieldCheck, Activity, ChevronDown, CheckCircle, AlertTriangle, MessageSquare, X, Send } from "lucide-react";
import { DirectPitchStatus } from "@/types/funding/directPitches";
import { cn } from "@/lib/funding/utils";

// --- Extracted lightweight Review Panel for Pitch Intake Phase ---
import { useReviews } from "@/context/funding/ReviewsContext";
import { Tabs } from "@/components/funding/ui/Tabs";
import { RubricBuilder } from "@/components/funding/reviews/RubricBuilder";
import { ReviewerEvaluationPanel } from "@/components/funding/reviews/ReviewerEvaluationPanel";
import { EvaluationSummary } from "@/components/funding/reviews/EvaluationSummary";
import { DecisionCenter } from "@/components/funding/reviews/DecisionCenter";

function PitchReviewPanel({ 
  pitchId, 
  onAction 
}: { 
  pitchId: string, 
  onAction: (action: "request_info") => void 
}) {
  const { selectedPitch, reviewers, assignReviewer, updatePriority, updatePitchStatus } = useDirectPitches();
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

  const [assignDropdownOpen, setAssignDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("application");

  useEffect(() => {
    if (selectedPitch) {
      loadContext("directPitch", selectedPitch.organizationId, selectedPitch.id);
    }
  }, [selectedPitch?.id, selectedPitch?.organizationId, loadContext]);

  if (!selectedPitch) return null;
  const currentReviewer = reviewers.find(r => r.id === selectedPitch.assignedReviewerId);
  const currentEvaluation = evaluations.find(e => e.reviewerId === "rev_2") || null;

  const handlePhase6Assign = async (reviewerId: string, reviewerName: string) => {
    assignReviewer(selectedPitch.id, reviewerId);
    await assignPhase6Reviewer(reviewerId, reviewerName, "directPitch", selectedPitch.id);
  };

  return (
    <div className="w-full xl:w-[480px] shrink-0 flex flex-col gap-6">
      
      <Tabs 
        tabs={[
          { id: "application", label: "Intake" },
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
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Innovator Snapshot</h3>
            <div className="flex items-center gap-4 mb-5">
              <img src={selectedPitch.applicantSnapshot.avatar} alt="Avatar" className="w-14 h-14 rounded-full border-2 border-surface-200" />
              <div>
                <div className="font-black text-surface-900 text-lg flex items-center gap-1.5">
                  {selectedPitch.applicantSnapshot.fullName}
                  {selectedPitch.applicantSnapshot.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </div>
                <div className="text-sm text-surface-500">{selectedPitch.applicantSnapshot.location}</div>
              </div>
            </div>
            
            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Education</span>
                <span className="font-semibold text-surface-900">{selectedPitch.applicantSnapshot.education}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Institution</span>
                <span className="font-semibold text-surface-900">{selectedPitch.applicantSnapshot.institution}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Domain</span>
                <span className="font-semibold text-surface-900">{selectedPitch.applicantSnapshot.domain}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-surface-500">Experience</span>
                <span className="font-semibold text-surface-900">{selectedPitch.applicantSnapshot.experience}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" size="sm" leftIcon={<User className="w-4 h-4" />}>
              View Full Profile
            </Button>
          </div>

          {/* 2. Review Assignment & Priority */}
          <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-4">Intake Management</h3>
            
            <div className="space-y-4">
              {/* Start Review Action */}
              {selectedPitch.status === "New" && (
                <Button 
                  variant="primary" 
                  className="w-full mb-2" 
                  onClick={() => updatePitchStatus(selectedPitch.id, "Initial Review")}
                >
                  Start Review
                </Button>
              )}

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
                    <button onClick={() => { assignReviewer(selectedPitch.id, undefined); setAssignDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 hover:bg-surface-50 text-sm text-surface-500 italic border-b border-surface-100">
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
                    onClick={() => updatePriority(selectedPitch.id, "Normal")}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-smooth", selectedPitch.priority === "Normal" ? "bg-white text-surface-900 shadow-sm" : "text-surface-500 hover:text-surface-700")}
                  >
                    Normal
                  </button>
                  <button 
                    onClick={() => updatePriority(selectedPitch.id, "High")}
                    className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-smooth", selectedPitch.priority === "High" ? "bg-rose-500 text-white shadow-sm" : "text-surface-500 hover:text-surface-700")}
                  >
                    High
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button variant="outline" className="w-full" onClick={() => onAction("request_info")}>
                  Request Information
                </Button>
              </div>
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
              ownerType="directPitch" 
              ownerId={selectedPitch.organizationId} 
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
                applicationId={selectedPitch.id}
                ownerType="directPitch"
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
              const res = await makeDecision("directPitch", selectedPitch.id, decision, reason, notes, amount, infoRequested);
              if (res.success && res.newStatus) {
                // In a real app we'd update the actual pitch status here
                updatePitchStatus(selectedPitch.id, res.newStatus as any);
              }
            }}
            applicantName={selectedPitch.applicantSnapshot.fullName}
            overallScore={evaluations.length > 0 ? (evaluations.reduce((a, b) => a + b.totalScore, 0) / evaluations.length).toFixed(1) : "N/A"}
          />
          )}
        </div>
      )}
    </div>
  );
}

function PitchActivityTimeline() {
  const { selectedPitch } = useDirectPitches();
  if (!selectedPitch || selectedPitch.activity.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm mt-8">
      <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-6">Activity Timeline</h3>
      
      <div className="space-y-6">
        {selectedPitch.activity.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            {index !== selectedPitch.activity.length - 1 && (
              <div className="absolute left-[13px] top-8 bottom-[-24px] w-0.5 bg-surface-100" />
            )}
            
            <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0 z-10 border-2 border-white ring-1 ring-surface-100">
              <Activity className="w-3.5 h-3.5 text-brand-600" />
            </div>
            
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-sm font-bold text-surface-900">{event.action}</span>
                <span className="text-[10px] font-semibold text-surface-400 whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-surface-600 mt-0.5">{event.description}</p>
              <p className="text-[10px] text-surface-400 font-medium mt-1 uppercase tracking-wider">By {event.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PitchDetailLayout({ pitchId }: { pitchId: string }) {
  const router = useRouter();
  const { selectedPitch, loadPitchById, loading, requestInfo } = useDirectPitches();
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
  const [activeModal, setActiveModal] = useState<"request_info" | null>(null);
  const [reqReason, setReqReason] = useState("");
  const [reqLoading, setReqLoading] = useState(false);

  useEffect(() => {
    loadPitchById(pitchId);
  }, [pitchId, loadPitchById]);

  useEffect(() => {
    if (selectedPitch) {
      formsApi.getById(selectedPitch.formId)
        .then(form => {
          if (!form) {
            // fallback for mock environment
            return formsApi.createFromTemplate("tpl_direct_pitch", "directPitch", selectedPitch.organizationId, "Direct Pitch Form");
          }
          return form;
        })
        .then(setFormDefinition);
    }
  }, [selectedPitch]);

  if (!loading && !selectedPitch) {
    return (
      <div className="flex flex-col h-full bg-surface-50 min-h-screen items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200 flex flex-col items-center max-w-md text-center">
          <AlertTriangle className="w-12 h-12 text-surface-300 mb-4" />
          <h2 className="text-xl font-bold text-surface-900 mb-2">Pitch Not Found</h2>
          <p className="text-sm text-surface-500 mb-6">The pitch you are trying to view does not exist or has been removed.</p>
          <Button variant="primary" onClick={() => router.push('/funding/reviews')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Reviews
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !selectedPitch) {
    return (
      <div className="flex flex-col h-full bg-surface-50 min-h-screen overflow-hidden">
        {/* Skeleton Header */}
        <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center gap-4 shrink-0 z-10">
          <div className="w-8 h-8 bg-surface-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-surface-200 rounded animate-pulse" />
            <div className="w-64 h-3 bg-surface-200 rounded animate-pulse" />
          </div>
        </header>

        {/* Skeleton Workspace */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
            {/* Left Column Skeleton */}
            <div className="flex-1 min-w-0 space-y-8">
              <div className="w-full h-10 bg-surface-200 rounded-lg animate-pulse w-64 mb-6" />
              <div className="w-full h-96 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
            </div>
            
            {/* Right Column Skeleton */}
            <div className="w-full xl:w-[480px] shrink-0 flex flex-col gap-6">
              <div className="w-full h-10 bg-surface-200 rounded-lg animate-pulse" />
              <div className="w-full h-64 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
              <div className="w-full h-48 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: DirectPitchStatus) => {
    switch(status) {
      case "New": return "neutral";
      case "Shortlisted": return "info";
      case "Awarded": return "success";
      case "Rejected": return "danger";
      case "More Information Required": return "warning";
      default: return "neutral";
    }
  };

  const handleRequestInfo = async () => {
    if (!reqReason.trim()) return;
    setReqLoading(true);
    await requestInfo(selectedPitch.id, reqReason);
    setReqLoading(false);
    setActiveModal(null);
  };

  return (
    <div className="flex flex-col h-full bg-surface-50 min-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/funding/direct-pitches`)}
            className="p-2 -ml-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-smooth shrink-0"
            title="Back to Pitches"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-surface-900">{selectedPitch.id}</h1>
              <Badge variant={getStatusColor(selectedPitch.status)}>{selectedPitch.status}</Badge>
              {selectedPitch.priority === "High" && <Badge variant="danger">High Priority</Badge>}
            </div>
            <div className="text-xs text-surface-500 mt-0.5 flex items-center gap-2">
              <span className="font-semibold">{selectedPitch.title}</span>
              <span className="w-1 h-1 rounded-full bg-surface-300" />
              <span>{selectedPitch.applicantSnapshot.fullName}</span>
              <span className="w-1 h-1 rounded-full bg-surface-300" />
              <span>Submitted {new Date(selectedPitch.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
          
          {/* Left Column: Form Responses & Activity */}
          <div className="flex-1 min-w-0">
            <div>
              <h2 className="text-xl font-black text-surface-900 mb-6 flex items-center gap-2">
                Pitch Submission
              </h2>
              
              {!formDefinition ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-8 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
              ) : (
                <DynamicFormRenderer
                  form={formDefinition}
                  responses={selectedPitch.responses}
                  mode="review"
                />
              )}
            </div>

            <PitchActivityTimeline />
          </div>

          {/* Right Column: Review Panel */}
          <PitchReviewPanel pitchId={selectedPitch.id} onAction={(action) => setActiveModal(action)} />
          
        </div>
      </div>

      {/* Request Info Modal */}
      {activeModal === "request_info" && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm" onClick={() => setActiveModal(null)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-surface-900">Request More Information</h2>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 text-surface-400 hover:bg-surface-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-surface-500 mb-4">Ask the innovator to provide additional information before continuing the review.</p>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-surface-500 mb-1.5">What information do you need?</label>
              <textarea
                value={reqReason}
                onChange={e => setReqReason(e.target.value)}
                className="w-full border border-surface-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                rows={4}
                placeholder="Please provide details about..."
              />
            </div>
            
            <div className="flex justify-end gap-2 mt-auto">
              <Button variant="outline" onClick={() => setActiveModal(null)} disabled={reqLoading}>Cancel</Button>
              <Button variant="primary" onClick={handleRequestInfo} disabled={reqLoading || !reqReason.trim()} leftIcon={<Send className="w-4 h-4" />}>
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
