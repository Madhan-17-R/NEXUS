import React from "react";
import { cn } from "@/lib/funding/utils";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
  progress?: {
    current: number;
    total: number;
    label?: string;
  };
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  iconBgColor = "bg-brand-50",
  iconTextColor = "text-brand-600",
  progress,
  badge,
  className,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-xl border border-surface-200 p-5 shadow-card transition-smooth",
        onClick && "cursor-pointer hover:shadow-card-hover hover:border-surface-300",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">
              {title}
            </span>
            {badge}
          </div>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-surface-900 font-heading">
            {value}
          </div>
        </div>
        <div
          className={cn(
            "p-3 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
            iconBgColor,
            iconTextColor
          )}
        >
          {icon}
        </div>
      </div>

      {progress && (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-surface-500 font-medium">
            <span>{progress.label || "Capital Deployed"}</span>
            <span className="font-semibold text-surface-700">
              {Math.round((progress.current / progress.total) * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-surface-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, Math.round((progress.current / progress.total) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {(trend || subtitle) && (
        <div className="mt-4 pt-3 border-t border-surface-100 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5 font-medium">
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold",
                  trend.isNeutral
                    ? "bg-surface-100 text-surface-600"
                    : trend.isPositive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                )}
              >
                {trend.isNeutral ? (
                  <Minus className="w-3 h-3" />
                ) : trend.isPositive ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {trend.value}
              </span>
              <span className="text-surface-500">{trend.label || "vs last month"}</span>
            </div>
          ) : (
            <span className="text-surface-500 font-medium">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
