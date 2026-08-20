// ─── Roles ────────────────────────────────────────────────────────────────────
export type Role = 'job_seeker';

export const ROLE_LABELS: Record<string, string> = {
  job_seeker: 'Job Seeker',
};

// ─── User ─────────────────────────────────────────────────────────────────────
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  title?: string;
  location?: string;
  skills?: string[];
  bio?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeFileName?: string;
  createdAt: string;
}

// ─── Job / Post Types ─────────────────────────────────────────────────────────
export type PostType = 'company_job' | 'innovator_post';

export type JobType = 'full_time' | 'part_time' | 'gig' | 'contract';

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  gig: 'Gig',
  contract: 'Contract',
};

export type WorkMode = 'remote' | 'on_site' | 'hybrid';

export interface JobPost {
  id: string;
  type: PostType;
  title: string;
  company: string;
  companyLogo?: string;
  companyInitials: string;
  companyColor: string;
  isVerified: boolean;
  location: string;
  workMode: WorkMode;
  salaryMin?: number;
  salaryMax?: number;
  salaryUnit?: 'yr' | 'hr' | 'mo';
  jobType?: JobType;
  description: string;
  roleDetails: string[];
  skills: string[];
  postedAt: string;
  postedAgo: string;
  applicants?: number;
  /** For innovator posts */
  innovatorBadge?: string;
  innovatorAuthor?: string;
}

// ─── Application & Collaboration ─────────────────────────────────────────────
export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'archived';

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  shortlisted: 'Shortlisted',
  interview_scheduled: 'Interview Scheduled',
  archived: 'Archived',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  shortlisted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  interview_scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
  archived: 'bg-slate-100 text-slate-500 border-slate-200',
};

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  type: 'job' | 'collaboration';
  status: ApplicationStatus;
  resumeFileName?: string;
  portfolioUrl?: string;
  pitch?: string;
  appliedAt: string;
  appliedAgo: string;
  job?: JobPost;
}

// ─── Direct Messages ──────────────────────────────────────────────────────────
export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  participantAvatar: string;
  companyOrProject: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  online: boolean;
  messages: DirectMessage[];
}

// ─── Notifications ────────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'application' | 'message' | 'match' | 'system';
  link?: string;
}

// ─── Feed Filters ─────────────────────────────────────────────────────────────
export interface FeedFilters {
  query: string;
  activeTab: 'all' | 'company_jobs' | 'innovator_posts';
  activeTags: string[];
  jobType: JobType | '';
  workMode: WorkMode | '';
  salaryMin: number;
}