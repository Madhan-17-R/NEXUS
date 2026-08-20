export type DirectPitchStatus =
  | "New"
  | "Initial Review"
  | "Technical Review"
  | "Shortlisted"
  | "Awarded"
  | "Rejected"
  | "More Information Required";

export type PitchPriority = "Normal" | "High";

export interface PitchEvent {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface PitchDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface PitchApplicantSnapshot {
  id: string;
  fullName: string;
  avatar: string;
  education: string;
  institution: string;
  domain: string;
  skills: string[];
  experience: string;
  location: string;
  isVerified: boolean;
  completionPercentage: number;
}

export interface DirectPitch {
  id: string;
  organizationId: string;
  formId: string;
  applicantId: string;
  applicantSnapshot: PitchApplicantSnapshot;
  title: string;
  domain: string;
  status: DirectPitchStatus;
  priority: PitchPriority;
  fundingRequested: number;
  submittedAt: string;
  updatedAt: string;
  assignedReviewerId?: string;
  responses: Record<string, any>;
  documents: PitchDocument[];
  activity: PitchEvent[];
}

export interface DirectPitchSettings {
  isAcceptingPitches: boolean;
  formId: string | null;
  submissionAvailability: "Always Open" | "Open Until Date";
  closingDate?: string;
  allowedApplicantTypes: string[];
  allowedDomains: string[];
}
