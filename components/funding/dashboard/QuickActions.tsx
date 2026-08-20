"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Card, CardHeader, CardContent } from "@/components/funding/ui/Card";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import {
  Zap,
  PlusCircle,
  CheckSquare,
  Sparkles,
  DollarSign,
  UserPlus,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export function QuickActions() {
  const {
    setIsCreateGrantOpen,
    toggleDirectPitch,
    org,
    addToast,
  } = useFundingOrg();

  const actions = [
    {
      id: "create_grant",
      title: "Initialize Grant Round",
      description: "Define allocation pools, eligibility criteria, and launch customizable application form.",
      icon: PlusCircle,
      iconBg: "bg-brand-50 text-brand-600",
      badge: "Phase 2",
      badgeVariant: "brand" as const,
      onClick: () => setIsCreateGrantOpen(true),
    },
    {
      id: "review_queue",
      title: `Assess Pending Applications (${org?.pendingReviewCount || 42})`,
      description: "Jump into scoring queue for NextGen CleanTech & BioHealth applicant submissions.",
      icon: CheckSquare,
      iconBg: "bg-amber-50 text-amber-600",
      badge: "42 Pending",
      badgeVariant: "warning" as const,
      onClick: () => {
        addToast({
          type: "info",
          title: "Application Review Queue",
          message: "Navigating to Phase 4 Application Review Queue with 42 pending submissions.",
        });
      },
    },
    {
      id: "pitch_settings",
      title: "Direct Pitch Intake Settings",
      description: org?.directPitchEnabled
        ? "Intake currently active. Customize pitch prompt requirements or pause public submissions."
        : "Intake currently paused. Enable public portal to receive deep-tech innovator pitches.",
      icon: Sparkles,
      iconBg: "bg-purple-50 text-purple-600",
      badge: org?.directPitchEnabled ? "Active" : "Paused",
      badgeVariant: org?.directPitchEnabled ? ("success" as const) : ("neutral" as const),
      onClick: () => toggleDirectPitch(!org?.directPitchEnabled),
    },
    {
      id: "disburse_milestones",
      title: "Disburse Milestone Payouts",
      description: "Review deliverables and release verified grant capital tranches to awarded ventures.",
      icon: DollarSign,
      iconBg: "bg-emerald-50 text-emerald-600",
      badge: "Finance",
      badgeVariant: "success" as const,
      onClick: () => {
        addToast({
          type: "success",
          title: "Milestones Verified",
          message: "All verified milestone tranches are ready for automated release.",
        });
      },
    },
  ];

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="p-5 border-b border-surface-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-surface-900 font-heading">
                Quick Actions Hub
              </h3>
            </div>
            <p className="text-xs text-surface-500">
              High-frequency operations for funding managers and review chairs.
            </p>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                onClick={action.onClick}
                className="p-4 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:border-brand-300 hover:shadow-card-hover transition-smooth cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center ${action.iconBg}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-surface-900 group-hover:text-brand-600 transition-smooth font-heading">
                        {action.title}
                      </h4>
                      <Badge variant={action.badgeVariant} size="sm">
                        {action.badge}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-surface-500 leading-snug">
                      {action.description}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 pt-1 text-surface-400 group-hover:text-brand-600 transition-smooth">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </CardContent>
      </div>

      <div className="p-4 bg-surface-50/80 border-t border-surface-100 rounded-b-xl flex items-center justify-between text-xs">
        <span className="text-surface-500 font-medium">Need custom review workflows?</span>
        <button
          onClick={() =>
            addToast({
              type: "info",
              title: "Form Builder Preview",
              message: "Phase 3 dynamic drag-and-drop form builder supports custom criteria and application fields.",
            })
          }
          className="font-semibold text-brand-600 hover:text-brand-700 transition-smooth"
        >
          Form Builder Rules
        </button>
      </div>
    </Card>
  );
}
