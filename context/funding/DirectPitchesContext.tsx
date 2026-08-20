"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { DirectPitch, DirectPitchSettings, DirectPitchStatus, PitchPriority } from "@/types/funding/directPitches";
import { directPitchesApi, MOCK_REVIEWERS } from "@/lib/funding/firebase/directPitchesApi";
import { formsApi } from "@/lib/funding/firebase/formsApi";
import { FormDefinition } from "@/types/funding/forms";
import { useAlert } from "./AlertContext";

interface DirectPitchesContextValue {
  settings: DirectPitchSettings | null;
  formStatus: FormDefinition | null;
  pitches: DirectPitch[];
  loading: boolean;
  selectedPitch: DirectPitch | null;
  
  // Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: DirectPitchStatus | "All";
  setStatusFilter: (s: DirectPitchStatus | "All") => void;
  
  // Operations
  loadSettingsAndPitches: (organizationId: string) => Promise<void>;
  toggleIntake: (organizationId: string, enabled: boolean) => Promise<boolean>;
  loadPitchById: (pitchId: string) => Promise<void>;
  updatePitchStatus: (pitchId: string, status: DirectPitchStatus) => Promise<void>;
  assignReviewer: (pitchId: string, reviewerId?: string) => Promise<void>;
  updatePriority: (pitchId: string, priority: PitchPriority) => Promise<void>;
  requestInfo: (pitchId: string, requestText: string) => Promise<void>;
  
  // Meta
  reviewers: typeof MOCK_REVIEWERS;
}

const DirectPitchesContext = createContext<DirectPitchesContextValue | null>(null);

export function DirectPitchesProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DirectPitchSettings | null>(null);
  const [formStatus, setFormStatus] = useState<FormDefinition | null>(null);
  const [pitches, setPitches] = useState<DirectPitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPitch, setSelectedPitch] = useState<DirectPitch | null>(null);
  const { showSuccess, showError } = useAlert();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<DirectPitchStatus | "All">("All");

  const loadSettingsAndPitches = useCallback(async (organizationId: string) => {
    setLoading(true);
    try {
      const [fetchedSettings, fetchedPitches] = await Promise.all([
        directPitchesApi.getSettings(organizationId),
        directPitchesApi.getPitches(organizationId)
      ]);
      setSettings(fetchedSettings);
      setPitches(fetchedPitches);
      
      // Load form status if exists
      if (fetchedSettings.formId) {
        const form = await formsApi.getById(fetchedSettings.formId);
        setFormStatus(form);
      } else {
        // Mock fallback to check if a draft exists for the org
        const form = await formsApi.getByOwner("directPitch", organizationId);
        setFormStatus(form);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleIntake = useCallback(async (organizationId: string, enabled: boolean) => {
    if (enabled && formStatus?.status !== "published") {
      showError("Complete Pitch Form First", "Create and publish a Direct Pitch form before accepting submissions.");
      return false;
    }
    const updated = await directPitchesApi.updateSettings(organizationId, { isAcceptingPitches: enabled });
    setSettings(updated);
    if (enabled) {
      showSuccess("Direct Pitch Intake Enabled", "Direct Pitch Intake is now accepting submissions.");
    } else {
      showSuccess("Direct Pitch Intake Disabled", "Direct Pitch Intake has been paused. New submissions are no longer being accepted.");
    }
    return true;
  }, [formStatus, showSuccess, showError]);

  const loadPitchById = useCallback(async (pitchId: string) => {
    setLoading(true);
    try {
      const pitch = await directPitchesApi.getPitchById(pitchId);
      setSelectedPitch(pitch);
      if (pitch) {
        setPitches(prev => {
          const idx = prev.findIndex(p => p.id === pitch.id);
          if (idx > -1) {
            const next = [...prev];
            next[idx] = pitch;
            return next;
          }
          return [...prev, pitch];
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const _updateLocal = useCallback((updatedPitch: DirectPitch) => {
    setPitches(prev => prev.map(p => p.id === updatedPitch.id ? updatedPitch : p));
    setSelectedPitch(prev => prev?.id === updatedPitch.id ? updatedPitch : prev);
  }, []);

  const updatePitchStatus = useCallback(async (pitchId: string, status: DirectPitchStatus) => {
    const updated = await directPitchesApi.updatePitchStatus(pitchId, status);
    _updateLocal(updated);
    showSuccess("Status Updated", `Pitch moved to ${status}`);
  }, [_updateLocal, showSuccess]);

  const assignReviewer = useCallback(async (pitchId: string, reviewerId?: string) => {
    const updated = await directPitchesApi.assignReviewer(pitchId, reviewerId);
    _updateLocal(updated);
    showSuccess("Reviewer Assigned", "The assigned reviewer has been updated.");
  }, [_updateLocal, showSuccess]);

  const updatePriority = useCallback(async (pitchId: string, priority: PitchPriority) => {
    const updated = await directPitchesApi.updatePriority(pitchId, priority);
    _updateLocal(updated);
  }, [_updateLocal]);

  const requestInfo = useCallback(async (pitchId: string, requestText: string) => {
    const updated = await directPitchesApi.requestInformation(pitchId, requestText);
    _updateLocal(updated);
    showSuccess("Information Requested", "A request has been sent to the innovator.");
  }, [_updateLocal, showSuccess]);

  return (
    <DirectPitchesContext.Provider value={{
      settings, formStatus, pitches, loading, selectedPitch,
      searchQuery, setSearchQuery, statusFilter, setStatusFilter,
      loadSettingsAndPitches, toggleIntake, loadPitchById,
      updatePitchStatus, assignReviewer, updatePriority, requestInfo,
      reviewers: MOCK_REVIEWERS
    }}>
      {children}
    </DirectPitchesContext.Provider>
  );
}

export function useDirectPitches() {
  const ctx = useContext(DirectPitchesContext);
  if (!ctx) throw new Error("useDirectPitches must be inside DirectPitchesProvider");
  return ctx;
}
