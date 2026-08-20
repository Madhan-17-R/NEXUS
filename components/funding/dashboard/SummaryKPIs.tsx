"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { StatCard } from "@/components/funding/ui/StatCard";
import { Badge } from "@/components/funding/ui/Badge";
import { formatCurrency, formatNumber } from "@/lib/funding/utils";
import { DollarSign, Award, Layers, Sparkles } from "lucide-react";

export function SummaryKPIs() {
  const { org, toggleDirectPitch } = useFundingOrg();

  if (!org) return null;

  const capitalUtilization = Math.round(
    (org.totalDisbursedCapital / org.totalCommittedCapital) * 100
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {/* 1. Committed vs Disbursed Capital */}
      <StatCard
        title="Capital Deployment"
        value={formatCurrency(org.totalDisbursedCapital)}
        subtitle={`Total Committed: ${formatCurrency(org.totalCommittedCapital)}`}
        icon={<DollarSign className="w-5 h-5" />}
        iconBgColor="bg-emerald-50"
        iconTextColor="text-emerald-600"
        progress={{
          current: org.totalDisbursedCapital,
          total: org.totalCommittedCapital,
          label: "Committed Disbursed",
        }}
        badge={
          <Badge variant="success" size="sm">
            {capitalUtilization}% Disbursed
          </Badge>
        }
      />

      {/* 2. Active Grants */}
      <StatCard
        title="Grant Programs"
        value={org.activeGrantCount}
        subtitle="4 Active • 1 Under Review • 1 Draft"
        trend={{
          value: "+2 new",
          isPositive: true,
          label: "this cycle",
        }}
        icon={<Award className="w-5 h-5" />}
        iconBgColor="bg-brand-50"
        iconTextColor="text-brand-600"
        badge={
          <Badge variant="brand" size="sm">
            Active
          </Badge>
        }
      />

      {/* 3. Applications Pipeline */}
      <StatCard
        title="Applications in Pipeline"
        value={formatNumber(org.totalApplications)}
        subtitle={`${org.pendingReviewCount} pending review assessment`}
        trend={{
          value: "+18.4%",
          isPositive: true,
          label: "vs last month",
        }}
        icon={<Layers className="w-5 h-5" />}
        iconBgColor="bg-amber-50"
        iconTextColor="text-amber-600"
        badge={
          <Badge variant="warning" size="sm" dot>
            {org.pendingReviewCount} Need Review
          </Badge>
        }
      />

      {/* 4. Direct Pitches Monitor */}
      <StatCard
        title="Direct Pitch Portal"
        value={org.incomingPitchesCount}
        subtitle={
          org.directPitchEnabled
            ? "Portal Active • 8 in review"
            : "Portal Paused • Intake closed"
        }
        trend={{
          value: "+6 new",
          isPositive: true,
          label: "this week",
        }}
        icon={<Sparkles className="w-5 h-5" />}
        iconBgColor="bg-purple-50"
        iconTextColor="text-purple-600"
        badge={
          <Badge
            variant={org.directPitchEnabled ? "success" : "neutral"}
            size="sm"
            dot={org.directPitchEnabled}
          >
            {org.directPitchEnabled ? "Accepting Pitches" : "Paused"}
          </Badge>
        }
      />
    </div>
  );
}
