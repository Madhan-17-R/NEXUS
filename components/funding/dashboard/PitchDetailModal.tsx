"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Modal } from "@/components/funding/ui/Modal";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { Avatar } from "@/components/funding/ui/Avatar";
import {
  Sparkles,
  DollarSign,
  FileText,
  Mail,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function PitchDetailModal() {
  const { selectedPitch, setSelectedPitch, addToast } = useFundingOrg();

  if (!selectedPitch) return null;

  const handleAction = (action: string) => {
    addToast({
      type: "success",
      title: `Pitch ${action}`,
      message: `${selectedPitch.company}'s proposal has been marked as ${action.toLowerCase()}. Innovator notified via SkillForge messaging.`,
    });
    setSelectedPitch(null);
  };

  return (
    <Modal
      isOpen={!!selectedPitch}
      onClose={() => setSelectedPitch(null)}
      title="Direct Pitch Evaluation"
      description={`Submission ID: ${selectedPitch.id} • ${selectedPitch.submittedAt}`}
      size="lg"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedPitch(null)}
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
              leftIcon={<XCircle className="w-4 h-4" />}
              onClick={() => handleAction("Declined")}
            >
              Decline
            </Button>

            <Button
              variant="secondary"
              size="sm"
              leftIcon={<MessageSquare className="w-4 h-4" />}
              onClick={() => {
                addToast({
                  type: "info",
                  title: "Direct Chat Ready",
                  message: `Initiating context-aware chat session with ${selectedPitch.innovator} (${selectedPitch.company}).`,
                });
              }}
            >
              Message Innovator
            </Button>

            <Button
              variant="primary"
              size="sm"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
              onClick={() => handleAction("Shortlisted")}
            >
              Shortlist for Review
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Innovator Profile Snippet */}
        <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              src={selectedPitch.avatar}
              name={selectedPitch.innovator}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-surface-900 font-heading">
                  {selectedPitch.innovator}
                </h4>
                <ShieldCheck className="w-4 h-4 text-brand-600" />
              </div>
              <p className="text-xs text-surface-600 font-medium">
                {selectedPitch.company} • {selectedPitch.category}
              </p>
              <div className="flex items-center gap-1 text-[11px] text-surface-400 mt-1">
                <Mail className="w-3 h-3" />
                <span>{selectedPitch.contactEmail}</span>
              </div>
            </div>
          </div>

          <Badge variant="purple" size="md">
            {selectedPitch.stage}
          </Badge>
        </div>

        {/* Pitch Headline & Summary */}
        <div className="space-y-2">
          <h3 className="text-base font-bold text-surface-900 font-heading">
            {selectedPitch.title}
          </h3>
          <p className="text-xs sm:text-sm text-surface-700 leading-relaxed bg-white p-4 rounded-xl border border-surface-200">
            {selectedPitch.summary}
          </p>
        </div>

        {/* Ask & Traction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-surface-400 block uppercase">
              Funding Ask
            </span>
            <div className="text-xl font-bold text-emerald-700 font-heading">
              {selectedPitch.askAmount}
            </div>
            <span className="text-[11px] text-surface-500">Non-dilutive grant / SAFE</span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm space-y-1">
            <span className="text-[11px] font-semibold text-surface-400 block uppercase">
              Technology Readiness Level
            </span>
            <div className="text-sm font-bold text-surface-900 font-heading">
              {selectedPitch.readiness}
            </div>
            <span className="text-[11px] text-brand-600">Validated research prototype</span>
          </div>
        </div>

        {/* Traction & Supporting Materials */}
        <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-surface-400 block uppercase">
            Demonstrated Traction &amp; Patents
          </span>
          <p className="text-xs text-surface-700 leading-relaxed font-medium">
            {selectedPitch.traction}
          </p>

          <div className="pt-3 border-t border-surface-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-surface-700">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Pitch_Deck_and_Financial_Model.pdf (14 Pages)</span>
            </div>
            <Button
              variant="outline"
              size="xs"
              rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              onClick={() => {
                addToast({
                  type: "info",
                  title: "Document Preview",
                  message: "Opening encrypted pitch deck in secure viewer...",
                });
              }}
            >
              View Deck
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
