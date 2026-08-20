"use client";

import React, { useState } from "react";
import { DecisionType, DecisionRecord } from "@/types/funding/reviews";
import { Button } from "@/components/funding/ui/Button";
import { ThumbsUp, ThumbsDown, HelpCircle, Trophy, X, FileText } from "lucide-react";

interface DecisionCenterProps {
  currentDecision: DecisionRecord | null;
  onMakeDecision: (
    decision: DecisionType, 
    reason?: string, 
    notes?: string, 
    amount?: number, 
    informationRequested?: string
  ) => Promise<void>;
  applicantName: string;
  overallScore: number | string;
}

export function DecisionCenter({ 
  currentDecision, 
  onMakeDecision, 
  applicantName, 
  overallScore 
}: DecisionCenterProps) {
  const [activeModal, setActiveModal] = useState<DecisionType | null>(null);
  const [isUpdatingDecision, setIsUpdatingDecision] = useState(false);
  
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [infoRequested, setInfoRequested] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setNotes("");
    setReason("");
    setAmount(undefined);
    setInfoRequested("");
    setActiveModal(null);
  };

  const handleConfirm = async () => {
    if (!activeModal) return;
    setSaving(true);
    try {
      await onMakeDecision(
        activeModal, 
        reason, 
        notes, 
        amount, 
        infoRequested
      );
      resetForm();
      setIsUpdatingDecision(false);
    } finally {
      setSaving(false);
    }
  };

  const isRejectInvalid = activeModal === "Rejected" && reason.trim() === "";
  const isInfoInvalid = activeModal === "More Information Required" && infoRequested.trim() === "";

  return (
    <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-surface-200">
        <h2 className="text-lg font-bold text-surface-900">Decision Center</h2>
        <p className="text-sm text-surface-500 mt-1">Record the final outcome for this submission.</p>
      </div>

      <div className="p-6">
        {currentDecision && !isUpdatingDecision ? (
          <div className="bg-surface-50 border border-surface-200 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Current Status</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                ${currentDecision.decision === 'Awarded' ? 'bg-green-100 text-green-800' : ''}
                ${currentDecision.decision === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                ${currentDecision.decision === 'Shortlisted' ? 'bg-brand-100 text-brand-800' : ''}
                ${currentDecision.decision === 'More Information Required' ? 'bg-amber-100 text-amber-800' : ''}
              `}>
                {currentDecision.decision}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-500">Decided By:</span>
                <span className="font-medium text-surface-900">{currentDecision.decidedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-500">Date:</span>
                <span className="font-medium text-surface-900">{new Date(currentDecision.decidedAt).toLocaleDateString()}</span>
              </div>
              
              {currentDecision.amount && (
                <div className="flex justify-between">
                  <span className="text-surface-500">Amount Awarded:</span>
                  <span className="font-bold text-green-700">${currentDecision.amount.toLocaleString()}</span>
                </div>
              )}

              {currentDecision.reason && (
                <div className="mt-3 pt-3 border-t border-surface-200">
                  <span className="text-surface-500 block mb-1">Reason:</span>
                  <span className="text-surface-900">{currentDecision.reason}</span>
                </div>
              )}

              {currentDecision.informationRequested && (
                <div className="mt-3 pt-3 border-t border-surface-200">
                  <span className="text-surface-500 block mb-1">Information Requested:</span>
                  <span className="text-surface-900">{currentDecision.informationRequested}</span>
                </div>
              )}

              {currentDecision.notes && (
                <div className="mt-3 pt-3 border-t border-surface-200">
                  <span className="text-surface-500 block mb-1">Internal Notes:</span>
                  <span className="text-surface-900">{currentDecision.notes}</span>
                </div>
              )}
            </div>

            <div className="mt-6 text-right">
              <Button variant="outline" onClick={() => setIsUpdatingDecision(true)} className="text-xs">
                Update Decision
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {currentDecision && isUpdatingDecision && (
              <div className="flex justify-between items-center px-1">
                <h3 className="text-sm font-bold text-surface-900">Select New Decision</h3>
                <button onClick={() => setIsUpdatingDecision(false)} className="text-surface-400 hover:text-brand-600 text-sm font-semibold transition-colors">
                  Cancel Update
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setActiveModal("Shortlisted")}
                className="flex flex-col items-center justify-center p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-brand-500 hover:bg-brand-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ThumbsUp className="w-6 h-6" />
                </div>
                <span className="font-bold text-surface-900">Shortlist</span>
              </button>

              <button
                onClick={() => setActiveModal("Awarded")}
                className="flex flex-col items-center justify-center p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="font-bold text-surface-900">Award</span>
              </button>

              <button
                onClick={() => setActiveModal("More Information Required")}
                className="flex flex-col items-center justify-center p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <span className="font-bold text-surface-900">Request Info</span>
              </button>

              <button
                onClick={() => setActiveModal("Rejected")}
                className="flex flex-col items-center justify-center p-6 bg-surface-50 border border-surface-200 rounded-xl hover:border-red-500 hover:bg-red-50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <ThumbsDown className="w-6 h-6" />
                </div>
                <span className="font-bold text-surface-900">Reject</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {activeModal && activeModal !== "Pending" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-surface-900/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-surface-200 flex items-center justify-between bg-surface-50">
              <h3 className="text-lg font-bold text-surface-900">
                {activeModal === "Awarded" && "Award Application"}
                {activeModal === "Shortlisted" && "Shortlist Application"}
                {activeModal === "Rejected" && "Reject Application"}
                {activeModal === "More Information Required" && "Request More Information"}
              </h3>
              <button onClick={resetForm} className="text-surface-400 hover:text-surface-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-surface-50 rounded-lg p-4 border border-surface-200 flex justify-between items-center">
                <div>
                  <div className="text-xs text-surface-500 font-semibold mb-1">Applicant</div>
                  <div className="font-bold text-surface-900">{applicantName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-surface-500 font-semibold mb-1">Overall Score</div>
                  <div className="font-bold text-brand-600">{overallScore} / 100</div>
                </div>
              </div>

              {activeModal === "Rejected" && (
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-1">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                    rows={3}
                    placeholder="Provide a reason for rejection..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>
              )}

              {activeModal === "More Information Required" && (
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-1">
                    Information Requested <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                    rows={4}
                    placeholder="Specify exactly what information is missing or needed..."
                    value={infoRequested}
                    onChange={(e) => setInfoRequested(e.target.value)}
                  />
                </div>
              )}

              {activeModal === "Awarded" && (
                <div>
                  <label className="block text-sm font-semibold text-surface-900 mb-1">
                    Award Amount (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 font-medium">$</span>
                    <input
                      type="number"
                      className="w-full text-sm pl-8 border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                      placeholder="e.g. 50000"
                      value={amount || ""}
                      onChange={(e) => setAmount(Number(e.target.value) || undefined)}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-surface-900 mb-1">
                  Internal Notes (Optional)
                </label>
                <textarea
                  className="w-full text-sm border-surface-300 rounded-lg focus:border-brand-500 focus:ring-brand-500"
                  rows={2}
                  placeholder="Private notes for the funding organization..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <div className="p-6 border-t border-surface-200 bg-surface-50 flex justify-end gap-3 shrink-0">
              <Button variant="outline" onClick={resetForm} disabled={saving}>
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm} 
                disabled={saving || isRejectInvalid || isInfoInvalid}
                className={
                  activeModal === 'Rejected' ? 'bg-red-600 hover:bg-red-700' :
                  activeModal === 'Awarded' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-brand-600 hover:bg-brand-700'
                }
              >
                {saving ? 'Saving...' : `Confirm ${activeModal}`}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
