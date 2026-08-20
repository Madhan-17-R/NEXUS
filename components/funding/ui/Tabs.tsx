import React from "react";
import { cn } from "@/lib/funding/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "pills" | "underline" | "enclosed";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "pills",
  className,
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div
        className={cn(
          "inline-flex items-center p-1 bg-surface-100 rounded-xl gap-1 border border-surface-200/80",
          className
        )}
      >
        {tabs.map((tab) => {
          const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-smooth select-none",
                isActive
                  ? "bg-white text-surface-900 shadow-sm"
                  : "text-surface-600 hover:text-surface-900 hover:bg-surface-200/50"
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                    isActive
                      ? "bg-brand-50 text-brand-700"
                      : "bg-surface-200 text-surface-600"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={cn("border-b border-surface-200 flex gap-6", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab.toLowerCase() === tab.id.toLowerCase();
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-smooth -mb-px select-none",
              isActive
                ? "border-brand-600 text-brand-600 font-bold"
                : "border-transparent text-surface-500 hover:text-surface-800 hover:border-surface-300"
            )}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            <span>{tab.label}</span>
            {typeof tab.count === "number" && (
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "bg-surface-100 text-surface-600"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
