"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApplicationsProvider, useApplications } from "@/context/funding/ApplicationsContext";
import { ApplicationPipeline } from "@/components/funding/applications/ApplicationPipeline";
import { ApplicationList } from "@/components/funding/applications/ApplicationList";
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/funding/layout/AppLayout";

function ApplicationsPageContent({ grantId }: { grantId: string }) {
  const router = useRouter();
  const { loadApplications, loading } = useApplications();

  useEffect(() => {
    loadApplications(grantId);
  }, [grantId, loadApplications]);

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <header className="bg-white border border-surface-200 rounded-xl shadow-sm px-6 py-4 flex items-center justify-between shrink-0 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push(`/funding/grants`)} // or back to grant detail
              className="p-2 -ml-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-smooth shrink-0"
              title="Back to Grants"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-black text-surface-900">Applications</h1>
              <p className="text-xs text-surface-500 mt-0.5">Review and manage applications submitted to this grant.</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-4">
            <ApplicationPipeline />
            <ApplicationList />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default function ApplicationsPage({ params }: { params: { grantId: string } }) {
  return (
    <ApplicationsProvider>
      <ApplicationsPageContent grantId={params.grantId} />
    </ApplicationsProvider>
  );
}
