"use client";

import React from "react";
import { useGrants } from "@/context/funding/GrantsContext";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import {
  XCircle, Copy, AlertTriangle, CheckCircle2,
  Calendar, DollarSign, FileText, Eye, Plus, Zap
} from "lucide-react";
import { FullGrant } from "@/types/funding";
import { cn } from "@/lib/funding/utils";

function ConfirmDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel,
  confirmVariant,
  onConfirm,
  icon,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant: "danger" | "primary";
  onConfirm: () => void;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-surface-900">{title}</h3>
            <p className="text-sm text-surface-500 mt-1">{description}</p>
          </div>
        </div>
        {children}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant={confirmVariant} size="sm" onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

export function CloseGrantModal() {
  const { closeConfirmGrant, cancelCloseGrant, confirmCloseGrant } = useGrants();
  return (
    <ConfirmDialog
      open={Boolean(closeConfirmGrant)}
      onClose={cancelCloseGrant}
      title="Unpublish Grant?"
      description={`Are you sure you want to unpublish this grant round? Applicants will no longer be able to access it.`}
      confirmLabel="Unpublish"
      confirmVariant="danger"
      onConfirm={confirmCloseGrant}
      icon={<XCircle className="w-5 h-5 text-rose-600" />}
    >
      {closeConfirmGrant && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-600 space-y-1">
          <div className="font-semibold">This action will:</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Stop accepting new applications immediately</li>
            <li>Change grant status to Closed</li>
            <li>Existing applications remain for review</li>
          </ul>
        </div>
      )}
    </ConfirmDialog>
  );
}

export function DuplicateGrantModal() {
  const { duplicateConfirmGrant, cancelDuplicateGrant, confirmDuplicateGrant } = useGrants();
  return (
    <ConfirmDialog
      open={Boolean(duplicateConfirmGrant)}
      onClose={cancelDuplicateGrant}
      title="Duplicate Grant?"
      description={`Create a new draft based on "${duplicateConfirmGrant?.title}"?`}
      confirmLabel="Create Duplicate"
      confirmVariant="primary"
      onConfirm={confirmDuplicateGrant}
      icon={<Copy className="w-5 h-5 text-sky-600" />}
    >
      {duplicateConfirmGrant && (
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-700 space-y-1">
          <div className="font-semibold">The duplicate will:</div>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Copy all configuration as Draft</li>
            <li>Title: &quot;{duplicateConfirmGrant.title} — Copy&quot;</li>
            <li>Application form will need reconfiguration</li>
            <li>Will NOT be published automatically</li>
          </ul>
        </div>
      )}
    </ConfirmDialog>
  );
}

export function PublishSuccessModal() {
  const { publishSuccess, dismissPublishSuccess, openCreateWizard } = useGrants();
  if (!publishSuccess) return null;

  const grant = publishSuccess;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-surface-950/50 backdrop-blur-sm" onClick={dismissPublishSuccess} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Success banner */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-black text-white">Grant Published!</h2>
          <p className="text-emerald-100 text-sm mt-1">
            {grant.title} is now live and accepting applications.
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Zap, label: "Status", value: "Active", color: "text-emerald-600" },
              { icon: Calendar, label: "Deadline", value: grant.timeline.deadline || "TBD", color: "text-amber-600" },
              { icon: DollarSign, label: "Funding Pool", value: `$${(grant.totalPool / 1000).toFixed(0)}K`, color: "text-sky-600" },
              { icon: FileText, label: "Form Status", value: grant.applicationForm.status === "not_configured" ? "Needs Setup" : "Ready", color: grant.applicationForm.status === "not_configured" ? "text-amber-600" : "text-emerald-600" },
            ].map(item => (
              <div key={item.label} className="bg-surface-50 rounded-xl p-3 flex items-center gap-2">
                <item.icon className={cn("w-4 h-4 shrink-0", item.color)} />
                <div>
                  <div className="text-[10px] text-surface-400">{item.label}</div>
                  <div className={cn("text-xs font-bold", item.color)}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>

          {grant.applicationForm.status === "not_configured" && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Application form not configured — applicants cannot submit until a form is set up.</span>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-1">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Eye className="w-4 h-4" />}
              onClick={dismissPublishSuccess}
              className="w-full"
              id="publish-success-view"
            >
              View Grant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={dismissPublishSuccess}
              className="w-full"
            >
              Manage Grants
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => { dismissPublishSuccess(); openCreateWizard(); }}
              className="w-full text-surface-500"
            >
              Create Another Grant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
