export type ApplicationStatus =
  | "Submitted"
  | "Eligibility Screening"
  | "Technical Review"
  | "Due Diligence"
  | "Shortlisted"
  | "Awarded"
  | "Rejected"
  | "More Information Required";

export type ApplicationPriority = "Normal" | "High";

export interface ApplicationEvent {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: string;
}

export interface ApplicationReviewer {
  id: string;
  name: string;
  avatar?: string;
}

export interface ApplicationInternalNote {
  id: string;
  content: string;
  reviewerId: string;
  reviewerName: string;
  timestamp: string;
}

export interface ApplicationDocument {
  id: string;
  name: string;
  size: string; // e.g. "2.4 MB"
  type: string; // mime or extension
  url: string;
}

export interface ApplicantSnapshot {
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

export interface GrantApplication {
  id: string;
  grantId: string;
  formId: string;
  applicantId: string;
  applicantSnapshot: ApplicantSnapshot;
  projectTitle: string;
  domain: string;
  status: ApplicationStatus;
  priority: ApplicationPriority;
  fundingRequested: number;
  submittedAt: string;
  updatedAt: string;
  assignedReviewerId?: string;
  
  // Responses keyed by form field ID
  responses: Record<string, any>;
  
  documents: ApplicationDocument[];
  internalNotes: ApplicationInternalNote[];
  activity: ApplicationEvent[];
  
  // Review state
  review: {
    eligibilityStatus: "Pending" | "Eligible" | "Ineligible";
    technicalStatus: "Pending" | "Pass" | "Fail";
    fundingStatus: "Pending" | "Approved" | "Denied";
    recommendation: "Pending" | "Shortlist" | "Reject" | "Award";
  };
}
