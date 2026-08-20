"use client";

import React from "react";
import { useAlert } from "@/context/funding/AlertContext";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/funding/utils";

export function AppAlert() {
  const { alerts, dismissAlert } = useAlert();

  if (alerts.length === 0) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-brand-500 shrink-0" />,
    loading: <Loader2 className="w-5 h-5 text-brand-500 shrink-0 animate-spin" />,
  };

  const borders = {
    success: "border-emerald-200 bg-white",
    error: "border-rose-200 bg-rose-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-brand-200 bg-white",
    loading: "border-brand-200 bg-white",
  };

  return (
    <div className="fixed top-5 right-5 sm:top-6 sm:right-6 md:top-8 md:right-8 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          role={alert.type === "error" ? "alert" : "status"}
          className={cn(
            "pointer-events-auto p-4 rounded-xl border shadow-modal flex items-start gap-3 transition-all animate-in slide-in-from-top-3 duration-200",
            borders[alert.type]
          )}
        >
          {icons[alert.type]}
          <div className="flex-1 min-w-0 pt-0.5">
            <h4 className="text-sm font-bold text-surface-900">{alert.title}</h4>
            <p className="text-sm text-surface-600 mt-1 leading-relaxed">{alert.message}</p>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="text-surface-400 hover:text-surface-600 p-1 rounded-md hover:bg-surface-100 transition-smooth"
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
