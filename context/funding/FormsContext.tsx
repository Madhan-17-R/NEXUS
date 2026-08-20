"use client";

import React, {
  createContext, useContext, useState, useCallback, useRef
} from "react";
import {
  FormDefinition, FormSection, FormField, FieldType,
  FormOwnerType, FieldOption, ConditionalRule, BuilderValidationError
} from "@/types/funding/forms";
import { formsApi } from "@/lib/funding/firebase/formsApi";
import { useAlert } from "./AlertContext";

// ─── Context Shape ─────────────────────────────────────────────────────────────

interface FormsContextValue {
  // Current form state
  form: FormDefinition | null;
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  isDirty: boolean;
  lastSaved: string | null;
  validationErrors: BuilderValidationError[];

  // Builder UI state
  selectedFieldId: string | null;
  selectedSectionId: string | null;
  previewOpen: boolean;
  publishModalOpen: boolean;
  publishSuccess: boolean;
  templateSelectorOpen: boolean;
  settingsPanelOpen: boolean;
  fieldLibraryOpen: boolean; // mobile toggle

  // Load / Initialize
  loadForm: (ownerType: FormOwnerType, ownerId: string, grantTitle?: string) => Promise<void>;
  loadFormById: (formId: string) => Promise<void>;

  // Form-level mutations
  updateFormMeta: (updates: Partial<Pick<FormDefinition, "title" | "description">>) => void;
  updateFormSettings: (settings: Partial<FormDefinition["settings"]>) => void;

  // Section operations
  addSection: () => void;
  updateSection: (sectionId: string, updates: Partial<Pick<FormSection, "title" | "description">>) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  duplicateSection: (sectionId: string) => void;
  deleteSection: (sectionId: string) => void;
  toggleSectionCollapse: (sectionId: string) => void;

  // Field operations
  addField: (type: FieldType, sectionId: string, afterFieldId?: string) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  moveField: (fieldId: string, direction: "up" | "down") => void;
  moveFieldToSection: (fieldId: string, targetSectionId: string) => void;
  duplicateField: (fieldId: string) => void;
  deleteField: (fieldId: string) => void;

  // Field options
  addFieldOption: (fieldId: string) => void;
  updateFieldOption: (fieldId: string, optionId: string, label: string) => void;
  deleteFieldOption: (fieldId: string, optionId: string) => void;
  moveFieldOption: (fieldId: string, optionId: string, direction: "up" | "down") => void;

  // Selection
  selectField: (fieldId: string | null) => void;
  selectSection: (sectionId: string | null) => void;

  // Persistence
  saveDraft: () => Promise<void>;
  publishForm: () => Promise<void>;

  // UI toggles
  openPreview: () => void;
  closePreview: () => void;
  openPublishModal: () => void;
  closePublishModal: () => void;
  dismissPublishSuccess: () => void;
  openTemplateSelector: () => void;
  closeTemplateSelector: () => void;
  applyTemplate: (templateId: string) => Promise<void>;
  toggleFieldLibrary: () => void;
  toggleSettingsPanel: () => void;

  // Helpers
  getFieldById: (fieldId: string) => FormField | null;
  getSectionById: (sectionId: string) => FormSection | null;
  validateForm: () => BuilderValidationError[];
}

const FormsContext = createContext<FormsContextValue | null>(null);

// ─── ID Generator (inline to avoid circular deps) ─────────────────────────────

function uid(prefix = "x"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

function countFields(sections: FormSection[]) {
  const total = sections.reduce((a, s) => a + s.fields.length, 0);
  const required = sections.reduce((a, s) => a + s.fields.filter(f => f.required).length, 0);
  return { totalFields: total, requiredFields: required };
}

// ─── Provider ──────────────────────────────────────────────────────────────────

export function FormsProvider({ children }: { children: React.ReactNode }) {
  const [form, setForm] = useState<FormDefinition | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<BuilderValidationError[]>([]);

  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [settingsPanelOpen, setSettingsPanelOpen] = useState(true);
  const [fieldLibraryOpen, setFieldLibraryOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);

  const { showSuccess, showError, showWarning, showInfo } = useAlert();

  // ── Load ──

  const loadForm = useCallback(async (ownerType: FormOwnerType, ownerId: string, grantTitle?: string) => {
    setLoading(true);
    try {
      let found = await formsApi.getByOwner(ownerType, ownerId);
      if (!found) {
        // Show template selector for new forms
        setTemplateSelectorOpen(true);
        // But also create a placeholder so state is initialised
        found = await formsApi.createEmpty(ownerType, ownerId, `${grantTitle ?? "Grant"} — Application Form`);
      }
      setForm(found);
      setIsDirty(false);
      setLastSaved(found.lastSavedAt ? new Date(found.lastSavedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormById = useCallback(async (formId: string) => {
    setLoading(true);
    try {
      const found = await formsApi.getById(formId);
      if (found) {
        setForm(found);
        setIsDirty(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Mutate helpers ──

  const mutate = useCallback((updater: (prev: FormDefinition) => FormDefinition) => {
    setForm(prev => {
      if (!prev) return prev;
      const next = updater(prev);
      const { totalFields, requiredFields } = countFields(next.sections);
      return { ...next, totalFields, requiredFields };
    });
    setIsDirty(true);
  }, []);

  // ── Form-level ──

  const updateFormMeta = useCallback((updates: Partial<Pick<FormDefinition, "title" | "description">>) => {
    mutate(f => ({ ...f, ...updates }));
  }, [mutate]);

  const updateFormSettings = useCallback((settings: Partial<FormDefinition["settings"]>) => {
    mutate(f => ({ ...f, settings: { ...f.settings, ...settings } }));
  }, [mutate]);

  // ── Section operations ──

  const addSection = useCallback(() => {
    mutate(f => {
      const order = f.sections.length + 1;
      const newSection: FormSection = {
        id: uid("sec"),
        title: `Section ${order}`,
        description: "",
        order,
        collapsed: false,
        fields: [],
      };
      return { ...f, sections: [...f.sections, newSection] };
    });
  }, [mutate]);

  const updateSection = useCallback((sectionId: string, updates: Partial<Pick<FormSection, "title" | "description">>) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => s.id === sectionId ? { ...s, ...updates } : s),
    }));
  }, [mutate]);

  const moveSection = useCallback((sectionId: string, direction: "up" | "down") => {
    mutate(f => {
      const idx = f.sections.findIndex(s => s.id === sectionId);
      if (idx === -1) return f;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= f.sections.length) return f;
      const arr = [...f.sections];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...f, sections: arr.map((s, i) => ({ ...s, order: i + 1 })) };
    });
  }, [mutate]);

  const duplicateSection = useCallback((sectionId: string) => {
    mutate(f => {
      const orig = f.sections.find(s => s.id === sectionId);
      if (!orig) return f;
      const newSecId = uid("sec");
      const dupFields = orig.fields.map(field => ({ ...field, id: uid("fld"), sectionId: newSecId }));
      const dup: FormSection = { ...orig, id: newSecId, title: `${orig.title} Copy`, fields: dupFields, order: f.sections.length + 1 };
      return { ...f, sections: [...f.sections, dup] };
    });
  }, [mutate]);

  const deleteSection = useCallback((sectionId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.filter(s => s.id !== sectionId).map((s, i) => ({ ...s, order: i + 1 })),
    }));
    if (selectedSectionId === sectionId) setSelectedSectionId(null);
  }, [mutate, selectedSectionId]);

  const toggleSectionCollapse = useCallback((sectionId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s),
    }));
  }, [mutate]);

  // ── Field operations ──

  const addField = useCallback((type: FieldType, sectionId: string, afterFieldId?: string) => {
    mutate(f => {
      const section = f.sections.find(s => s.id === sectionId);
      if (!section) return f;
      const isProfile = type.startsWith("profile_");
      const labelMap: Partial<Record<FieldType, string>> = {
        short_text: "Short Text Question",
        long_text: "Long Text Question",
        number: "Number",
        email: "Email Address",
        phone: "Phone Number",
        url: "Website URL",
        dropdown: "Dropdown Question",
        single_choice: "Single Choice Question",
        multiple_choice: "Multiple Choice Question",
        checkbox: "Checkbox",
        multi_select: "Multi Select Question",
        date: "Date",
        date_range: "Date Range",
        profile_full_name: "Full Name",
        profile_email: "Email Address",
        profile_phone: "Phone Number",
        profile_education: "Education Level",
        profile_institution: "Institution",
        profile_skills: "Skills",
        profile_domain: "Domain / Field",
        profile_experience: "Years of Experience",
        file_upload: "File Upload",
        image_upload: "Image Upload",
        video_link: "Video / Demo Link",
        funding_required: "Funding Required",
        project_timeline: "Project Timeline",
        team_members: "Team Members",
        project_stage: "Project Stage",
        custom_question: "Custom Question",
      };
      const order = afterFieldId
        ? (section.fields.find(f => f.id === afterFieldId)?.order ?? section.fields.length) + 0.5
        : section.fields.length + 1;

      const newField: FormField = {
        id: uid("fld"),
        type,
        label: labelMap[type] ?? "New Field",
        description: "",
        placeholder: "",
        required: false,
        order,
        sectionId,
        isProfileField: isProfile,
        options: ["dropdown", "single_choice", "multiple_choice", "multi_select"].includes(type)
          ? [
              { id: uid("opt"), label: "Option 1", value: "option_1", order: 1 },
              { id: uid("opt"), label: "Option 2", value: "option_2", order: 2 },
            ]
          : [],
        validation: {},
        conditionalRule: { enabled: false, logic: "all", conditions: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const updatedFields = [...section.fields, newField]
        .sort((a, b) => a.order - b.order)
        .map((f, i) => ({ ...f, order: i + 1 }));

      return {
        ...f,
        sections: f.sections.map(s =>
          s.id === sectionId ? { ...s, fields: updatedFields } : s
        ),
      };
    });
    // Auto-select newly added field
    setTimeout(() => {
      setForm(prev => {
        if (!prev) return prev;
        const section = prev.sections.find(s => s.id === sectionId);
        const newField = section?.fields[section.fields.length - 1];
        if (newField) setSelectedFieldId(newField.id);
        return prev;
      });
    }, 50);
  }, [mutate]);

  const updateField = useCallback((fieldId: string, updates: Partial<FormField>) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.map(field =>
          field.id === fieldId
            ? { ...field, ...updates, updatedAt: new Date().toISOString() }
            : field
        ),
      })),
    }));
  }, [mutate]);

  const moveField = useCallback((fieldId: string, direction: "up" | "down") => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => {
        const idx = s.fields.findIndex(field => field.id === fieldId);
        if (idx === -1) return s;
        const newIdx = direction === "up" ? idx - 1 : idx + 1;
        if (newIdx < 0 || newIdx >= s.fields.length) return s;
        const arr = [...s.fields];
        [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
        return { ...s, fields: arr.map((field, i) => ({ ...field, order: i + 1 })) };
      }),
    }));
  }, [mutate]);

  const moveFieldToSection = useCallback((fieldId: string, targetSectionId: string) => {
    mutate(f => {
      let fieldToMove: FormField | null = null;
      const sections = f.sections.map(s => {
        const field = s.fields.find(fld => fld.id === fieldId);
        if (field) {
          fieldToMove = field;
          return { ...s, fields: s.fields.filter(fld => fld.id !== fieldId).map((fld, i) => ({ ...fld, order: i + 1 })) };
        }
        return s;
      });
      if (!fieldToMove) return f;
      return {
        ...f,
        sections: sections.map(s => {
          if (s.id !== targetSectionId) return s;
          const updated = { ...(fieldToMove as FormField), sectionId: targetSectionId, order: s.fields.length + 1 };
          return { ...s, fields: [...s.fields, updated] };
        }),
      };
    });
  }, [mutate]);

  const duplicateField = useCallback((fieldId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => {
        const idx = s.fields.findIndex(field => field.id === fieldId);
        if (idx === -1) return s;
        const orig = s.fields[idx];
        const dup: FormField = { ...orig, id: uid("fld"), label: `${orig.label} Copy`, order: orig.order + 0.5, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        const arr = [...s.fields, dup].sort((a, b) => a.order - b.order).map((field, i) => ({ ...field, order: i + 1 }));
        return { ...s, fields: arr };
      }),
    }));
  }, [mutate]);

  const deleteField = useCallback((fieldId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.filter(field => field.id !== fieldId).map((field, i) => ({ ...field, order: i + 1 })),
      })),
    }));
    if (selectedFieldId === fieldId) setSelectedFieldId(null);
    showSuccess("Field removed", "Field removed successfully.");
  }, [mutate, selectedFieldId, showSuccess]);

  // ── Field Options ──

  const addFieldOption = useCallback((fieldId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.map(field => {
          if (field.id !== fieldId) return field;
          const newOpt: FieldOption = {
            id: uid("opt"),
            label: `Option ${field.options.length + 1}`,
            value: `option_${field.options.length + 1}`,
            order: field.options.length + 1,
          };
          return { ...field, options: [...field.options, newOpt] };
        }),
      })),
    }));
  }, [mutate]);

  const updateFieldOption = useCallback((fieldId: string, optionId: string, label: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.map(field => {
          if (field.id !== fieldId) return field;
          return { ...field, options: field.options.map(o => o.id === optionId ? { ...o, label, value: label.toLowerCase().replace(/\s+/g, "_") } : o) };
        }),
      })),
    }));
  }, [mutate]);

  const deleteFieldOption = useCallback((fieldId: string, optionId: string) => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.map(field => {
          if (field.id !== fieldId) return field;
          return { ...field, options: field.options.filter(o => o.id !== optionId).map((o, i) => ({ ...o, order: i + 1 })) };
        }),
      })),
    }));
  }, [mutate]);

  const moveFieldOption = useCallback((fieldId: string, optionId: string, direction: "up" | "down") => {
    mutate(f => ({
      ...f,
      sections: f.sections.map(s => ({
        ...s,
        fields: s.fields.map(field => {
          if (field.id !== fieldId) return field;
          const idx = field.options.findIndex(o => o.id === optionId);
          const newIdx = direction === "up" ? idx - 1 : idx + 1;
          if (newIdx < 0 || newIdx >= field.options.length) return field;
          const arr = [...field.options];
          [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
          return { ...field, options: arr.map((o, i) => ({ ...o, order: i + 1 })) };
        }),
      })),
    }));
  }, [mutate]);

  // ── Selection ──

  const selectField = useCallback((fieldId: string | null) => {
    setSelectedFieldId(fieldId);
    if (fieldId) setSelectedSectionId(null);
  }, []);

  const selectSection = useCallback((sectionId: string | null) => {
    setSelectedSectionId(sectionId);
    if (sectionId) setSelectedFieldId(null);
  }, []);

  // ── Persistence ──

  const saveDraft = useCallback(async () => {
    if (!form) return;
    setSaving(true);
    try {
      const saved = await formsApi.save(form);
      setForm(saved);
      setIsDirty(false);
      setLastSaved(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      showSuccess("Save successful", "Form draft saved successfully.");
    } catch (err) {
      showError("Unable to save", "We couldn't save the form draft. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [form, showSuccess, showError]);

  const validateForm = useCallback((): BuilderValidationError[] => {
    if (!form) return [];
    const errors: BuilderValidationError[] = [];
    if (!form.title.trim()) {
      errors.push({ message: "Form title is required", severity: "error" });
    }
    if (form.sections.length === 0) {
      errors.push({ message: "Add at least one section", severity: "error" });
    }
    const allFields = form.sections.flatMap(s => s.fields);
    if (allFields.length === 0) {
      errors.push({ message: "Add at least one field", severity: "error" });
    }
    for (const section of form.sections) {
      for (const field of section.fields) {
        if (!field.label.trim()) {
          errors.push({ fieldId: field.id, sectionId: section.id, message: `Field label is required (in "${section.title}")`, severity: "error" });
        }
        if (["dropdown", "single_choice", "multiple_choice", "multi_select"].includes(field.type) && field.options.length === 0) {
          errors.push({ fieldId: field.id, sectionId: section.id, message: `"${field.label}" needs at least one option`, severity: "error" });
        }
        // Check conditional references
        if (field.conditionalRule.enabled) {
          for (const cond of field.conditionalRule.conditions) {
            const refField = allFields.find(f => f.id === cond.sourceFieldId);
            if (!refField) {
              errors.push({ fieldId: field.id, sectionId: section.id, message: `Conditional rule in "${field.label}" references a deleted field`, severity: "error" });
            }
          }
        }
      }
    }
    setValidationErrors(errors);
    return errors;
  }, [form]);

  const publishForm = useCallback(async () => {
    if (!form) return;
    if (form.status === "published") {
      showInfo("Already published", "This form is already published.");
      setPublishModalOpen(false);
      return;
    }
    const errors = validateForm();
    if (errors.some(e => e.severity === "error")) {
      showWarning("Action required", "Please complete all required form configuration before publishing.");
      setPublishModalOpen(false);
      return;
    }
    setPublishing(true);
    try {
      await formsApi.save(form);
      const published = await formsApi.publish(form.id);
      if (published) {
        setForm(published);
        setIsDirty(false);
        setPublishSuccess(true);
        setPublishModalOpen(false);
        showSuccess("Publish successful", "Form published successfully. It is now ready to receive submissions.");
      }
    } catch (err) {
      showError("Unable to publish", "We couldn't publish the form. Please try again.");
    } finally {
      setPublishing(false);
    }
  }, [form, validateForm, showSuccess, showWarning, showInfo, showError]);

  // ── UI toggles ──

  const openPreview = useCallback(() => setPreviewOpen(true), []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);
  const openPublishModal = useCallback(() => {
    validateForm();
    setPublishModalOpen(true);
  }, [validateForm]);
  const closePublishModal = useCallback(() => setPublishModalOpen(false), []);
  const dismissPublishSuccess = useCallback(() => setPublishSuccess(false), []);
  const openTemplateSelector = useCallback(() => setTemplateSelectorOpen(true), []);
  const closeTemplateSelector = useCallback(() => setTemplateSelectorOpen(false), []);
  const toggleFieldLibrary = useCallback(() => setFieldLibraryOpen(v => !v), []);
  const toggleSettingsPanel = useCallback(() => setSettingsPanelOpen(v => !v), []);

  const applyTemplate = useCallback(async (templateId: string) => {
    if (!form) return;
    setLoading(true);
    try {
      const newForm = await formsApi.createFromTemplate(templateId, form.ownerType, form.ownerId, form.title);
      setForm(newForm);
      setIsDirty(true);
      setTemplateSelectorOpen(false);
    } finally {
      setLoading(false);
    }
  }, [form]);

  // ── Helpers ──

  const getFieldById = useCallback((fieldId: string): FormField | null => {
    if (!form) return null;
    for (const s of form.sections) {
      const found = s.fields.find(f => f.id === fieldId);
      if (found) return found;
    }
    return null;
  }, [form]);

  const getSectionById = useCallback((sectionId: string): FormSection | null => {
    if (!form) return null;
    return form.sections.find(s => s.id === sectionId) ?? null;
  }, [form]);

  return (
    <FormsContext.Provider value={{
      form, loading, saving, publishing, isDirty, lastSaved, validationErrors,
      selectedFieldId, selectedSectionId,
      previewOpen, publishModalOpen, publishSuccess, templateSelectorOpen,
      settingsPanelOpen, fieldLibraryOpen,
      loadForm, loadFormById,
      updateFormMeta, updateFormSettings,
      addSection, updateSection, moveSection, duplicateSection, deleteSection, toggleSectionCollapse,
      addField, updateField, moveField, moveFieldToSection, duplicateField, deleteField,
      addFieldOption, updateFieldOption, deleteFieldOption, moveFieldOption,
      selectField, selectSection,
      saveDraft, publishForm, validateForm,
      openPreview, closePreview, openPublishModal, closePublishModal, dismissPublishSuccess,
      openTemplateSelector, closeTemplateSelector, applyTemplate,
      toggleFieldLibrary, toggleSettingsPanel,
      getFieldById, getSectionById,
    }}>
      {children}
    </FormsContext.Provider>
  );
}

export function useForms() {
  const ctx = useContext(FormsContext);
  if (!ctx) throw new Error("useForms must be inside FormsProvider");
  return ctx;
}
