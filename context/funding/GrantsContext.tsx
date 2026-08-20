"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import { FullGrant, EligibilityCriteria, ApplicationFormConfig } from "@/types/funding";
import { grantsApi } from "@/lib/funding/firebase/grantsApi";
import { useAlert } from "./AlertContext";

export type GrantFilterTab = "all" | "active" | "draft" | "in_review" | "closing_soon" | "closed";
export type GrantSortOption = "newest" | "oldest" | "deadline_soonest" | "most_applications" | "highest_pool";

// ─── Wizard State ──────────────────────────────────────────────────────────────

export interface WizardStep1 {
  title: string;
  shortDescription: string;
  description: string;
  domain: string;
  focusAreas: string[];
  programType: string;
  fundingType: string;
}

export interface WizardStep3 {
  currency: string;
  totalPool: string;
  minAward: string;
  maxAward: string;
  numberOfAwards: string;
  openingDate: string;
  deadline: string;
  reviewPeriodEnd: string;
  decisionDate: string;
  fundingStartDate: string;
}

export interface WizardState {
  currentStep: number;
  grantId: string | null; // draft ID
  step1: WizardStep1;
  step2: EligibilityCriteria;
  step3: WizardStep3;
  step4: ApplicationFormConfig;
  lastSaved: string | null;
  isDirty: boolean;
}

const defaultWizardState: WizardState = {
  currentStep: 1,
  grantId: null,
  step1: {
    title: "",
    shortDescription: "",
    description: "",
    domain: "",
    focusAreas: [],
    programType: "",
    fundingType: "Grant",
  },
  step2: {
    applicantTypes: [],
    educationLevels: [],
    experienceLevel: "Any experience",
    domains: [],
    skills: [],
    geography: "Global",
    selectedCountries: [],
    additionalRequirements: "",
  },
  step3: {
    currency: "USD",
    totalPool: "",
    minAward: "",
    maxAward: "",
    numberOfAwards: "",
    openingDate: "",
    deadline: "",
    reviewPeriodEnd: "",
    decisionDate: "",
    fundingStartDate: "",
  },
  step4: {
    status: "not_configured",
    totalFields: 0,
    totalSections: 0,
    requiredFields: 0,
    optionalFields: 0,
    sections: [],
  },
  lastSaved: null,
  isDirty: false,
};

// ─── Context Types ─────────────────────────────────────────────────────────────

interface GrantsContextValue {
  // List State
  grants: FullGrant[];
  loading: boolean;
  filterTab: GrantFilterTab;
  searchQuery: string;
  sortOption: GrantSortOption;
  activeFilters: Record<string, string>;

  // Current detail view
  selectedGrant: FullGrant | null;

  // Wizard
  wizard: WizardState;
  wizardOpen: boolean;
  publishSuccess: FullGrant | null;

  // Modals
  closeConfirmGrant: FullGrant | null;
  duplicateConfirmGrant: FullGrant | null;

  // Actions
  loadGrants: () => Promise<void>;
  setFilterTab: (tab: GrantFilterTab) => void;
  setSearchQuery: (q: string) => void;
  setSortOption: (s: GrantSortOption) => void;
  setActiveFilters: (f: Record<string, string>) => void;
  selectGrant: (grant: FullGrant | null) => void;
  openCreateWizard: () => void;
  editGrant: (grant: FullGrant) => void;
  closeWizard: () => void;
  setWizardStep: (step: number) => void;
  updateWizardStep1: (data: Partial<WizardStep1>) => void;
  updateWizardStep2: (data: Partial<EligibilityCriteria>) => void;
  updateWizardStep3: (data: Partial<WizardStep3>) => void;
  updateWizardStep4: (data: Partial<ApplicationFormConfig>) => void;
  saveDraft: () => Promise<void>;
  publishGrant: () => Promise<void>;
  closeGrant: (grant: FullGrant) => void;
  confirmCloseGrant: () => Promise<void>;
  cancelCloseGrant: () => void;
  duplicateGrant: (grant: FullGrant) => void;
  confirmDuplicateGrant: () => Promise<void>;
  cancelDuplicateGrant: () => void;
  dismissPublishSuccess: () => void;
}

const GrantsContext = createContext<GrantsContextValue | null>(null);

export function GrantsProvider({ children }: { children: React.ReactNode }) {
  const [grants, setGrants] = useState<FullGrant[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterTab, setFilterTab] = useState<GrantFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<GrantSortOption>("newest");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedGrant, setSelectedGrant] = useState<FullGrant | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizard, setWizard] = useState<WizardState>({ ...defaultWizardState });
  const [publishSuccess, setPublishSuccess] = useState<FullGrant | null>(null);
  const [closeConfirmGrant, setCloseConfirmGrant] = useState<FullGrant | null>(null);
  const [duplicateConfirmGrant, setDuplicateConfirmGrant] = useState<FullGrant | null>(null);
  const draftGrantRef = useRef<FullGrant | null>(null);
  
  const { showSuccess, showError, showWarning } = useAlert();

  const loadGrants = useCallback(async () => {
    setLoading(true);
    try {
      const data = await grantsApi.getAll(
        filterTab === "all" ? undefined : filterTab,
        searchQuery || undefined,
        sortOption
      );
      setGrants(data);
    } finally {
      setLoading(false);
    }
  }, [filterTab, searchQuery, sortOption]);

  const selectGrant = useCallback((grant: FullGrant | null) => {
    setSelectedGrant(grant);
  }, []);

  const openCreateWizard = useCallback(() => {
    setWizard({ ...defaultWizardState });
    draftGrantRef.current = null;
    setWizardOpen(true);
  }, []);

  const editGrant = useCallback((grant: FullGrant) => {
    setWizard({
      currentStep: 1,
      grantId: grant.id,
      step1: {
        title: grant.title,
        shortDescription: grant.shortDescription || "",
        description: grant.description || "",
        domain: grant.domain,
        focusAreas: grant.focusAreas,
        programType: grant.programType,
        fundingType: grant.fundingType,
      },
      step2: grant.eligibility,
      step3: {
        currency: grant.currency,
        totalPool: grant.totalPool.toString(),
        minAward: grant.minAward.toString(),
        maxAward: grant.maxAward.toString(),
        numberOfAwards: grant.numberOfAwards.toString(),
        openingDate: grant.timeline.openingDate || "",
        deadline: grant.timeline.deadline || "",
        reviewPeriodEnd: grant.timeline.reviewPeriodEnd || "",
        decisionDate: grant.timeline.decisionDate || "",
        fundingStartDate: grant.timeline.fundingStartDate || "",
      },
      step4: grant.applicationForm,
      lastSaved: null,
      isDirty: false,
    });
    draftGrantRef.current = grant;
    setWizardOpen(true);
  }, []);

  const closeWizard = useCallback(() => {
    setWizardOpen(false);
  }, []);

  const setWizardStep = useCallback((step: number) => {
    setWizard(w => ({ ...w, currentStep: step }));
  }, []);

  const updateWizardStep1 = useCallback((data: Partial<WizardStep1>) => {
    setWizard(w => ({ ...w, step1: { ...w.step1, ...data }, isDirty: true }));
  }, []);

  const updateWizardStep2 = useCallback((data: Partial<EligibilityCriteria>) => {
    setWizard(w => ({ ...w, step2: { ...w.step2, ...data }, isDirty: true }));
  }, []);

  const updateWizardStep3 = useCallback((data: Partial<WizardStep3>) => {
    setWizard(w => ({ ...w, step3: { ...w.step3, ...data }, isDirty: true }));
  }, []);

  const updateWizardStep4 = useCallback((data: Partial<ApplicationFormConfig>) => {
    setWizard(w => ({ ...w, step4: { ...w.step4, ...data }, isDirty: true }));
  }, []);

  const saveDraft = useCallback(async () => {
    const { step1, step2, step3, step4 } = wizard;
    
    if (!step1.title) {
      showWarning("Action required", "Please complete the required grant details before creating the round.");
      return;
    }

    const grantPayload: Partial<FullGrant> = {
      title: step1.title,
      shortDescription: step1.shortDescription,
      description: step1.description,
      domain: step1.domain as FullGrant["domain"],
      focusAreas: step1.focusAreas,
      programType: step1.programType as FullGrant["programType"],
      fundingType: step1.fundingType as FullGrant["fundingType"],
      currency: step3.currency,
      totalPool: Number(step3.totalPool) || 0,
      minAward: Number(step3.minAward) || 0,
      maxAward: Number(step3.maxAward) || 0,
      numberOfAwards: Number(step3.numberOfAwards) || 0,
      timeline: {
        openingDate: step3.openingDate,
        deadline: step3.deadline,
        reviewPeriodEnd: step3.reviewPeriodEnd,
        decisionDate: step3.decisionDate,
        fundingStartDate: step3.fundingStartDate,
      },
      eligibility: step2,
      applicationForm: step4,
    };
    let saved: FullGrant | null = null;
    try {
      if (wizard.grantId) {
        saved = await grantsApi.update(wizard.grantId, grantPayload);
        showSuccess("Changes saved", "Grant changes saved successfully.");
      } else {
        saved = await grantsApi.create(grantPayload);
        showSuccess("Grant created", "Grant round created successfully.");
      }
      if (saved) {
        draftGrantRef.current = saved;
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        setWizard(w => ({ ...w, grantId: saved!.id, lastSaved: now, isDirty: false }));
        // Refresh list
        const data = await grantsApi.getAll();
        setGrants(data);
      }
    } catch (err) {
      if (wizard.grantId) {
        showError("Unable to save changes", "We couldn't save the grant changes. Please try again.");
      } else {
        showError("Unable to create grant", "We couldn't create this grant round. Please try again.");
      }
    }
  }, [wizard, showSuccess, showError]);

  const publishGrant = useCallback(async () => {
    let grantId = wizard.grantId;
    
    // Simple validation placeholder
    if (!wizard.step1.title || !wizard.step3.totalPool) {
       showWarning("Action required", "Please complete the required configuration before publishing this grant round.");
       return;
    }

    // If not saved yet, save first
    if (!grantId) {
      await saveDraft();
      grantId = draftGrantRef.current?.id ?? null;
    }
    if (!grantId) return;
    
    try {
      const published = await grantsApi.publish(grantId);
      if (published) {
        setGrants(prev => prev.map(g => g.id === published.id ? published : g));
        setPublishSuccess(published);
        setWizardOpen(false);
        showSuccess("Publish successful", "Grant round published successfully. It is now available to eligible applicants.");
      }
    } catch (err) {
      showError("Unable to publish", "We couldn't publish this grant round. Please try again.");
    }
  }, [wizard, saveDraft, showSuccess, showWarning, showError]);

  const closeGrant = useCallback((grant: FullGrant) => {
    setCloseConfirmGrant(grant);
  }, []);

  const confirmCloseGrant = useCallback(async () => {
    if (!closeConfirmGrant) return;
    try {
      const updated = await grantsApi.close(closeConfirmGrant.id);
      if (updated) {
        setGrants(prev => prev.map(g => g.id === updated.id ? updated : g));
        if (selectedGrant?.id === updated.id) setSelectedGrant(updated);
        showSuccess("Unpublished", "Grant round unpublished successfully.");
      }
    } catch (err) {
      showError("Action failed", "We couldn't unpublish this grant round. Please try again.");
    } finally {
      setCloseConfirmGrant(null);
    }
  }, [closeConfirmGrant, selectedGrant, showSuccess, showError]);

  const cancelCloseGrant = useCallback(() => setCloseConfirmGrant(null), []);

  const duplicateGrant = useCallback((grant: FullGrant) => {
    setDuplicateConfirmGrant(grant);
  }, []);

  const confirmDuplicateGrant = useCallback(async () => {
    if (!duplicateConfirmGrant) return;
    const copy = await grantsApi.duplicate(duplicateConfirmGrant.id);
    if (copy) {
      setGrants(prev => [copy, ...prev]);
    }
    setDuplicateConfirmGrant(null);
  }, [duplicateConfirmGrant]);

  const cancelDuplicateGrant = useCallback(() => setDuplicateConfirmGrant(null), []);

  const dismissPublishSuccess = useCallback(() => setPublishSuccess(null), []);

  return (
    <GrantsContext.Provider
      value={{
        grants, loading, filterTab, searchQuery, sortOption, activeFilters,
        selectedGrant, wizard, wizardOpen, publishSuccess,
        closeConfirmGrant, duplicateConfirmGrant,
        loadGrants, setFilterTab, setSearchQuery, setSortOption, setActiveFilters,
        selectGrant, openCreateWizard, editGrant, closeWizard, setWizardStep,
        updateWizardStep1, updateWizardStep2, updateWizardStep3, updateWizardStep4,
        saveDraft, publishGrant, closeGrant, confirmCloseGrant, cancelCloseGrant,
        duplicateGrant, confirmDuplicateGrant, cancelDuplicateGrant,
        dismissPublishSuccess,
      }}
    >
      {children}
    </GrantsContext.Provider>
  );
}

export function useGrants() {
  const ctx = useContext(GrantsContext);
  if (!ctx) throw new Error("useGrants must be inside GrantsProvider");
  return ctx;
}
