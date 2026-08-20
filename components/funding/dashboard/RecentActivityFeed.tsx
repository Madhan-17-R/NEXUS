"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Card, CardHeader, CardContent } from "@/components/funding/ui/Card";
import { Badge } from "@/components/funding/ui/Badge";
import { Avatar } from "@/components/funding/ui/Avatar";
import { Button } from "@/components/funding/ui/Button";
import {
  Activity,
  FileText,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Settings,
  ArrowRight,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/funding/utils";
import { ActivityType } from "@/types/funding";

export function RecentActivityFeed() {
  const {
    activities,
    activeActivityFilter,
    setActiveActivityFilter,
    addToast,
  } = useFundingOrg();

  const filterOptions: { id: string; label: string }[] = [
    { id: "all", label: "All Activity" },
    { id: "application", label: "Applications" },
    { id: "pitch", label: "Direct Pitches" },
    { id: "review", label: "Evaluations" },
    { id: "disbursement", label: "Payouts" },
  ];

  const filteredActivities = activities.filter((act) => {
    if (activeActivityFilter === "all") return true;
    return act.type === activeActivityFilter;
  });

  const getIconForType = (type: ActivityType) => {
    switch (type) {
      case "application":
        return <FileText className="w-4 h-4 text-sky-600" />;
      case "pitch":
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case "review":
        return <CheckCircle2 className="w-4 h-4 text-amber-600" />;
      case "disbursement":
        return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case "system":
      default:
        return <Settings className="w-4 h-4 text-surface-500" />;
    }
  };

  const getBgForType = (type: ActivityType) => {
    switch (type) {
      case "application":
        return "bg-sky-50 border-sky-100";
      case "pitch":
        return "bg-purple-50 border-purple-100";
      case "review":
        return "bg-amber-50 border-amber-100";
      case "disbursement":
        return "bg-emerald-50 border-emerald-100";
      case "system":
      default:
        return "bg-surface-100 border-surface-200";
    }
  };

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <div className="p-5 border-b border-surface-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-600" />
              <h3 className="text-lg font-bold text-surface-900 font-heading">
                Audit Stream &amp; Recent Activity
              </h3>
            </div>
            <p className="text-xs text-surface-500">
              Live updates across grant submissions, reviewer scores, and funding disbursements.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-surface-100 p-1 rounded-xl border border-surface-200/80">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveActivityFilter(opt.id)}
                className={cn(
                  "px-2.5 py-1 text-xs font-semibold rounded-lg transition-smooth",
                  activeActivityFilter === opt.id
                    ? "bg-white text-surface-900 shadow-sm"
                    : "text-surface-600 hover:text-surface-900"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Items */}
        <CardContent className="p-5">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-8 text-xs text-surface-500">
              No activity logs found for this filter.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-200">
              {filteredActivities.map((act) => (
                <div key={act.id} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-6 top-1 h-5 w-5 rounded-full bg-white border-2 border-surface-300 flex items-center justify-center group-hover:border-brand-600 transition-smooth">
                    <div className="h-1.5 w-1.5 rounded-full bg-surface-400 group-hover:bg-brand-600" />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-surface-900 font-heading">
                          {act.title}
                        </span>
                        <Badge variant={act.badgeVariant} size="sm">
                          {act.badgeText}
                        </Badge>
                      </div>

                      <p className="text-xs text-surface-600 leading-relaxed">
                        {act.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <Avatar
                          src={act.actor.avatar}
                          name={act.actor.name}
                          initials={act.actor.initials}
                          size="xs"
                        />
                        <span className="text-[11px] text-surface-500 font-medium">
                          {act.actor.name}
                        </span>
                        <span className="text-surface-300">•</span>
                        <span className="text-[11px] text-surface-400 font-mono">
                          {act.target}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] text-surface-400 shrink-0 font-medium">
                      {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </div>

      <div className="p-4 bg-surface-50/80 border-t border-surface-100 rounded-b-xl flex items-center justify-between text-xs">
        <span className="text-surface-500 font-medium">
          Showing {filteredActivities.length} real-time platform logs
        </span>
        <button
          onClick={() =>
            addToast({
              type: "info",
              title: "Activity Log",
              message: "Audit stream synchronization active with SkillForge Cloud Firestore.",
            })
          }
          className="font-semibold text-brand-600 hover:text-brand-700 transition-smooth"
        >
          View Full Audit Trail
        </button>
      </div>
    </Card>
  );
}
