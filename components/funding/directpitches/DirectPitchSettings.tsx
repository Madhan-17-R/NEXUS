"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useDirectPitches } from "@/context/funding/DirectPitchesContext";
import { Button } from "@/components/funding/ui/Button";
import { Settings, FileEdit, Eye, AlertCircle, Play, Square } from "lucide-react";
import { cn } from "@/lib/funding/utils";

export function DirectPitchSettings() {
  const router = useRouter();
  const { settings, formStatus, toggleIntake } = useDirectPitches();

  const [showError, setShowError] = React.useState(false);

  if (!settings) return null;

  const handleToggle = async () => {
    const success = await toggleIntake("org_1", !settings.isAcceptingPitches);
    if (!success && !settings.isAcceptingPitches) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  const handleCustomize = () => {
    router.push("/funding/direct-pitches/form");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Intake Control Card */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-surface-900">Direct Pitch Intake</h2>
            <p className="text-sm text-surface-500 mt-1">
              Allow Innovators to submit ideas directly to your organization.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-sm font-bold", settings.isAcceptingPitches ? "text-brand-600" : "text-surface-400")}>
              {settings.isAcceptingPitches ? "ON" : "OFF"}
            </span>
            <button
              onClick={handleToggle}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                settings.isAcceptingPitches ? "bg-brand-600" : "bg-surface-200"
              )}
            >
              <span className={cn(
                "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                settings.isAcceptingPitches ? "translate-x-6" : "translate-x-1"
              )} />
            </button>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-surface-100 flex-1 flex flex-col justify-center">
          {showError && !settings.isAcceptingPitches ? (
            <div className="flex items-start gap-3 text-rose-700 bg-rose-50 rounded-xl p-4 border border-rose-100">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">Action Required</div>
                <div className="text-xs mt-0.5 opacity-90">Publish your Direct Pitch Application Form before accepting pitches.</div>
                <Button onClick={handleCustomize} variant="outline" size="sm" className="mt-3 bg-white hover:bg-rose-50 border-rose-200">
                  Customize Pitch Form
                </Button>
              </div>
            </div>
          ) : settings.isAcceptingPitches ? (
            <div className="flex items-center gap-3 text-emerald-700 bg-emerald-50 rounded-xl p-4 cursor-pointer hover:bg-emerald-100 transition-colors" onClick={handleToggle}>
              <Play className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">Pitch Intake Active</div>
                <div className="text-xs mt-0.5 opacity-90">Innovators can currently submit direct pitches.</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-surface-600 bg-surface-50 rounded-xl p-4 cursor-pointer hover:bg-surface-100 transition-colors" onClick={handleToggle}>
              <Square className="w-5 h-5 shrink-0" />
              <div>
                <div className="font-bold text-sm">Pitch Intake Disabled</div>
                <div className="text-xs mt-0.5 opacity-90">New direct pitches are currently not being accepted.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Form Status Card */}
      <div className="bg-white rounded-2xl border border-surface-200 p-6 shadow-sm flex flex-col">
        <h2 className="text-lg font-bold text-surface-900 mb-1">Direct Pitch Application Form</h2>
        
        {!formStatus ? (
          <>
            <p className="text-sm text-surface-500 mb-4 flex-1">
              Create a custom form to collect the information you need from Innovators.
            </p>
            <div className="flex items-center gap-3 bg-amber-50 text-amber-800 p-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">Not Configured</span>
            </div>
            <Button onClick={handleCustomize} variant="primary" className="w-full">
              Customize Pitch Form
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-surface-500 mb-4 flex-1">
              Customize what Innovators must provide when pitching ideas to your organization.
            </p>
            <div className="flex items-center justify-between mb-4 bg-surface-50 p-4 rounded-xl border border-surface-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "px-2 py-0.5 text-xs font-bold rounded-full uppercase tracking-wider",
                    formStatus.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-surface-200 text-surface-700"
                  )}>
                    {formStatus.status}
                  </span>
                  {formStatus.status === "published" && <span className="text-xs text-surface-500">v{formStatus.publishedVersion}</span>}
                </div>
                <div className="text-xs text-surface-500">
                  {formStatus.totalFields} Fields · {formStatus.requiredFields} Required · {formStatus.sections.length} Sections
                </div>
              </div>
              <div className="text-right text-[10px] text-surface-400 font-medium">
                Last updated<br />{new Date(formStatus.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button onClick={handleCustomize} variant={formStatus.status === "draft" ? "primary" : "secondary"} className="flex-1" leftIcon={<FileEdit className="w-4 h-4" />}>
                {formStatus.status === "draft" ? "Continue Editing" : "Customize Form"}
              </Button>
              {formStatus.status === "published" && (
                <Button variant="outline" className="flex-1" leftIcon={<Eye className="w-4 h-4" />}>
                  Preview
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
