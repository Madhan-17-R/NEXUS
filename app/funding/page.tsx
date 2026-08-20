"use client";

import React from "react";
import { AppLayout } from "@/components/funding/layout/AppLayout";
import { PromptCard } from "@/components/funding/dashboard/PromptCard";
import { SummaryKPIs } from "@/components/funding/dashboard/SummaryKPIs";
import { GrantOverview } from "@/components/funding/dashboard/GrantOverview";
import { ApplicationPipeline } from "@/components/funding/dashboard/ApplicationPipeline";
import { DirectPitchMonitor } from "@/components/funding/dashboard/DirectPitchMonitor";
import { RecentActivityFeed } from "@/components/funding/dashboard/RecentActivityFeed";
import { QuickActions } from "@/components/funding/dashboard/QuickActions";
import { GrantDetailModal } from "@/components/funding/dashboard/GrantDetailModal";
import { PitchDetailModal } from "@/components/funding/dashboard/PitchDetailModal";
import { NewGrantQuickModal } from "@/components/funding/dashboard/NewGrantQuickModal";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";

export default function FundingOrgDashboardPage() {
  const { isLoading } = useFundingOrg();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
            <svg
              className="animate-spin h-8 w-8 text-emerald-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          </div>
          <h3 className="text-sm font-bold text-surface-900 font-heading">
            Loading SkillForge Funding Portal...
          </h3>
          <p className="text-xs text-surface-500">
            Synchronizing active grant rounds, pipelines, and direct pitches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      {/* 1. Prompt Creation Card (Matching top of reference screenshot) */}
      <PromptCard />

      {/* 2. Primary KPI Summary Cards */}
      <SummaryKPIs />

      {/* 3. Grant Programs & Rounds Overview (Matching reference cards) */}
      <GrantOverview />

      {/* 4. Application Pipeline & Funnel Breakdown */}
      <ApplicationPipeline />

      {/* 5. Direct Pitch Intake Monitor */}
      <DirectPitchMonitor />

      {/* 6. Two-Column Activity Audit Stream & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RecentActivityFeed />
        <QuickActions />
      </div>

      {/* Modals & Dialogs */}
      <GrantDetailModal />
      <PitchDetailModal />
      <NewGrantQuickModal />
    </AppLayout>
  );
}
