"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { GrantApplication, ApplicationStatus, ApplicationPriority } from "@/types/funding/applications";
import { applicationsApi, MOCK_REVIEWERS } from "@/lib/funding/firebase/applicationsApi";
import { useAlert } from "./AlertContext";

interface ApplicationsContextValue {
  applications: GrantApplication[];
  loading: boolean;
  selectedApp: GrantApplication | null;
  
  // Filters and state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: ApplicationStatus | "All";
  setStatusFilter: (s: ApplicationStatus | "All") => void;
  
  // Operations
  loadApplications: (grantId: string) => Promise<void>;
  loadApplicationById: (appId: string) => Promise<void>;
  updateStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  assignReviewer: (appId: string, reviewerId?: string) => Promise<void>;
  updatePriority: (appId: string, priority: ApplicationPriority) => Promise<void>;
  addInternalNote: (appId: string, content: string) => Promise<void>;
  requestInfo: (appId: string, requestText: string) => Promise<void>;
  
  // Meta
  reviewers: typeof MOCK_REVIEWERS;
}

const ApplicationsContext = createContext<ApplicationsContextValue | null>(null);

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
  const [applications, setApplications] = useState<GrantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<GrantApplication | null>(null);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("All");

  const { showSuccess, showError } = useAlert();

  const loadApplications = useCallback(async (grantId: string) => {
    setLoading(true);
    try {
      const data = await applicationsApi.getApplications(grantId);
      setApplications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadApplicationById = useCallback(async (appId: string) => {
    setLoading(true);
    try {
      const app = await applicationsApi.getApplicationById(appId);
      setSelectedApp(app);
      // Also update in list if present
      if (app) {
        setApplications(prev => {
          const idx = prev.findIndex(a => a.id === app.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = app;
            return next;
          }
          return [...prev, app];
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const _updateLocal = useCallback((updatedApp: GrantApplication) => {
    setApplications(prev => prev.map(a => a.id === updatedApp.id ? updatedApp : a));
    setSelectedApp(prev => prev?.id === updatedApp.id ? updatedApp : prev);
  }, []);

  const updateStatus = useCallback(async (appId: string, status: ApplicationStatus) => {
    const updated = await applicationsApi.updateApplicationStatus(appId, status);
    _updateLocal(updated);
    if (status === "Rejected") {
      showSuccess("Application rejected", "Application rejected successfully.");
    } else {
      showSuccess("Status updated", `Application moved to ${status}.`);
    }
  }, [_updateLocal, showSuccess]);

  const assignReviewer = useCallback(async (appId: string, reviewerId?: string) => {
    try {
      const updated = await applicationsApi.assignReviewer(appId, reviewerId);
      _updateLocal(updated);
      showSuccess("Reviewers assigned", "Reviewers assigned successfully.");
    } catch (err) {
      showError("Assignment failed", "Could not assign reviewers. Please try again.");
    }
  }, [_updateLocal, showSuccess, showError]);

  const updatePriority = useCallback(async (appId: string, priority: ApplicationPriority) => {
    const updated = await applicationsApi.updatePriority(appId, priority);
    _updateLocal(updated);
  }, [_updateLocal]);

  const addInternalNote = useCallback(async (appId: string, content: string) => {
    // Hardcoding reviewerId to "rev_1" for demo purposes of the current user
    const updated = await applicationsApi.addInternalNote(appId, content, "rev_1");
    _updateLocal(updated);
  }, [_updateLocal]);

  const requestInfo = useCallback(async (appId: string, requestText: string) => {
    const updated = await applicationsApi.requestInformation(appId, requestText);
    _updateLocal(updated);
  }, [_updateLocal]);

  return (
    <ApplicationsContext.Provider value={{
      applications,
      loading,
      selectedApp,
      searchQuery, setSearchQuery,
      statusFilter, setStatusFilter,
      loadApplications, loadApplicationById,
      updateStatus, assignReviewer, updatePriority, addInternalNote, requestInfo,
      reviewers: MOCK_REVIEWERS
    }}>
      {children}
    </ApplicationsContext.Provider>
  );
}

export function useApplications() {
  const ctx = useContext(ApplicationsContext);
  if (!ctx) throw new Error("useApplications must be inside ApplicationsProvider");
  return ctx;
}
