"use client";

import React from "react";
import { useDirectPitches } from "@/context/funding/DirectPitchesContext";
import { DirectPitchStatus } from "@/types/funding/directPitches";
import { cn } from "@/lib/funding/utils";

const PIPELINE_STAGES: (DirectPitchStatus | "All")[] = [
  "All",
  "New",
  "Initial Review",
  "Technical Review",
  "Shortlisted",
  "Awarded",
  "Rejected",
  "More Information Required"
];

export function PitchPipeline() {
  const { pitches, statusFilter, setStatusFilter } = useDirectPitches();

  const counts = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = stage === "All" 
      ? pitches.length 
      : pitches.filter(p => p.status === stage).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm mb-6">
      <div className="px-6 py-5 border-b border-surface-200">
        <h2 className="text-lg font-bold text-surface-900">Incoming Pitches</h2>
      </div>

      {/* KPI Strip */}
      <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-6 overflow-x-auto">
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Total Pitches</div>
          <div className="text-2xl font-black text-surface-900">{counts["All"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">New</div>
          <div className="text-2xl font-black text-brand-600">{counts["New"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Under Review</div>
          <div className="text-2xl font-black text-sky-600">{counts["Initial Review"] + counts["Technical Review"]}</div>
        </div>
        <div className="w-px h-8 bg-surface-200 shrink-0" />
        <div className="min-w-fit">
          <div className="text-xs font-bold text-surface-500 uppercase tracking-wider">Shortlisted</div>
          <div className="text-2xl font-black text-amber-600">{counts["Shortlisted"]}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex items-center gap-1 overflow-x-auto no-scrollbar bg-surface-50/50">
        {PIPELINE_STAGES.map(stage => {
          const isActive = statusFilter === stage;
          return (
            <button
              key={stage}
              onClick={() => setStatusFilter(stage)}
              className={cn(
                "relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2",
                isActive ? "text-brand-700" : "text-surface-500 hover:text-surface-900"
              )}
            >
              {stage}
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                isActive ? "bg-brand-100 text-brand-700" : "bg-surface-200 text-surface-600"
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
