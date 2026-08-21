"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { formsApi } from "@/lib/funding/firebase/formsApi";
import { FormDefinition } from "@/types/funding/forms";
import { DynamicFormRenderer } from "./DynamicFormRenderer";
import { ReviewPanel } from "./ReviewPanel";
import { ApplicationActivityTimeline } from "./ApplicationActivityTimeline";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { ArrowLeft, ExternalLink, AlertCircle } from "lucide-react";
import { ApplicationStatus } from "@/types/funding/applications";

export function ApplicationDetailLayout({ appId }: { appId: string }) {
  const router = useRouter();
  const { selectedApp, loadApplicationById, loading } = useApplications();
  const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);

  useEffect(() => {
    loadApplicationById(appId);
  }, [appId, loadApplicationById]);

  useEffect(() => {
    if (selectedApp) {
      // In a real app we'd load the specific form ID.
      // Here we load the mock Student Innovation form to match our seed data
      formsApi.getById("tpl_student_innovation")
        .then(form => {
          if (!form) {
            // fallback if it wasn't instantiated yet (mock data quirk)
            return formsApi.createFromTemplate("tpl_student_innovation", "grant", selectedApp.grantId, "Student Innovation Grant");
          }
          return form;
        })
        .then(setFormDefinition);
    }
  }, [selectedApp]);

  if (!loading && !selectedApp) {
    return (
      <div className="flex flex-col h-full bg-surface-50 min-h-screen items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-surface-200 flex flex-col items-center max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-surface-300 mb-4" />
          <h2 className="text-xl font-bold text-surface-900 mb-2">Application Not Found</h2>
          <p className="text-sm text-surface-500 mb-6">The application you are trying to view does not exist or has been removed.</p>
          <Button variant="primary" onClick={() => router.push('/funding/reviews')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Reviews
          </Button>
        </div>
      </div>
    );
  }

  if (loading || !selectedApp) {
    return (
      <div className="flex flex-col h-full bg-surface-50 min-h-screen overflow-hidden">
        {/* Skeleton Header */}
        <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center gap-4 shrink-0 z-10">
          <div className="w-8 h-8 bg-surface-200 rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="w-48 h-6 bg-surface-200 rounded animate-pulse" />
            <div className="w-64 h-3 bg-surface-200 rounded animate-pulse" />
          </div>
        </header>

        {/* Skeleton Workspace */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
            {/* Left Column Skeleton */}
            <div className="flex-1 min-w-0 space-y-8">
              <div className="w-full h-10 bg-surface-200 rounded-lg animate-pulse w-64 mb-6" />
              <div className="w-full h-96 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
            </div>
            
            {/* Right Column Skeleton */}
            <div className="w-full xl:w-[480px] shrink-0 flex flex-col gap-6">
              <div className="w-full h-10 bg-surface-200 rounded-lg animate-pulse" />
              <div className="w-full h-64 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
              <div className="w-full h-48 bg-white rounded-2xl border border-surface-200 animate-pulse shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch(status) {
      case "Submitted": return "neutral";
      case "Shortlisted": return "info";
      case "Awarded": return "success";
      case "Rejected": return "danger";
      case "More Information Required": return "warning";
      default: return "neutral";
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface-50 min-h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b border-surface-200 px-6 py-4 flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/funding/grants/${selectedApp.grantId}/applications`)}
            className="p-2 -ml-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-smooth shrink-0"
            title="Back to Applications"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-black text-surface-900">{selectedApp.id}</h1>
              <Badge variant={getStatusColor(selectedApp.status)}>{selectedApp.status}</Badge>
              {selectedApp.priority === "High" && <Badge variant="danger">High Priority</Badge>}
            </div>
            <div className="text-xs text-surface-500 mt-0.5 flex items-center gap-2">
              <span className="font-semibold">{selectedApp.projectTitle}</span>
              <span className="w-1 h-1 rounded-full bg-surface-300" />
              <span>{selectedApp.applicantSnapshot.fullName}</span>
              <span className="w-1 h-1 rounded-full bg-surface-300" />
              <span>Submitted {new Date(selectedApp.submittedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col xl:flex-row gap-8">
          
          {/* Left Column: Form Responses & Activity */}
          <div className="flex-1 min-w-0 space-y-8">
            <div>
              <h2 className="text-xl font-black text-surface-900 mb-6 flex items-center gap-2">
                Application Responses
              </h2>
              
              {!formDefinition ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-8 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
              ) : (
                <DynamicFormRenderer
                  form={formDefinition}
                  responses={selectedApp.responses}
                  mode="review"
                />
              )}
            </div>

            <ApplicationActivityTimeline />
          </div>

          {/* Right Column: Review Panel */}
          <ReviewPanel />
          
        </div>
      </div>
    </div>
  );
}
