"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Organization, Grant, PipelineStage, DirectPitch, ActivityItem, NotificationItem } from "@/types/funding";
import {
  api,
  initialOrganization,
  initialGrants,
  initialPipelineStages,
  initialDirectPitches,
  initialActivities,
  initialNotifications,
} from "@/lib/funding/firebase/api";

import { useAlert } from "./AlertContext";

interface ToastMessage {
  id: string;
  type: "success" | "info" | "warning" | "error";
  title: string;
  message: string;
}

interface FundingOrgContextType {
  org: Organization | null;
  grants: Grant[];
  pipelineStages: PipelineStage[];
  directPitches: DirectPitch[];
  activities: ActivityItem[];
  notifications: NotificationItem[];
  isLoading: boolean;
  activeGrantTab: string;
  setActiveGrantTab: (tab: string) => void;
  activeActivityFilter: string;
  setActiveActivityFilter: (filter: string) => void;
  selectedGrant: Grant | null;
  setSelectedGrant: (grant: Grant | null) => void;
  selectedPitch: DirectPitch | null;
  setSelectedPitch: (pitch: DirectPitch | null) => void;
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  isCreateGrantOpen: boolean;
  setIsCreateGrantOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
  toggleDirectPitch: (enabled: boolean) => Promise<void>;
  createQuickGrant: (data: Partial<Grant>) => Promise<void>;
  markNotificationsAsRead: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

const FundingOrgContext = createContext<FundingOrgContextType | undefined>(undefined);

export function FundingOrgProvider({ children }: { children: ReactNode }) {
  const [org, setOrg] = useState<Organization | null>(initialOrganization);
  const [grants, setGrants] = useState<Grant[]>(initialGrants);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(initialPipelineStages);
  const [directPitches, setDirectPitches] = useState<DirectPitch[]>(initialDirectPitches);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isLoading, setIsLoading] = useState(false);

  // Filter and tab states
  const [activeGrantTab, setActiveGrantTab] = useState("All");
  const [activeActivityFilter, setActiveActivityFilter] = useState("all");

  // Selection modals
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [selectedPitch, setSelectedPitch] = useState<DirectPitch | null>(null);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCreateGrantOpen, setIsCreateGrantOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Layout states
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { showSuccess, showError, showInfo, showWarning, dismissAlert } = useAlert();

  const addToast = useCallback(
    (toast: Omit<ToastMessage, "id">) => {
      if (toast.type === "success") showSuccess(toast.title, toast.message);
      else if (toast.type === "error") showError(toast.title, toast.message);
      else if (toast.type === "warning") showWarning(toast.title, toast.message);
      else showInfo(toast.title, toast.message);
    },
    [showSuccess, showError, showInfo, showWarning]
  );

  const removeToast = useCallback((id: string) => {
    dismissAlert(id);
  }, [dismissAlert]);


  const refreshAll = useCallback(async () => {
    try {
      const [orgData, grantsData, pipelineData, pitchesData, activitiesData, notifsData] =
        await Promise.all([
          api.getOrganization(),
          api.getGrants(activeGrantTab === "All" ? undefined : activeGrantTab),
          api.getPipelineStages(),
          api.getDirectPitches(),
          api.getActivities(activeActivityFilter === "all" ? undefined : activeActivityFilter),
          api.getNotifications(),
        ]);

      setOrg(orgData);
      setGrants(grantsData);
      setPipelineStages(pipelineData);
      setDirectPitches(pitchesData);
      setActivities(activitiesData);
      setNotifications(notifsData);
    } catch (error) {
      console.error("Failed to fetch funding organization data", error);
      showError(
        "Connection issue",
        "We couldn't connect to the service. Please check your connection and try again."
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeGrantTab, activeActivityFilter, addToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const toggleDirectPitch = async (enabled: boolean) => {
    try {
      await api.toggleDirectPitch(enabled);
      setOrg((prev) => (prev ? { ...prev, directPitchEnabled: enabled } : prev));
      if (enabled) {
        showSuccess("Direct Pitch Intake Enabled", "Direct Pitch Intake is now accepting submissions.");
      } else {
        showSuccess("Direct Pitch Intake Disabled", "Direct Pitch Intake has been paused. New submissions are no longer being accepted.");
      }
      // Refresh activities stream
      const freshActivities = await api.getActivities();
      setActivities(freshActivities);
    } catch (err) {
      showError("Action Failed", "Could not update Direct Pitch portal status.");
    }
  };

  const createQuickGrant = async (data: Partial<Grant>) => {
    try {
      const newGrant = await api.createGrant(data);
      setGrants((prev) => [newGrant, ...prev]);
      if (org) {
        setOrg({ ...org, activeGrantCount: org.activeGrantCount + 1 });
      }
      showSuccess("Grant created", "Grant round created successfully.");
      const freshActivities = await api.getActivities();
      setActivities(freshActivities);
      setIsCreateGrantOpen(false);
    } catch (err) {
      showError("Unable to create grant", "We couldn't create this grant round. Please try again.");
    }
  };

  const markNotificationsAsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    if (org) {
      setOrg({ ...org, unreadNotificationsCount: 0 });
    }
  };

  return (
    <FundingOrgContext.Provider
      value={{
        org,
        grants,
        pipelineStages,
        directPitches,
        activities,
        notifications,
        isLoading,
        activeGrantTab,
        setActiveGrantTab,
        activeActivityFilter,
        setActiveActivityFilter,
        selectedGrant,
        setSelectedGrant,
        selectedPitch,
        setSelectedPitch,
        isQuickActionOpen,
        setIsQuickActionOpen,
        isCreateGrantOpen,
        setIsCreateGrantOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        sidebarCollapsed,
        setSidebarCollapsed,
        mobileMenuOpen,
        setMobileMenuOpen,
        searchQuery,
        setSearchQuery,
        toasts: [],
        addToast,
        removeToast,
        toggleDirectPitch,
        createQuickGrant,
        markNotificationsAsRead,
        refreshAll,
      }}
    >
      {children}
    </FundingOrgContext.Provider>
  );
}

export function useFundingOrg() {
  const context = useContext(FundingOrgContext);
  if (!context) {
    throw new Error("useFundingOrg must be used within a FundingOrgProvider");
  }
  return context;
}
