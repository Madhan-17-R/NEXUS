"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Modal } from "@/components/funding/ui/Modal";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { formatCurrency } from "@/lib/funding/utils";
import {
  Award,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function GrantDetailModal() {
  const { selectedGrant, setSelectedGrant, addToast } = useFundingOrg();

  if (!selectedGrant) return null;

  const disbursedPercent = Math.round(
    (selectedGrant.disbursed / selectedGrant.totalPool) * 100
  );

  return (
    <Modal
      isOpen={!!selectedGrant}
      onClose={() => setSelectedGrant(null)}
      title={selectedGrant.title}
      description={`Program Code: ${selectedGrant.code} • ${selectedGrant.category}`}
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Badge variant={selectedGrant.statusVariant} size="md" dot>
            Status: {selectedGrant.stage}
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedGrant(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                addToast({
                  type: "info",
                  title: "Entering Grant Management",
                  message: `Grant management and application review for ${selectedGrant.code} will be fully customizable in Phase 2.`,
                });
                setSelectedGrant(null);
              }}
            >
              Manage Applications ({selectedGrant.applicationCount})
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Description & Category */}
        <div className="p-4 bg-surface-50 rounded-xl border border-surface-200">
          <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-1">
            Program Overview
          </h4>
          <p className="text-xs sm:text-sm text-surface-700 leading-relaxed">
            {selectedGrant.description}
          </p>
        </div>

        {/* Financial & Pool Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm">
            <span className="text-[11px] font-semibold text-surface-400 block uppercase">
              Total Capital Pool
            </span>
            <div className="text-lg font-bold text-surface-900 mt-1 font-heading">
              {formatCurrency(selectedGrant.totalPool)}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              {disbursedPercent}% Disbursed
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm">
            <span className="text-[11px] font-semibold text-surface-400 block uppercase">
              Award Range / Applicant
            </span>
            <div className="text-lg font-bold text-surface-900 mt-1 font-heading">
              {formatCurrency(selectedGrant.minAward)} - {formatCurrency(selectedGrant.maxAward)}
            </div>
            <span className="text-[11px] text-surface-500 font-medium">
              Non-dilutive milestone grant
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm">
            <span className="text-[11px] font-semibold text-surface-400 block uppercase">
              Submission Deadline
            </span>
            <div className="text-lg font-bold text-surface-900 mt-1 font-heading">
              {selectedGrant.deadline}
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              {selectedGrant.daysLeft > 0 ? `${selectedGrant.daysLeft} days remaining` : "Intake Closed"}
            </span>
          </div>
        </div>

        {/* Application Stage Breakdown */}
        <div className="p-4 bg-white rounded-xl border border-surface-200 shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-surface-900 font-heading">
            Application Intake Breakdown
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 bg-surface-50 rounded-lg border border-surface-100">
              <span className="text-[10px] text-surface-400 block font-semibold uppercase">Total</span>
              <span className="text-base font-bold text-surface-900">{selectedGrant.applicationCount}</span>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-[10px] text-amber-800 block font-semibold uppercase">Pending</span>
              <span className="text-base font-bold text-amber-700">{selectedGrant.pendingReview}</span>
            </div>
            <div className="p-2.5 bg-brand-50 rounded-lg border border-brand-100">
              <span className="text-[10px] text-brand-800 block font-semibold uppercase">Shortlist</span>
              <span className="text-base font-bold text-brand-700">{selectedGrant.shortlisted}</span>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-emerald-800 block font-semibold uppercase">Awarded</span>
              <span className="text-base font-bold text-emerald-700">{selectedGrant.awarded}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
