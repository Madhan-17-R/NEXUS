import {
  ApplicationStatus,
  GrantApplication,
  ApplicationPriority,
  ApplicationReviewer,
} from "@/types/funding/applications";

// ─── ID Generator ─────────────────────────────────────────────────────────────
function uid(prefix = "app"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

// ─── Mock Reviewers ───────────────────────────────────────────────────────────
export const MOCK_REVIEWERS: ApplicationReviewer[] = [
  { id: "rev_1", name: "A. Kumar", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "rev_2", name: "Priya Shah", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "rev_3", name: "Rahul Menon", avatar: "https://i.pravatar.cc/150?u=3" },
];

// ─── Seed Data ────────────────────────────────────────────────────────────────
let mockApplications: GrantApplication[] = [
  {
    id: "APP-2026-00124",
    grantId: "g1", // Assumes matching some grant ID from Phase 2
    formId: "tpl_student_innovation", // Should match form definition
    applicantId: "usr_1",
    applicantSnapshot: {
      id: "usr_1",
      fullName: "Maya Krishnan",
      avatar: "https://i.pravatar.cc/150?u=maya",
      education: "Undergraduate",
      institution: "National Institute of Technology",
      domain: "Healthcare",
      skills: ["Python", "Machine Learning", "IoT"],
      experience: "2 years",
      location: "Bangalore, India",
      isVerified: true,
      completionPercentage: 100,
    },
    projectTitle: "AI-Powered Rural Healthcare Assistant",
    domain: "Healthcare",
    status: "Technical Review",
    priority: "High",
    fundingRequested: 750000,
    submittedAt: "2026-08-18T16:32:00Z",
    updatedAt: "2026-08-19T14:15:00Z",
    assignedReviewerId: "rev_1",
    responses: {
      // These keys should ideally match the dynamically generated IDs, 
      // but for mock preview they will map to the known template fields
      // Assuming fields like short_text, long_text from the template
      "project_title": "AI-Powered Rural Healthcare Assistant",
      "problem_statement": "Lack of quick diagnostic access in rural areas.",
      "funding_required": 750000,
    },
    documents: [
      { id: "doc_1", name: "Pitch Deck.pdf", size: "2.4 MB", type: "pdf", url: "#" },
      { id: "doc_2", name: "Architecture.png", size: "1.1 MB", type: "png", url: "#" }
    ],
    internalNotes: [
      {
        id: "note_1",
        content: "Promising technical approach. Need additional information about deployment costs.",
        reviewerId: "rev_1",
        reviewerName: "A. Kumar",
        timestamp: "2026-08-19T10:30:00Z"
      }
    ],
    activity: [
      { id: "evt_1", action: "Application submitted", description: "Maya Krishnan submitted the application", actor: "Maya Krishnan", timestamp: "2026-08-18T16:32:00Z" },
      { id: "evt_2", action: "Assigned to Reviewer", description: "Application assigned to A. Kumar", actor: "System", timestamp: "2026-08-19T10:24:00Z" },
      { id: "evt_3", action: "Status updated", description: "Status changed to Technical Review", actor: "A. Kumar", timestamp: "2026-08-19T14:15:00Z" },
    ],
    review: {
      eligibilityStatus: "Eligible",
      technicalStatus: "Pending",
      fundingStatus: "Pending",
      recommendation: "Pending"
    }
  },
  {
    id: "APP-2026-00125",
    grantId: "g1",
    formId: "tpl_student_innovation",
    applicantId: "usr_2",
    applicantSnapshot: {
      id: "usr_2",
      fullName: "Arjun Mehta",
      avatar: "https://i.pravatar.cc/150?u=arjun",
      education: "Postgraduate",
      institution: "Indian Institute of Technology",
      domain: "Agriculture",
      skills: ["Hardware Design", "C++", "Sensors"],
      experience: "4 years",
      location: "Pune, India",
      isVerified: true,
      completionPercentage: 90,
    },
    projectTitle: "Low-Cost Smart Irrigation Network",
    domain: "Agriculture",
    status: "Shortlisted",
    priority: "Normal",
    fundingRequested: 500000,
    submittedAt: "2026-08-15T09:00:00Z",
    updatedAt: "2026-08-18T11:00:00Z",
    assignedReviewerId: "rev_2",
    responses: {
      "project_title": "Low-Cost Smart Irrigation Network",
      "funding_required": 500000,
    },
    documents: [],
    internalNotes: [],
    activity: [
      { id: "evt_4", action: "Application submitted", description: "Arjun Mehta submitted the application", actor: "Arjun Mehta", timestamp: "2026-08-15T09:00:00Z" },
      { id: "evt_5", action: "Status updated", description: "Status changed to Shortlisted", actor: "Priya Shah", timestamp: "2026-08-18T11:00:00Z" },
    ],
    review: {
      eligibilityStatus: "Eligible",
      technicalStatus: "Pass",
      fundingStatus: "Approved",
      recommendation: "Shortlist"
    }
  },
  {
    id: "APP-2026-00126",
    grantId: "g1",
    formId: "tpl_student_innovation",
    applicantId: "usr_3",
    applicantSnapshot: {
      id: "usr_3",
      fullName: "Priya Nair",
      avatar: "https://i.pravatar.cc/150?u=priya",
      education: "PhD",
      institution: "IISc",
      domain: "Climate / Energy",
      skills: ["Renewable Energy", "Data Analysis"],
      experience: "5 years",
      location: "Chennai, India",
      isVerified: true,
      completionPercentage: 95,
    },
    projectTitle: "Community Solar Optimization Platform",
    domain: "Climate",
    status: "Submitted",
    priority: "Normal",
    fundingRequested: 1200000,
    submittedAt: "2026-08-19T08:00:00Z",
    updatedAt: "2026-08-19T08:00:00Z",
    responses: {},
    documents: [],
    internalNotes: [],
    activity: [
      { id: "evt_6", action: "Application submitted", description: "Priya Nair submitted the application", actor: "Priya Nair", timestamp: "2026-08-19T08:00:00Z" },
    ],
    review: {
      eligibilityStatus: "Pending",
      technicalStatus: "Pending",
      fundingStatus: "Pending",
      recommendation: "Pending"
    }
  },
  {
    id: "APP-2026-00127",
    grantId: "g1",
    formId: "tpl_student_innovation",
    applicantId: "usr_4",
    applicantSnapshot: {
      id: "usr_4",
      fullName: "Rahul Verma",
      avatar: "https://i.pravatar.cc/150?u=rahul",
      education: "Undergraduate",
      institution: "Delhi University",
      domain: "Education",
      skills: ["React", "Node.js"],
      experience: "1 year",
      location: "Delhi, India",
      isVerified: false,
      completionPercentage: 80,
    },
    projectTitle: "Accessible Learning Assistant",
    domain: "Education",
    status: "More Information Required",
    priority: "Normal",
    fundingRequested: 300000,
    submittedAt: "2026-08-10T10:00:00Z",
    updatedAt: "2026-08-12T15:00:00Z",
    assignedReviewerId: "rev_3",
    responses: {},
    documents: [],
    internalNotes: [],
    activity: [
      { id: "evt_7", action: "Application submitted", description: "Rahul Verma submitted the application", actor: "Rahul Verma", timestamp: "2026-08-10T10:00:00Z" },
      { id: "evt_8", action: "Information requested", description: "Rahul Menon requested more details on team structure", actor: "Rahul Menon", timestamp: "2026-08-12T15:00:00Z" },
    ],
    review: {
      eligibilityStatus: "Eligible",
      technicalStatus: "Pending",
      fundingStatus: "Pending",
      recommendation: "Pending"
    }
  }
];

// ─── API Methods ──────────────────────────────────────────────────────────────

export const applicationsApi = {
  async getApplications(grantId: string): Promise<GrantApplication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockApplications.filter(a => a.grantId === grantId));
      }, 300);
    });
  },

  async getApplicationById(applicationId: string): Promise<GrantApplication | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const app = mockApplications.find(a => a.id === applicationId);
        resolve(app ? { ...app } : null);
      }, 200);
    });
  },

  async updateApplicationStatus(applicationId: string, status: ApplicationStatus, actor: string = "Reviewer"): Promise<GrantApplication> {
    return new Promise((resolve, reject) => {
      const idx = mockApplications.findIndex(a => a.id === applicationId);
      if (idx === -1) return reject("Not found");
      
      const app = { ...mockApplications[idx] };
      app.status = status;
      app.updatedAt = new Date().toISOString();
      app.activity.unshift({
        id: uid("evt"),
        action: "Status updated",
        description: `Status changed to ${status}`,
        actor,
        timestamp: app.updatedAt
      });
      
      if (status === "Shortlisted") app.review.recommendation = "Shortlist";
      if (status === "Awarded") app.review.recommendation = "Award";
      if (status === "Rejected") app.review.recommendation = "Reject";
      
      mockApplications[idx] = app;
      setTimeout(() => resolve(app), 300);
    });
  },

  async assignReviewer(applicationId: string, reviewerId: string | undefined, actor: string = "System"): Promise<GrantApplication> {
    return new Promise((resolve, reject) => {
      const idx = mockApplications.findIndex(a => a.id === applicationId);
      if (idx === -1) return reject("Not found");
      
      const app = { ...mockApplications[idx] };
      app.assignedReviewerId = reviewerId;
      app.updatedAt = new Date().toISOString();
      
      const revName = MOCK_REVIEWERS.find(r => r.id === reviewerId)?.name || "Unassigned";
      
      app.activity.unshift({
        id: uid("evt"),
        action: reviewerId ? "Assigned Reviewer" : "Unassigned Reviewer",
        description: reviewerId ? `Assigned to ${revName}` : "Removed assigned reviewer",
        actor,
        timestamp: app.updatedAt
      });
      
      mockApplications[idx] = app;
      setTimeout(() => resolve(app), 300);
    });
  },

  async addInternalNote(applicationId: string, content: string, reviewerId: string): Promise<GrantApplication> {
    return new Promise((resolve, reject) => {
      const idx = mockApplications.findIndex(a => a.id === applicationId);
      if (idx === -1) return reject("Not found");
      
      const rev = MOCK_REVIEWERS.find(r => r.id === reviewerId);
      const app = { ...mockApplications[idx] };
      app.updatedAt = new Date().toISOString();
      
      app.internalNotes.unshift({
        id: uid("note"),
        content,
        reviewerId,
        reviewerName: rev?.name || "Unknown Reviewer",
        timestamp: app.updatedAt
      });
      
      app.activity.unshift({
        id: uid("evt"),
        action: "Internal note added",
        description: "Added a new internal note",
        actor: rev?.name || "Reviewer",
        timestamp: app.updatedAt
      });
      
      mockApplications[idx] = app;
      setTimeout(() => resolve(app), 300);
    });
  },

  async updatePriority(applicationId: string, priority: ApplicationPriority, actor: string = "Reviewer"): Promise<GrantApplication> {
    return new Promise((resolve, reject) => {
      const idx = mockApplications.findIndex(a => a.id === applicationId);
      if (idx === -1) return reject("Not found");
      
      const app = { ...mockApplications[idx] };
      app.priority = priority;
      app.updatedAt = new Date().toISOString();
      
      app.activity.unshift({
        id: uid("evt"),
        action: "Priority updated",
        description: `Marked as ${priority} Priority`,
        actor,
        timestamp: app.updatedAt
      });
      
      mockApplications[idx] = app;
      setTimeout(() => resolve(app), 200);
    });
  },
  
  async requestInformation(applicationId: string, requestText: string, actor: string = "Reviewer"): Promise<GrantApplication> {
    return new Promise((resolve, reject) => {
      const idx = mockApplications.findIndex(a => a.id === applicationId);
      if (idx === -1) return reject("Not found");
      
      const app = { ...mockApplications[idx] };
      app.status = "More Information Required";
      app.updatedAt = new Date().toISOString();
      
      app.activity.unshift({
        id: uid("evt"),
        action: "Information requested",
        description: "Requested additional information from the applicant",
        actor,
        timestamp: app.updatedAt
      });
      
      mockApplications[idx] = app;
      setTimeout(() => resolve(app), 300);
    });
  }
};
