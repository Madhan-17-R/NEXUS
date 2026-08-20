// ============================================================
// INNOLAB TYPE DEFINITIONS
// All entity types for the SkillForge platform
// ============================================================

// ─── USER TYPES ──────────────────────────────────────────────

export type UserRole =
  | 'Student Innovator'
  | 'Working Professional'
  | 'Independent Innovator'
  | 'Company'
  | 'Funding Organization';

export type ProfessionalStatus = 'Student' | 'Working Professional' | 'Independent Innovator';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  location?: string;
  createdAt: string;
}

export interface Innovator extends User {
  role: 'Student Innovator' | 'Working Professional' | 'Independent Innovator';
  professionalStatus: ProfessionalStatus;
  skills: string[];
  domains: string[];
  education?: Education;
  workExperience?: WorkExperience;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  projectIds?: string[];
  connectionCount?: number;
  collaborationCount?: number;
}

export interface Education {
  institution: string;
  course: string;
  yearOfStudy: string;
  fieldOfStudy: string;
}

export interface WorkExperience {
  organization: string;
  designation: string;
  yearsOfExperience: string;
}

export interface Company extends User {
  role: 'Company';
  industry: string;
  size?: string;
  website?: string;
  description?: string;
}

export interface FundingOrganization extends User {
  role: 'Funding Organization';
  orgType: string;
  focusAreas: string[];
  website?: string;
  description?: string;
  about?: string;
  acceptsDirectPitches: boolean;
  grantsCount?: number;
  logo?: string;
}

// ─── POST / FEED TYPES ───────────────────────────────────────

export type PostType = 'job' | 'internship' | 'grant' | 'collaboration' | 'idea' | 'project';

export interface BasePost {
  id: string;
  postType: PostType;
  timestamp: string;
  postedDate?: string;
}

export interface JobPost extends BasePost {
  postType: 'job';
  companyId: string;
  companyName: string;
  companyLogo?: string;
  jobTitle: string;
  domain: string;
  location: string;
  isRemote?: boolean;
  salary: string;
  jobType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  roleDetails: string[];
  skillsRequired: string[];
  description?: string;
  deadline?: string;
  applicantCount?: number;
  isVerified?: boolean;
}

export interface InternshipPost extends BasePost {
  postType: 'internship';
  companyId: string;
  companyName: string;
  companyLogo?: string;
  internshipTitle: string;
  domain: string;
  location: string;
  isRemote?: boolean;
  stipend?: string;
  duration: string;
  skillsRequired: string[];
  description?: string;
  deadline?: string;
  isVerified?: boolean;
}

export interface GrantPost extends BasePost {
  postType: 'grant';
  orgId: string;
  orgName: string;
  orgLogo?: string;
  grantTitle: string;
  fundingAmount: string;
  domain: string;
  eligibility: string;
  criteria: string[];
  focusAreas: string[];
  deadline: string;
  description?: string;
  pitchesCount?: number;
}

export interface CollaborationPost extends BasePost {
  postType: 'collaboration';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  projectTitle: string;
  domain: string;
  skillsNeeded: string[];
  description: string;
  teamSize?: number;
  isOpen: boolean;
}

export interface IdeaPost extends BasePost {
  postType: 'idea';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorInstitution: string;
  title: string;
  description: string;
  tags: string[];
  fundingNeeded?: string;
  likes: number;
  isLiked: boolean;
  commentCount?: number;
}

export type FeedPost = JobPost | InternshipPost | GrantPost | CollaborationPost | IdeaPost;

// ─── COLLABORATION TYPES ─────────────────────────────────────

export type CollaborationRequestStatus = 'pending' | 'accepted' | 'declined';
export type ConnectionStatus = 'none' | 'pending' | 'connected';
export type CollaborationStatus = 'pending' | 'active' | 'ended';

export interface CollaborationRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  fromUserRole: string;
  toUserId: string;
  toUserName: string;
  projectTitle: string;
  reason: string;
  skills: string[];
  message?: string;
  status: CollaborationRequestStatus;
  sentAt: string;
}

export interface ActiveCollaboration {
  id: string;
  collaborationRequestId: string;
  participant1: CollaborationParticipant;
  participant2: CollaborationParticipant;
  projectTitle: string;
  status: CollaborationStatus;
  startedAt: string;
  endedAt?: string;
  chatId: string;
}

export interface CollaborationParticipant {
  userId: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Connection {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: string;
  connectedAt: string;
  mutualConnections?: number;
}

// ─── CHAT TYPES ───────────────────────────────────────────────

export interface ChatConversation {
  id: string;
  collaborationId: string;
  participants: CollaborationParticipant[];
  lastMessage?: Message;
  lastMessageAt?: string;
  isOnline?: boolean;
  unreadCount?: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isRead: boolean;
  type: 'text' | 'file' | 'image';
}

// ─── PROJECT TYPES ────────────────────────────────────────────

export type ProjectStatus = 'Planning' | 'Active' | 'Completed' | 'Paused';

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  domain: string;
  skills: string[];
  teamMembers: TeamMember[];
  progress?: number;
  tasks?: Task[];
  updates?: ProjectUpdate[];
  createdAt: string;
  updatedAt?: string;
}

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  assignee?: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate?: string;
}

export interface ProjectUpdate {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

// ─── PITCH TYPES ─────────────────────────────────────────────

export type DevelopmentStage = 'Idea' | 'Prototype' | 'MVP' | 'Working Product';
export type PitchStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected' | 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface Pitch {
  id: string;
  innovatorId: string;
  organizationId: string | null;
  grantId: string | null;
  organizationName?: string;
  grantTitle?: string;
  pitchType: 'Direct Pitch' | 'Grant Application';
  ideaTitle: string;
  problemStatement: string;
  proposedSolution: string;
  innovation: string;
  domain: string;
  stage: DevelopmentStage;
  fundingRequired: string;
  teamSize: number;
  status: PitchStatus;
  createdAt: string;
  updatedAt?: string;
}

// ─── APPLICATION TYPES ───────────────────────────────────────

export type ApplicationStatus =
  | 'Applied'
  | 'Under Review'
  | 'Shortlisted'
  | 'Interview'
  | 'Selected'
  | 'Rejected';

export interface Application {
  id: string;
  userId: string;
  postId: string;
  postType: 'job' | 'internship' | 'grant';
  title: string;
  companyOrOrg: string;
  domain: string;
  salary?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt?: string;
  logo?: string;
}

// ─── NOTIFICATION TYPES ───────────────────────────────────────

export type NotificationType =
  | 'collaboration_request'
  | 'collaboration_accepted'
  | 'collaboration_declined'
  | 'application_update'
  | 'grant_match'
  | 'new_connection'
  | 'new_message'
  | 'project_invitation'
  | 'pitch_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  fromUser?: {
    name: string;
    avatar: string;
  };
}

// ─── AUTH TYPES ───────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  isLoggedIn: boolean;
  profileComplete: boolean;
}

// ─── PROFILE SETUP ────────────────────────────────────────────

export interface ProfileSetupData {
  step: number;
  personalInfo: {
    fullName: string;
    dateOfBirth: string;
    profilePicture?: string;
  };
  professionalStatus: ProfessionalStatus;
  education?: Education;
  workExperience?: WorkExperience;
  skills: string[];
  domains: string[];
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  bio: string;
}
