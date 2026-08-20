// ─── Form Field Types ──────────────────────────────────────────────────────────

export type FieldType =
  // Basic
  | "short_text"
  | "long_text"
  | "number"
  | "email"
  | "phone"
  | "url"
  // Selection
  | "dropdown"
  | "single_choice"
  | "multiple_choice"
  | "checkbox"
  | "multi_select"
  // Date & Time
  | "date"
  | "date_range"
  // Profile (auto-populated from innovator profile)
  | "profile_full_name"
  | "profile_email"
  | "profile_phone"
  | "profile_education"
  | "profile_institution"
  | "profile_skills"
  | "profile_domain"
  | "profile_experience"
  // Upload
  | "file_upload"
  | "image_upload"
  | "video_link"
  // Funding & Project
  | "funding_required"
  | "project_timeline"
  | "team_members"
  | "project_stage"
  // Custom
  | "custom_question";

export type FormStatus = "draft" | "published" | "archived";
export type FormOwnerType = "grant" | "directPitch";

// ─── Field Option (for dropdowns, single/multi choice) ─────────────────────────

export interface FieldOption {
  id: string;
  label: string;
  value: string;
  order: number;
}

// ─── Field Validation ──────────────────────────────────────────────────────────

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  allowedFileTypes?: string[];   // e.g. ["pdf", "pptx", "doc"]
  maxFileSizeMB?: number;
  maxFiles?: number;
  pattern?: string;              // regex
  decimalsAllowed?: boolean;
  unit?: string;                 // e.g. "₹", "USD", "days"
}

// ─── Conditional Rule ──────────────────────────────────────────────────────────

export type ConditionOperator = "equals" | "not_equals" | "contains" | "greater_than" | "less_than" | "is_filled" | "is_empty";
export type ConditionLogic = "all" | "any";

export interface ConditionClause {
  id: string;
  sourceFieldId: string;        // Field whose value is evaluated
  operator: ConditionOperator;
  value: string;                // The value to compare against
}

export interface ConditionalRule {
  enabled: boolean;
  logic: ConditionLogic;        // "all" | "any"
  conditions: ConditionClause[];
}

// ─── Form Field ────────────────────────────────────────────────────────────────

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  description: string;
  placeholder: string;
  required: boolean;
  order: number;
  sectionId: string;
  options: FieldOption[];
  validation: FieldValidation;
  conditionalRule: ConditionalRule;
  isProfileField: boolean;       // True for profile_* types
  createdAt: string;
  updatedAt: string;
}

// ─── Form Section ──────────────────────────────────────────────────────────────

export interface FormSection {
  id: string;
  title: string;
  description: string;
  order: number;
  collapsed: boolean;
  fields: FormField[];
}

// ─── Form Settings ─────────────────────────────────────────────────────────────

export interface FormSettings {
  estimatedMinutes: number;
  applicantInstructions: string;
  allowSaveAndContinue: boolean;
  confirmationText: string;
}

// ─── Form Definition ───────────────────────────────────────────────────────────

export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  ownerType: FormOwnerType;
  ownerId: string;           // grantId or directPitchId
  status: FormStatus;
  sections: FormSection[];
  settings: FormSettings;
  totalFields: number;
  requiredFields: number;
  publishedAt?: string;
  publishedVersion?: number;
  createdAt: string;
  updatedAt: string;
  lastSavedAt?: string;
}

// ─── Template ─────────────────────────────────────────────────────────────────

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "student_grant" | "startup_grant" | "research_grant" | "general";
  sections: Omit<FormSection, "id" | "fields">[];
  fieldBlueprints: Omit<FormField, "id" | "sectionId" | "createdAt" | "updatedAt">[];
  estimatedMinutes: number;
}

// ─── Builder UI State (not persisted) ─────────────────────────────────────────

export interface BuilderValidationError {
  fieldId?: string;
  sectionId?: string;
  message: string;
  severity: "error" | "warning";
}
