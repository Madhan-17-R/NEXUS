"use client";

import React, { useEffect } from "react";
import { DirectPitchesProvider, useDirectPitches } from "@/context/funding/DirectPitchesContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DirectPitchSettings } from "@/components/funding/directpitches/DirectPitchSettings";
import { PitchPipeline } from "@/components/funding/directpitches/PitchPipeline";
import { PitchList } from "@/components/funding/directpitches/PitchList";
import { AppLayout } from "@/components/funding/layout/AppLayout";

function DirectPitchesContent() {
  const { loadSettingsAndPitches, loading } = useDirectPitches();

  useEffect(() => {
    // We assume organization ID "org_1" for this prototype
    loadSettingsAndPitches("org_1");
  }, [loadSettingsAndPitches]);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="bg-white border border-surface-200 rounded-xl shadow-sm px-6 py-4 shrink-0 mb-6">
          <div className="flex items-start gap-3">
          <Link 
            href="/funding/"
            className="mt-0.5 text-surface-500 hover:text-surface-900 transition-colors shrink-0"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-xl font-black text-surface-900">Direct Pitches</h1>
            <p className="text-xs text-surface-500 mt-0.5">
              Manage direct idea submissions and control how Innovators can pitch opportunities to your organization.
            </p>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <DirectPitchSettings />
            <PitchPipeline />
            <PitchList />
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}

export default function DirectPitchesPage() {
  return (
    <DirectPitchesProvider>
      <DirectPitchesContent />
    </DirectPitchesProvider>
  );
}
