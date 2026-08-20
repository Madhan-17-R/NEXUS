import { DirectPitch, DirectPitchSettings, DirectPitchStatus, PitchPriority } from "@/types/funding/directPitches";
import { ApplicationReviewer } from "@/types/funding/applications";

function uid(prefix = "pitch"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

export const MOCK_REVIEWERS: ApplicationReviewer[] = [
  { id: "rev_1", name: "A. Kumar", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "rev_2", name: "Priya Shah", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "rev_3", name: "Rahul Menon", avatar: "https://i.pravatar.cc/150?u=3" },
];

let mockSettings: DirectPitchSettings = {
  isAcceptingPitches: false,
  formId: null,
  submissionAvailability: "Always Open",
  allowedApplicantTypes: ["Student", "Innovator", "Startup"],
  allowedDomains: ["AI", "Healthcare", "Climate", "Agriculture"]
};

let mockPitches: DirectPitch[] = [
  {
    id: "PITCH-2026-0017",
    organizationId: "org_1",
    formId: "tpl_direct_pitch",
    applicantId: "usr_1",
    applicantSnapshot: {
      id: "usr_1",
      fullName: "Dr. Priya Patel",
      avatar: "https://i.pravatar.cc/150?u=priya_p",
      education: "MD",
      institution: "AIIMS",
      domain: "Healthcare",
      skills: ["Clinical Research", "AI"],
      experience: "8 years",
      location: "Delhi, India",
      isVerified: true,
      completionPercentage: 100,
    },
    title: "AI-Powered Rural Healthcare Assistant",
    domain: "Healthcare",
    status: "New",
    priority: "Normal",
    fundingRequested: 1200000,
    submittedAt: "2026-08-19T09:14:00Z",
    updatedAt: "2026-08-19T09:14:00Z",
    responses: {
      "idea_title": "AI-Powered Rural Healthcare Assistant",
      "problem_statement": "Lack of specialist doctors in remote areas.",
      "funding_required": 1200000
    },
    documents: [],
    activity: [
      { id: "evt_1", action: "Pitch submitted", description: "Dr. Priya Patel submitted a direct pitch", actor: "Dr. Priya Patel", timestamp: "2026-08-19T09:14:00Z" }
    ]
  },
  {
    id: "PITCH-2026-0018",
    organizationId: "org_1",
    formId: "tpl_direct_pitch",
    applicantId: "usr_2",
    applicantSnapshot: {
      id: "usr_2",
      fullName: "Aris Thorne",
      avatar: "https://i.pravatar.cc/150?u=aris",
      education: "PhD",
      institution: "MIT",
      domain: "Climate",
      skills: ["Data Science", "Meteorology"],
      experience: "5 years",
      location: "Bangalore, India",
      isVerified: true,
      completionPercentage: 90,
    },
    title: "Climate Risk Intelligence Platform",
    domain: "Climate",
    status: "Initial Review",
    priority: "High",
    fundingRequested: 1800000,
    submittedAt: "2026-08-18T10:00:00Z",
    updatedAt: "2026-08-18T11:45:00Z",
    assignedReviewerId: "rev_1",
    responses: {
      "idea_title": "Climate Risk Intelligence Platform",
      "funding_required": 1800000
    },
    documents: [
      { id: "doc_1", name: "PitchDeck.pdf", size: "3.2 MB", type: "pdf", url: "#" }
    ],
    activity: [
      { id: "evt_2", action: "Pitch submitted", description: "Aris Thorne submitted a direct pitch", actor: "Aris Thorne", timestamp: "2026-08-18T10:00:00Z" },
      { id: "evt_3", action: "Assigned Reviewer", description: "Assigned to A. Kumar", actor: "System", timestamp: "2026-08-18T10:15:00Z" },
      { id: "evt_4", action: "Initial review started", description: "Status changed to Initial Review", actor: "A. Kumar", timestamp: "2026-08-18T11:45:00Z" }
    ]
  },
  {
    id: "PITCH-2026-0019",
    organizationId: "org_1",
    formId: "tpl_direct_pitch",
    applicantId: "usr_3",
    applicantSnapshot: {
      id: "usr_3",
      fullName: "Maya Lin",
      avatar: "https://i.pravatar.cc/150?u=maya_l",
      education: "B.Tech",
      institution: "IIT Bombay",
      domain: "Agriculture",
      skills: ["IoT", "Hardware"],
      experience: "2 years",
      location: "Mumbai, India",
      isVerified: false,
      completionPercentage: 75,
    },
    title: "Affordable Smart Farming Sensors",
    domain: "Agriculture",
    status: "More Information Required",
    priority: "Normal",
    fundingRequested: 850000,
    submittedAt: "2026-08-17T14:20:00Z",
    updatedAt: "2026-08-18T16:00:00Z",
    assignedReviewerId: "rev_2",
    responses: {
      "idea_title": "Affordable Smart Farming Sensors",
      "funding_required": 850000
    },
    documents: [],
    activity: [
      { id: "evt_5", action: "Pitch submitted", description: "Maya Lin submitted a direct pitch", actor: "Maya Lin", timestamp: "2026-08-17T14:20:00Z" },
      { id: "evt_6", action: "Information requested", description: "Requested more info on sensor BOM", actor: "Priya Shah", timestamp: "2026-08-18T16:00:00Z" }
    ]
  }
];

export const directPitchesApi = {
  async getSettings(organizationId: string): Promise<DirectPitchSettings> {
    return new Promise(resolve => setTimeout(() => resolve({ ...mockSettings }), 300));
  },

  async updateSettings(organizationId: string, updates: Partial<DirectPitchSettings>): Promise<DirectPitchSettings> {
    return new Promise(resolve => {
      mockSettings = { ...mockSettings, ...updates };
      setTimeout(() => resolve({ ...mockSettings }), 300);
    });
  },

  async getPitches(organizationId: string): Promise<DirectPitch[]> {
    return new Promise(resolve => setTimeout(() => resolve([...mockPitches]), 300));
  },

  async getPitchById(pitchId: string): Promise<DirectPitch | null> {
    return new Promise(resolve => {
      const pitch = mockPitches.find(p => p.id === pitchId);
      setTimeout(() => resolve(pitch ? { ...pitch } : null), 200);
    });
  },

  async updatePitchStatus(pitchId: string, status: DirectPitchStatus, actor: string = "Reviewer"): Promise<DirectPitch> {
    return new Promise((resolve, reject) => {
      const idx = mockPitches.findIndex(p => p.id === pitchId);
      if (idx === -1) return reject("Not found");
      
      const pitch = { ...mockPitches[idx] };
      pitch.status = status;
      pitch.updatedAt = new Date().toISOString();
      pitch.activity.unshift({
        id: uid("evt"),
        action: "Status updated",
        description: `Status changed to ${status}`,
        actor,
        timestamp: pitch.updatedAt
      });
      
      mockPitches[idx] = pitch;
      setTimeout(() => resolve(pitch), 300);
    });
  },

  async assignReviewer(pitchId: string, reviewerId?: string, actor: string = "System"): Promise<DirectPitch> {
    return new Promise((resolve, reject) => {
      const idx = mockPitches.findIndex(p => p.id === pitchId);
      if (idx === -1) return reject("Not found");
      
      const pitch = { ...mockPitches[idx] };
      pitch.assignedReviewerId = reviewerId;
      pitch.updatedAt = new Date().toISOString();
      
      const revName = MOCK_REVIEWERS.find(r => r.id === reviewerId)?.name || "Unassigned";
      
      pitch.activity.unshift({
        id: uid("evt"),
        action: reviewerId ? "Assigned Reviewer" : "Unassigned Reviewer",
        description: reviewerId ? `Assigned to ${revName}` : "Removed assigned reviewer",
        actor,
        timestamp: pitch.updatedAt
      });
      
      mockPitches[idx] = pitch;
      setTimeout(() => resolve(pitch), 300);
    });
  },

  async updatePriority(pitchId: string, priority: PitchPriority, actor: string = "Reviewer"): Promise<DirectPitch> {
    return new Promise((resolve, reject) => {
      const idx = mockPitches.findIndex(p => p.id === pitchId);
      if (idx === -1) return reject("Not found");
      
      const pitch = { ...mockPitches[idx] };
      pitch.priority = priority;
      pitch.updatedAt = new Date().toISOString();
      
      pitch.activity.unshift({
        id: uid("evt"),
        action: "Priority updated",
        description: `Marked as ${priority} Priority`,
        actor,
        timestamp: pitch.updatedAt
      });
      
      mockPitches[idx] = pitch;
      setTimeout(() => resolve(pitch), 200);
    });
  },

  async requestInformation(pitchId: string, requestText: string, actor: string = "Reviewer"): Promise<DirectPitch> {
    return new Promise((resolve, reject) => {
      const idx = mockPitches.findIndex(p => p.id === pitchId);
      if (idx === -1) return reject("Not found");
      
      const pitch = { ...mockPitches[idx] };
      pitch.status = "More Information Required";
      pitch.updatedAt = new Date().toISOString();
      
      pitch.activity.unshift({
        id: uid("evt"),
        action: "Information requested",
        description: "Requested additional information from the applicant",
        actor,
        timestamp: pitch.updatedAt
      });
      
      mockPitches[idx] = pitch;
      setTimeout(() => resolve(pitch), 300);
    });
  }
};
