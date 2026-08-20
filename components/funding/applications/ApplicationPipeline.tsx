"use client";

import React from "react";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { ApplicationStatus } from "@/types/funding/applications";
import { cn } from "@/lib/funding/utils";

const PIPELINE_STAGES: (ApplicationStatus | "All")[] = [
  "All",
  "Submitted",
  "Eligibility Screening",
  "Technical Review",
  "Due Diligence",
  "Shortlisted",
  "Awarded",
  "Rejected",
  "More Information Required"
];

export function ApplicationPipeline() {
  const { applications, statusFilter, setStatusFilter } = useApplications();

  const counts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = stage === "All" 
      ? applications.length 
      : applications.filter(a => a.status === stage).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white border-b border-surface-200">
      {/* KPI Strip */}
      <div className="px-4 py-4 flex items-center gap-4 lg:gap-6 overflow-x-auto">
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Total Applications</div>
          <div className="text-2xl font-black text-surface-900">{counts["All"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Pending Review</div>
          <div className="text-2xl font-black text-brand-600">{counts["Submitted"] + counts["Eligibility Screening"] + counts["Technical Review"] + counts["Due Diligence"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Shortlisted</div>
          <div className="text-2xl font-black text-amber-600">{counts["Shortlisted"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Awarded</div>
          <div className="text-2xl font-black text-emerald-600">{counts["Awarded"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Avg Review Time</div>
          <div className="text-2xl font-black text-surface-900">4.2 <span className="text-sm font-semibold text-surface-500 lowercase">days</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-2 flex items-center overflow-x-auto no-scrollbar">
        {PIPELINE_STAGES.map(stage => {
          const isActive = statusFilter === stage;
          return (
            <button
              key={stage}
              onClick={() => setStatusFilter(stage)}
              className={cn(
                "relative px-3 py-3 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5",
                isActive ? "text-brand-700" : "text-surface-500 hover:text-surface-900"
              )}
            >
              {stage}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                isActive ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-600"
              )}>
                {counts[stage]}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
