export type GrantStage = "Active" | "In Review" | "Draft" | "Closed" | "Closing Soon";
export type GrantStatus = "active" | "draft" | "closed" | "in_review" | "closing_soon";
export type SkillForgeRole = "Funding Organization" | "Student Innovator" | "Company Employer" | "Job Seeker";
export type FundingType = "Grant" | "Fellowship" | "Prize" | "Research Funding" | "Other";
export type ProgramType = "Student Grant" | "Innovation Grant" | "Research Grant" | "Startup Grant" | "Community Grant" | "Open Innovation";
export type GrantDomain =
  | "AI & Machine Learning"
  | "Healthcare"
  | "Climate & Sustainability"
  | "Agriculture"
  | "FinTech"
  | "Robotics"
  | "Education"
  | "Social Innovation"
  | "Climate & CleanTech"
  | "HealthTech & BioAI"
  | "Robotics & Hardware"
  | "Web3 & Security"
  | "AgriTech & Food";

export interface EligibilityCriteria {
  applicantTypes: string[];
  educationLevels: string[];
  experienceLevel: string;
  domains: string[];
  skills: string[];
  geography: string;
  selectedCountries: string[];
  additionalRequirements: string;
}

export interface GrantTimeline {
  openingDate: string;
  deadline: string;
  reviewPeriodEnd: string;
  decisionDate: string;
  fundingStartDate: string;
}

export interface ApplicationFormConfig {
  status: "not_configured" | "draft" | "configured";
  totalFields: number;
  totalSections: number;
  requiredFields: number;
  optionalFields: number;
  sections: string[];
  formId?: string;
  lastUpdated?: string;
}

export interface GrantActivity {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestamp: string;
  time: string;
}

export interface FullGrant {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  domain: GrantDomain;
  focusAreas: string[];
  programType: ProgramType;
  fundingType: FundingType;
  status: GrantStatus;
  currency: string;
  totalPool: number;
  disbursed: number;
  minAward: number;
  maxAward: number;
  numberOfAwards: number;
  timeline: GrantTimeline;
  eligibility: EligibilityCriteria;
  applicationForm: ApplicationFormConfig;
  applicationCount: number;
  pendingReview: number;
  shortlisted: number;
  awarded: number;
  organizationName: string;
  organizationId: string;
  verified: boolean;
  tags: string[];
  eligibilityBullets: string[];
  code: string;
  activity: GrantActivity[];
  createdAt: string;
  updatedAt: string;
  postedTime: string;
  daysLeft: number;
}

// Legacy Grant interface used by Phase 1 dashboard (kept for backward compat)
export interface Grant {
  id: string;
  title: string;
  code: string;
  category: string;
  stage: GrantStage;
  statusVariant: "success" | "warning" | "neutral" | "danger" | "info";
  totalPool: number;
  disbursed: number;
  minAward: number;
  maxAward: number;
  daysLeft: number;
  deadline: string;
  applicationCount: number;
  pendingReview: number;
  shortlisted: number;
  awarded: number;
  description: string;
  eligibilityBullets: string[];
  tags: string[];
  postedTime: string;
  organizationName: string;
  verified: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  count: number;
  percentage: number;
  color: string;
  hint: string;
  avgDaysInStage: number;
}

export interface DirectPitch {
  id: string;
  innovator: string;
  company: string;
  title: string;
  category: string;
  stage: "New Pitch" | "Under Assessment" | "Shortlisted" | "Approved" | "Archived";
  askAmount: string;
  submittedAt: string;
  traction: string;
  readiness: string;
  pitchDeckUrl: string;
  avatar?: string;
  summary: string;
  contactEmail: string;
  tags: string[];
  bullets: string[];
}

export type ActivityType = "application" | "pitch" | "review" | "disbursement" | "system";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  target: string;
  time: string;
  timestamp: string;
  actor: {
    name: string;
    avatar?: string | null;
    initials: string;
  };
  badgeText: string;
  badgeVariant: "info" | "purple" | "warning" | "success" | "neutral";
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "warning" | "info" | "success" | "neutral";
  actionUrl?: string;
}

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  type: string;
  logoInitials: string;
  badge: string;
  cycle: string;
  totalCommittedCapital: number;
  totalDisbursedCapital: number;
  currency: string;
  activeGrantCount: number;
  totalApplications: number;
  pendingReviewCount: number;
  directPitchEnabled: boolean;
  incomingPitchesCount: number;
  unreadNotificationsCount: number;
  currentUser: {
    name: string;
    role: string;
    avatar?: string;
    initials: string;
    email: string;
  };
}
