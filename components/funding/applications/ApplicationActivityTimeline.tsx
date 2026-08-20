"use client";

import React from "react";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { Activity } from "lucide-react";

export function ApplicationActivityTimeline() {
  const { selectedApp } = useApplications();

  if (!selectedApp || selectedApp.activity.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm">
      <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-6">Activity Timeline</h3>
      
      <div className="space-y-6">
        {selectedApp.activity.map((event, index) => (
          <div key={event.id} className="relative flex gap-4">
            {/* Timeline line */}
            {index !== selectedApp.activity.length - 1 && (
              <div className="absolute left-[13px] top-8 bottom-[-24px] w-0.5 bg-surface-100" />
            )}
            
            {/* Icon */}
            <div className="w-7 h-7 rounded-full bg-brand-50 flex items-center justify-center shrink-0 z-10 border-2 border-white ring-1 ring-surface-100">
              <Activity className="w-3.5 h-3.5 text-brand-600" />
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-sm font-bold text-surface-900">{event.action}</span>
                <span className="text-[10px] font-semibold text-surface-400 whitespace-nowrap">
                  {new Date(event.timestamp).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-surface-600 mt-0.5">{event.description}</p>
              <p className="text-[10px] text-surface-400 font-medium mt-1 uppercase tracking-wider">By {event.actor}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
