"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { Plus, CheckSquare, Sparkles, Download, Building } from "lucide-react";

export function DashboardHeader() {
  const { org, setIsCreateGrantOpen, addToast } = useFundingOrg();

  const handleExportReport = () => {
    addToast({
      type: "info",
      title: "Generating Report",
      message: "Exporting Q3 Capital Deployment & Grant Allocation summary (PDF/CSV)...",
    });
    setTimeout(() => {
      addToast({
        type: "success",
        title: "Report Exported",
        message: "Funding Performance Report Q3-2026 downloaded successfully.",
      });
    }, 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-card mb-6 transition-smooth">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Org Title and Context */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
              Funding Organization Workspace
            </span>
            <Badge variant="brand" size="sm" dot>
              {org?.badge || "Verified Global Partner"}
            </Badge>
            <Badge variant="neutral" size="sm">
              {org?.cycle || "FY 2025–2026 / Q3"}
            </Badge>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-surface-900 font-heading tracking-tight">
            Welcome back, {org?.currentUser.name.split(" ")[0] || "Rachel"}
          </h2>
          <p className="text-xs sm:text-sm text-surface-600 max-w-2xl leading-relaxed">
            Monitor active grant allocations, evaluate incoming innovator applications, and review direct pitches across your deep-tech and sustainable funding portfolio.
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4 text-surface-500" />}
            onClick={handleExportReport}
          >
            Export Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateGrantOpen(true)}
          >
            Create Grant Round
          </Button>
        </div>
      </div>
    </div>
  );
}
