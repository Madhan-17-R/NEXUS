"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FullGrant } from "@/types/funding";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { Tabs } from "@/components/funding/ui/Tabs";
import { useGrants } from "@/context/funding/GrantsContext";
import {
  X, Pencil, Copy, XCircle, MoreHorizontal,
  DollarSign, Users, Calendar, Clock, CheckCircle,
  AlertCircle, FileText, Activity, Globe, BookOpen,
  Zap, Building2, ArrowUpRight, Target, Layers, Eye
} from "lucide-react";
import { cn } from "@/lib/funding/utils";

const statusConfig: Record<string, { label: string; badge: "success" | "warning" | "neutral" | "danger" | "info" }> = {
  active: { label: "Intake Active", badge: "success" },
  draft: { label: "Draft", badge: "neutral" },
  closed: { label: "Closed", badge: "danger" },
  in_review: { label: "In Review", badge: "warning" },
  closing_soon: { label: "Closing Soon", badge: "warning" },
};

function formatCurrency(amount: number) {
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

function Section({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <div className="bg-surface-50 rounded-xl p-4 border border-surface-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider">{title}</h4>
        {onEdit && (
          <button onClick={onEdit} className="text-xs text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 transition-smooth">
            <Pencil className="w-3 h-3" /> Edit
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

interface GrantDetailPanelProps {
  grant: FullGrant;
  onClose: () => void;
}

export function GrantDetailPanel({ grant, onClose }: GrantDetailPanelProps) {
  const router = useRouter();
  const { closeGrant, duplicateGrant, editGrant } = useGrants();
  const [activeTab, setActiveTab] = useState("overview");
  const cfg = statusConfig[grant.status] ?? statusConfig.draft;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "details", label: "Details" },
    { id: "eligibility", label: "Eligibility" },
    { id: "funding", label: "Funding & Timeline" },
    { id: "form", label: "Application Form" },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-950/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full overflow-hidden animate-slide-in">
        {/* Panel Header */}
        <div className="border-b border-surface-200 px-6 py-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={cfg.badge} size="sm" dot={grant.status === "active" || grant.status === "in_review"}>
                  {cfg.label}
                </Badge>
                <span className="text-xs text-surface-400 font-mono">{grant.code}</span>
                {grant.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                    <Building2 className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-surface-900 leading-snug">{grant.title}</h2>
              <p className="text-xs text-surface-500 mt-0.5">{grant.domain} · {grant.programType}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button 
                variant="outline" 
                size="sm" 
                leftIcon={<Pencil className="w-3.5 h-3.5" />}
                onClick={() => editGrant(grant)}
              >
                Edit Grant
              </Button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-smooth"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 mt-4 overflow-x-auto pb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-smooth",
                  activeTab === tab.id
                    ? "bg-surface-900 text-white"
                    : "text-surface-500 hover:text-surface-900 hover:bg-surface-100"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: DollarSign, label: "Total Pool", value: formatCurrency(grant.totalPool), sub: `${formatCurrency(grant.minAward)}–${formatCurrency(grant.maxAward)}`, color: "text-emerald-600 bg-emerald-50" },
                  { icon: Users, label: "Applications", value: String(grant.applicationCount), sub: `${grant.pendingReview} pending`, color: "text-sky-600 bg-sky-50" },
                  { icon: Calendar, label: "Deadline", value: grant.timeline.deadline || "TBD", sub: grant.daysLeft > 0 ? `${grant.daysLeft}d left` : "Closed", color: "text-amber-600 bg-amber-50" },
                  { icon: Target, label: "Awards", value: String(grant.numberOfAwards), sub: `${grant.awarded} disbursed`, color: "text-purple-600 bg-purple-50" },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-xl border border-surface-200 p-3 flex items-center gap-3">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", m.color)}>
                      <m.icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs text-surface-500">{m.label}</div>
                      <div className="text-sm font-bold text-surface-900">{m.value}</div>
                      <div className="text-[10px] text-surface-400">{m.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 mb-2">
                <Button 
                  variant="primary" 
                  className="w-full justify-between group" 
                  onClick={() => router.push(`/funding/grants/${grant.id}/applications`)}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>View Applications ({grant.applicationCount})</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-brand-300 group-hover:text-white transition-colors" />
                </Button>
              </div>

              <Section title="Description">
                <p className="text-sm text-surface-700 leading-relaxed">{grant.description || grant.shortDescription}</p>
              </Section>

              <Section title="Focus Areas">
                <div className="flex flex-wrap gap-1.5">
                  {grant.focusAreas.map(fa => (
                    <span key={fa} className="text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-0.5 rounded-full">
                      {fa}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Tags">
                <div className="flex flex-wrap gap-1.5">
                  {grant.tags.map(tag => (
                    <span key={tag} className="text-xs text-surface-600 bg-surface-100 border border-surface-200 px-2.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* ELIGIBILITY TAB */}
          {activeTab === "eligibility" && (
            <>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 text-sm">
                <div className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2">Eligibility Summary</div>
                <div className="space-y-1 text-surface-700">
                  <div><span className="font-semibold">Applicants must be: </span>
                    <span className="text-brand-700 font-semibold">{grant.eligibility.applicantTypes.join(" OR ")}</span>
                  </div>
                  {grant.eligibility.domains.length > 0 && (
                    <div><span className="font-semibold">AND Domain = </span>
                      <span className="text-brand-700 font-semibold">{grant.eligibility.domains.join(", ")}</span>
                    </div>
                  )}
                  <div><span className="font-semibold">AND Location = </span>
                    <span className="text-brand-700 font-semibold">{grant.eligibility.geography}</span>
                  </div>
                </div>
              </div>

              <Section title="Applicant Types">
                <div className="flex flex-wrap gap-2">
                  {grant.eligibility.applicantTypes.map(t => (
                    <Badge key={t} variant="info" size="sm">{t}</Badge>
                  ))}
                </div>
              </Section>

              <Section title="Education Level">
                <div className="flex flex-wrap gap-2">
                  {grant.eligibility.educationLevels.map(e => (
                    <Badge key={e} variant="neutral" size="sm">{e}</Badge>
                  ))}
                </div>
              </Section>

              <Section title="Required Skills">
                <div className="flex flex-wrap gap-1.5">
                  {grant.eligibility.skills.map(s => (
                    <span key={s} className="text-xs font-medium bg-surface-900 text-white px-2.5 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Geography">
                <div className="flex items-center gap-2 text-sm text-surface-700">
                  <Globe className="w-4 h-4 text-surface-400" />
                  <span className="font-semibold">{grant.eligibility.geography}</span>
                </div>
              </Section>

              {grant.eligibility.additionalRequirements && (
                <Section title="Additional Requirements">
                  <p className="text-sm text-surface-700 leading-relaxed">{grant.eligibility.additionalRequirements}</p>
                </Section>
              )}
            </>
          )}

          {/* FUNDING & TIMELINE TAB */}
          {activeTab === "funding" && (
            <>
              <Section title="Funding Configuration">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Total Pool", value: formatCurrency(grant.totalPool) },
                    { label: "Currency", value: grant.currency },
                    { label: "Min Award", value: formatCurrency(grant.minAward) },
                    { label: "Max Award", value: formatCurrency(grant.maxAward) },
                    { label: "No. of Awards", value: String(grant.numberOfAwards) },
                    { label: "Funding Type", value: grant.fundingType },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">{item.label}</div>
                      <div className="font-semibold text-surface-900 mt-0.5">{item.value}</div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Timeline">
                <div className="space-y-3">
                  {[
                    { icon: Calendar, label: "Applications Open", date: grant.timeline.openingDate, color: "text-emerald-600 bg-emerald-50" },
                    { icon: Clock, label: "Application Deadline", date: grant.timeline.deadline, color: "text-amber-600 bg-amber-50" },
                    { icon: BookOpen, label: "Review Period Ends", date: grant.timeline.reviewPeriodEnd, color: "text-sky-600 bg-sky-50" },
                    { icon: CheckCircle, label: "Decision Date", date: grant.timeline.decisionDate, color: "text-purple-600 bg-purple-50" },
                    { icon: Zap, label: "Funding Start", date: grant.timeline.fundingStartDate, color: "text-brand-600 bg-brand-50" },
                  ].map((item, i) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", item.color)}>
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-surface-500">{item.label}</div>
                        <div className="text-sm font-semibold text-surface-900">{item.date || "Not set"}</div>
                      </div>
                      {i < 4 && <div className="w-px h-4 bg-surface-200 ml-4" />}
                    </div>
                  ))}
                </div>

                {/* Visual timeline bar */}
                <div className="mt-4 flex items-center gap-1 text-[10px] font-medium text-surface-500 overflow-x-auto">
                  {[grant.timeline.openingDate, "→", grant.timeline.deadline, "→", "Review", "→", grant.timeline.decisionDate].map((t, i) => (
                    <span key={i} className={t === "→" ? "text-surface-300" : "bg-surface-100 border border-surface-200 rounded px-1.5 py-0.5 whitespace-nowrap"}>
                      {t}
                    </span>
                  ))}
                </div>
              </Section>
            </>
          )}

          {/* APPLICATION FORM TAB */}
          {activeTab === "form" && (
            <div className="space-y-4">
              {grant.applicationForm.status === "not_configured" ? (
                <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
                  <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                    <FileText className="w-7 h-7 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-surface-900 mb-1">Application Form Not Configured</h3>
                    <p className="text-sm text-surface-500 max-w-xs">
                      Create a customized application form to collect the information required from innovators.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="primary" size="sm" leftIcon={<Layers className="w-4 h-4" />} onClick={() => router.push(`/funding/grants/${grant.id}/form`)}>
                      Customize Application Form
                    </Button>
                    <Button variant="outline" size="sm">Use Template</Button>
                  </div>
                  <p className="text-xs text-surface-400 font-medium">
                    Dynamic Form Builder · Phase 3
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-emerald-800">Application Form Ready</div>
                      <div className="text-xs text-emerald-600">Last updated {grant.applicationForm.lastUpdated}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Total Fields", value: grant.applicationForm.totalFields },
                      { label: "Sections", value: grant.applicationForm.totalSections },
                      { label: "Required", value: grant.applicationForm.requiredFields },
                      { label: "Optional", value: grant.applicationForm.optionalFields },
                    ].map(m => (
                      <div key={m.label} className="bg-white border border-surface-200 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-surface-900">{m.value}</div>
                        <div className="text-xs text-surface-500 mt-0.5">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <Section title="Form Sections">
                    <div className="space-y-1.5">
                      {grant.applicationForm.sections.map((s, i) => (
                        <div key={s} className="flex items-center gap-2 text-sm text-surface-700">
                          <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          {s}
                        </div>
                      ))}
                    </div>
                  </Section>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<Pencil className="w-3.5 h-3.5" />} onClick={() => router.push(`/funding/grants/${grant.id}/form`)}>Edit Form</Button>
                    <Button variant="secondary" size="sm" leftIcon={<Eye className="w-3.5 h-3.5" />} onClick={() => router.push(`/funding/grants/${grant.id}/form`)}>Preview Form</Button>
                  </div>

                  <p className="text-xs text-surface-400 text-center">Full Form Builder available in Phase 3</p>
                </>
              )}
            </div>
          )}

          {/* ACTIVITY TAB */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {grant.activity.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Activity className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-surface-900">{item.action}</div>
                    <div className="text-xs text-surface-500">{item.description}</div>
                    <div className="text-[10px] text-surface-400 mt-0.5">
                      {item.actor} · {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DETAILS TAB */}
          {activeTab === "details" && (
            <Section title="Grant Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: "Grant ID", value: grant.code },
                  { label: "Status", value: cfg.label },
                  { label: "Domain", value: grant.domain },
                  { label: "Program Type", value: grant.programType },
                  { label: "Funding Type", value: grant.fundingType },
                  { label: "Organization", value: grant.organizationName },
                  { label: "Created", value: new Date(grant.createdAt).toLocaleDateString() },
                  { label: "Updated", value: new Date(grant.updatedAt).toLocaleDateString() },
                ].map(item => (
                  <div key={item.label}>
                    <div className="text-[10px] text-surface-400 uppercase tracking-wider font-medium">{item.label}</div>
                    <div className="font-semibold text-surface-900 mt-0.5">{item.value}</div>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Panel Footer */}
        <div className="border-t border-surface-200 px-6 py-3 shrink-0 flex items-center justify-between gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Copy className="w-3.5 h-3.5" />}
              onClick={() => duplicateGrant(grant)}
            >
              Duplicate
            </Button>
            {grant.status !== "closed" && (
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-500" />}
                className="text-rose-600 hover:bg-rose-50"
                onClick={() => closeGrant(grant)}
              >
                Close Grant
              </Button>
            )}
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
            onClick={() => router.push(`/funding/grants/${grant.id}/applications`)}
          >
            Open Full Page
          </Button>
        </div>
      </div>
    </div>
  );
}


