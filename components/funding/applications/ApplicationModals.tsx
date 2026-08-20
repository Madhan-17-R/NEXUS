"use client";

import React, { useState } from "react";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { Button } from "@/components/funding/ui/Button";
import { X, MessageSquare, CheckCircle, AlertTriangle, Send } from "lucide-react";
import { ConfirmDialog } from "@/components/funding/ui/ConfirmDialog";

interface ApplicationModalsProps {
  appId: string;
  activeModal: "shortlist" | "award" | "reject" | "request_info" | null;
  onClose: () => void;
}

export function ApplicationModals({ appId, activeModal, onClose }: ApplicationModalsProps) {
  const { updateStatus, requestInfo } = useApplications();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!activeModal) return null;

  const handleAction = async (statusUpdate: Parameters<typeof updateStatus>[1]) => {
    setLoading(true);
    try {
      await updateStatus(appId, statusUpdate);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleRequestInfo = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      await requestInfo(appId, reason);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/60 backdrop-blur-sm" onClick={onClose} />
      
      {activeModal === "shortlist" && (
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-surface-900 mb-2">Shortlist Application?</h2>
          <p className="text-sm text-surface-500 mb-6">Move this application to the shortlist for further evaluation.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant="secondary" onClick={() => handleAction("Shortlisted")} disabled={loading}>Shortlist</Button>
          </div>
        </div>
      )}

      {activeModal === "award" && (
        <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-surface-900 mb-2">Approve Application?</h2>
          <p className="text-sm text-surface-500 mb-6">This application will be marked as approved for funding.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant="primary" onClick={() => handleAction("Awarded")} disabled={loading}>Approve</Button>
          </div>
        </div>
      )}

      {activeModal === "reject" && (
        <ConfirmDialog
          isOpen={true}
          onClose={onClose}
          title="Reject Application?"
          message="Are you sure you want to reject this application? This action cannot be undone."
          confirmLabel="Reject Application"
          isDestructive={true}
          isLoading={loading}
          onConfirm={() => handleAction("Rejected")}
        >
          <div className="mt-2">
            <label className="block text-xs font-semibold text-surface-500 mb-1.5">Reason (Optional)</label>
            <textarea
              className="w-full border border-surface-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 bg-surface-50"
              rows={3}
              placeholder="Eligibility, technical fit, etc."
            />
          </div>
        </ConfirmDialog>
      )}

      {activeModal === "request_info" && (
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-surface-900">Request More Information</h2>
            </div>
            <button onClick={onClose} className="p-2 text-surface-400 hover:bg-surface-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-surface-500 mb-4">Ask the applicant to provide additional information before continuing the review.</p>
          
          <div className="mb-6">
            <label className="block text-xs font-semibold text-surface-500 mb-1.5">What information do you need?</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border border-surface-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              rows={4}
              placeholder="Please provide details about..."
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-auto">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button variant="primary" onClick={handleRequestInfo} disabled={loading || !reason.trim()} leftIcon={<Send className="w-4 h-4" />}>
              Send Request
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
