"use client";

import React, { useState } from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Card, CardHeader, CardContent } from "@/components/funding/ui/Card";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { Layers, ArrowRight, Clock, HelpCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/funding/utils";

export function ApplicationPipeline() {
  const { pipelineStages, org, addToast } = useFundingOrg();
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const handleStageClick = (stageName: string, count: number) => {
    addToast({
      type: "info",
      title: `${stageName} Selected`,
      message: `${count} applications currently in this stage. Complete review queue workflow will open in Phase 4.`,
    });
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-surface-900 font-heading">
              Application Pipeline &amp; Evaluation Funnel
            </h3>
          </div>
          <p className="text-xs text-surface-500">
            Real-time stage distribution of {org?.totalApplications || 184} submitted innovator applications.
          </p>
        </div>

        <Badge variant="warning" size="sm" dot>
          {org?.pendingReviewCount || 42} Awaiting Assessment
        </Badge>
      </CardHeader>

      <CardContent>
        {/* Pipeline Visual Funnel Bar */}
        <div className="mb-6">
          <div className="h-3 w-full bg-surface-100 rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-surface-200">
            {pipelineStages.map((stage) => (
              <div
                key={stage.id}
                style={{
                  width: `${stage.percentage}%`,
                  backgroundColor: stage.color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-90 cursor-pointer"
                title={`${stage.name}: ${stage.count} (${stage.percentage}%)`}
              />
            ))}
          </div>
        </div>

        {/* Stage Columns / Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.id}
              onClick={() => handleStageClick(stage.name, stage.count)}
              className={cn(
                "p-4 rounded-xl border border-surface-200 bg-surface-50/50 hover:bg-white hover:border-surface-300 hover:shadow-card-hover transition-smooth cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              )}
            >
              {/* Stage Top Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: stage.color }}
              />

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-surface-400 mb-1">
                  <span>STAGE {idx + 1}</span>
                  <span className="font-semibold" style={{ color: stage.color }}>
                    {stage.percentage}%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-surface-900 group-hover:text-brand-600 transition-smooth font-heading line-clamp-1">
                  {stage.name}
                </h4>
                <p className="text-[11px] text-surface-500 mt-1 leading-snug">
                  {stage.hint}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-200/60 flex items-center justify-between">
                <div>
                  <span className="text-xl font-bold text-surface-900 font-heading">
                    {stage.count}
                  </span>
                  <span className="text-[10px] text-surface-500 block">apps</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-surface-500 font-medium">
                  <Clock className="w-3 h-3 text-surface-400" />
                  <span>~{stage.avgDaysInStage}d</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
