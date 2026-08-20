import { Organization, Grant, PipelineStage, DirectPitch, ActivityItem, NotificationItem, SkillForgeRole } from "@/types/funding";

let currentRoleState: SkillForgeRole = "Funding Organization";
let authState: boolean = true;

export const initialOrganization: Organization = {
  id: "org_aegis_01",
  name: "Aegis Frontier Fund",
  shortName: "Aegis",
  type: "Venture Grant & Innovation Catalyst",
  logoInitials: "AF",
  badge: "Verified Funding Partner",
  cycle: "FY 2025–2026 / Q3",
  totalCommittedCapital: 12500000,
  totalDisbursedCapital: 7850000,
  currency: "USD",
  activeGrantCount: 5,
  totalApplications: 184,
  pendingReviewCount: 42,
  directPitchEnabled: true,
  incomingPitchesCount: 23,
  unreadNotificationsCount: 3,
  currentUser: {
    name: "Dr. Rachel Vance",
    role: "Funding Organization",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    initials: "RV",
    email: "rachel.vance@aegisfund.org"
  }
};

let organizationState: Organization = { ...initialOrganization };

export const initialGrants: Grant[] = [
  {
    id: "grant_001",
    title: "DeepTech Student Innovation & Carbon Sequestration Grant 2026",
    code: "GR-2026-CT01",
    category: "Climate & CleanTech",
    stage: "Active",
    statusVariant: "success",
    totalPool: 2500000,
    disbursed: 1400000,
    minAward: 50000,
    maxAward: 250000,
    daysLeft: 14,
    deadline: "Sep 2, 2026",
    applicationCount: 56,
    pendingReview: 18,
    shortlisted: 12,
    awarded: 6,
    organizationName: "Aegis Frontier Fund",
    postedTime: "2 hours ago",
    verified: true,
    description: "Catalyzing hardware, chemical engineering, and software solutions to capture and store atmospheric carbon at gigaton scale.",
    eligibilityBullets: [
      "Open to enrolled University Student Innovators, PhD Researchers & Early Lab Prototypes.",
      "Requires minimum TRL 3 (Proof of Concept) with lab testbench validation.",
      "Non-dilutive funding disbursed across 3 milestone verification checkpoints.",
      "Eligible for co-investment matching from participating venture partners."
    ],
    tags: ["#DeepTech", "#CleanTech", "#CarbonRemoval", "#Hardware", "#StudentInnovators"]
  },
  {
    id: "grant_002",
    title: "AI in Healthcare Diagnostics & Personalized Medicine",
    code: "GR-2026-BIO02",
    category: "HealthTech & BioAI",
    stage: "Active",
    statusVariant: "success",
    totalPool: 3000000,
    disbursed: 2100000,
    minAward: 100000,
    maxAward: 500000,
    daysLeft: 21,
    deadline: "Sep 9, 2026",
    applicationCount: 72,
    pendingReview: 12,
    shortlisted: 16,
    awarded: 9,
    organizationName: "Aegis Frontier Fund",
    postedTime: "Yesterday",
    verified: true,
    description: "Funding breakthrough diagnostic neural networks, automated pathology sequencing, and point-of-care patient analytics.",
    eligibilityBullets: [
      "Must have institutional review board (IRB) or clinical research roadmap.",
      "Prioritizes edge inference architectures with patient privacy-preserving guarantees.",
      "Direct mentorship from senior clinical oncologists and health system directors.",
      "Access to de-identified synthetic biomarker training datasets."
    ],
    tags: ["#HealthcareAI", "#BioDiagnostics", "#NeuralNetworks", "#EdgeAI", "#MedTech"]
  },
  {
    id: "grant_003",
    title: "Autonomous Robotics & Industrial Intelligence",
    code: "GR-2026-ROB03",
    category: "Robotics & Hardware",
    stage: "Active",
    statusVariant: "success",
    totalPool: 4000000,
    disbursed: 2800000,
    minAward: 100000,
    maxAward: 750000,
    daysLeft: 38,
    deadline: "Sep 26, 2026",
    applicationCount: 22,
    pendingReview: 4,
    shortlisted: 7,
    awarded: 4,
    organizationName: "Aegis Frontier Fund",
    postedTime: "3 days ago",
    verified: true,
    description: "Empowering spatial computing, robotic automation for agriculture, automated logistics, and hazardous environment operations.",
    eligibilityBullets: [
      "Hardware testbench prototypes or ROS2 simulated nodes required in submission.",
      "Focus on sensor fusion, LiDAR navigation, and sub-millisecond control loops.",
      "Includes hardware lab credits and fast-track PCB fabrication vouchers.",
      "Quarterly pilot demonstrations in simulated warehouse and field environments."
    ],
    tags: ["#ROS2", "#Robotics", "#EmbeddedC", "#LiDAR", "#AutonomousSystems"]
  },
  {
    id: "grant_004",
    title: "Decentralized Infrastructure & Zero-Knowledge Cryptography",
    code: "GR-2026-ZK04",
    category: "Web3 & Security",
    stage: "In Review",
    statusVariant: "warning",
    totalPool: 1500000,
    disbursed: 1250000,
    minAward: 25000,
    maxAward: 150000,
    daysLeft: 0,
    deadline: "Aug 15, 2026 (Closed)",
    applicationCount: 34,
    pendingReview: 8,
    shortlisted: 9,
    awarded: 5,
    organizationName: "Aegis Frontier Fund",
    postedTime: "1 week ago",
    verified: true,
    description: "Supporting cryptographic proof acceleration, decentralized compute protocols, and verifiable credentials.",
    eligibilityBullets: [
      "Open-source implementation with reproducible ZK-SNARK benchmark circuits.",
      "Independent cryptographic security audit budget allocated per awardee.",
      "Integration with SkillForge verifiable credential and developer ecosystem."
    ],
    tags: ["#ZeroKnowledge", "#Cryptography", "#Rust", "#DistributedSystems"]
  },
  {
    id: "grant_005",
    title: "Sustainable AgriTech & Soil Microbiome Resilience",
    code: "GR-2026-AG05",
    category: "AgriTech & Food",
    stage: "Draft",
    statusVariant: "neutral",
    totalPool: 1500000,
    disbursed: 300000,
    minAward: 50000,
    maxAward: 200000,
    daysLeft: 45,
    deadline: "Opens Oct 1, 2026",
    applicationCount: 0,
    pendingReview: 0,
    shortlisted: 0,
    awarded: 0,
    organizationName: "Aegis Frontier Fund",
    postedTime: "Draft",
    verified: true,
    description: "Targeted research funding for bio-fertilizers, drought-tolerant crop genetics, and precision closed-loop irrigation sensors.",
    eligibilityBullets: [
      "Field trials planned for dryland agricultural zones.",
      "Collaboration with agricultural university extension centers.",
      "Carbon credit verification protocol readiness."
    ],
    tags: ["#AgriTech", "#BioFertilizers", "#PrecisionFarming", "#Sustainability"]
  }
];

let grantsState: Grant[] = [...initialGrants];

export const initialPipelineStages: PipelineStage[] = [
  { id: "submitted", name: "Submitted / New", count: 42, percentage: 22.8, color: "#3B82F6", hint: "Awaiting initial compliance check", avgDaysInStage: 2.1 },
  { id: "screening", name: "Eligibility Screening", count: 58, percentage: 31.5, color: "#6366F1", hint: "Mandatory criteria validation", avgDaysInStage: 4.5 },
  { id: "tech_review", name: "Technical Evaluation", count: 46, percentage: 25.0, color: "#8B5CF6", hint: "Expert committee scoring", avgDaysInStage: 8.2 },
  { id: "due_diligence", name: "Due Diligence & Interview", count: 24, percentage: 13.0, color: "#F59E0B", hint: "Legal and financial review", avgDaysInStage: 12.0 },
  { id: "approved", name: "Awarded / Funded", count: 14, percentage: 7.6, color: "#10B981", hint: "Milestone disbursement active", avgDaysInStage: 3.4 }
];

let pipelineStagesState: PipelineStage[] = [...initialPipelineStages];

export const initialDirectPitches: DirectPitch[] = [
  {
    id: "dp_001",
    innovator: "Dr. Aris Thorne",
    company: "NanoMembrane Systems",
    title: "Graphene-Enhanced Biomimetic Desalination at 40% Lower Energy",
    category: "CleanTech & Water",
    stage: "New Pitch",
    askAmount: "$350,000",
    submittedAt: "Today, 9:15 AM",
    traction: "Lab prototype validated with MIT Water Lab; 2 provisional patents filed",
    readiness: "TRL 5 - Pilot scale testing ready",
    pitchDeckUrl: "#",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    summary: "Our atomic-layer porous graphene membrane filters saline water at standard municipal pressure, drastically cutting desalination capital expense.",
    contactEmail: "aris.thorne@nanomembrane.io",
    tags: ["#Graphene", "#Desalination", "#CleanWater", "#TRL5"],
    bullets: [
      "Operating at 2.1 kWh/m3 energy threshold vs standard 3.8 kWh/m3 RO systems.",
      "Provisional US patent filed on chemical vapor deposition membrane transfer.",
      "Seeking non-dilutive grant to deploy 5,000 L/day field pilot in coastal district."
    ]
  },
  {
    id: "dp_002",
    innovator: "Maya Lin & Tariq Al-Mansoor",
    company: "SynapseML Systems",
    title: "Sub-milliwatt Neuromorphic Chips for Autonomous Aerial Nav",
    category: "AI & Robotics",
    stage: "Under Assessment",
    askAmount: "$500,000",
    submittedAt: "Yesterday, 3:40 PM",
    traction: "$180k non-dilutive grant from DARPA; 3 commercial LOIs signed",
    readiness: "TRL 6 - Field tested in GPS-denied tunnels",
    pitchDeckUrl: "#",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    summary: "Event-based vision processing hardware capable of sub-millisecond obstacle avoidance at zero cloud latency.",
    contactEmail: "founders@synapseml.ai",
    tags: ["#Neuromorphic", "#ROS2", "#EdgeCompute", "#Robotics"],
    bullets: [
      "Silicon test chips fabricated in TSMC 28nm node with verified 0.4mW power draw.",
      "Integrated with ROS2 and PX4 drone flight stacks.",
      "Funding requested for radiation-hardened PCB redesign."
    ]
  },
  {
    id: "dp_003",
    innovator: "Dr. Priya Patel",
    company: "BioPulse Medical",
    title: "Continuous Non-Invasive Optical Biomarker Sensor",
    category: "MedTech & Health",
    stage: "Shortlisted",
    askAmount: "$400,000",
    submittedAt: "3 days ago",
    traction: "Clinical trial Phase 1 ongoing (80 patients, 98.4% correlation)",
    readiness: "TRL 7 - Clinical Demonstration",
    pitchDeckUrl: "#",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    summary: "Multi-wavelength spectral sensor in a wearable ring that measures continuous blood glucose and lactic acid without finger-pricks.",
    contactEmail: "priya@biopulse.health",
    tags: ["#Biomarkers", "#Spectroscopy", "#Wearables", "#ClinicalTrial"],
    bullets: [
      "Multi-spectral photoplethysmography sensor with proprietary ML calibration.",
      "80-patient clinical correlation trial demonstrated 98.4% Clarke Error Grid Zone A.",
      "Seeking funding for FDA 510(k) pre-submission documentation."
    ]
  }
];

let directPitchesState: DirectPitch[] = [...initialDirectPitches];

export const initialActivities: ActivityItem[] = [
  {
    id: "act_001",
    type: "application",
    title: "New Grant Application Received",
    description: "Solara Carbon Solutions submitted for NextGen CleanTech Grant ($250k request)",
    target: "GR-2026-CT01",
    time: "12 mins ago",
    timestamp: "2026-08-19T11:18:00Z",
    actor: { name: "Dr. Marcus Vance", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80", initials: "MV" },
    badgeText: "Application",
    badgeVariant: "info"
  },
  {
    id: "act_002",
    type: "pitch",
    title: "Direct Pitch Received",
    description: "QuantumAI Edge submitted direct pitch with 14-page deck and interactive prototype",
    target: "Direct Pitch Portal",
    time: "48 mins ago",
    timestamp: "2026-08-19T10:42:00Z",
    actor: { name: "Elena Rostova", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80", initials: "ER" },
    badgeText: "Direct Pitch",
    badgeVariant: "purple"
  },
  {
    id: "act_003",
    type: "review",
    title: "Shortlist Recommendation Scored",
    description: "Lead Reviewer scored NeuroSense Bio at 94/100 and moved to Technical Committee",
    target: "GR-2026-BIO02",
    time: "2 hours ago",
    timestamp: "2026-08-19T09:30:00Z",
    actor: { name: "Dr. Chen Wei", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80", initials: "CW" },
    badgeText: "Review Scored",
    badgeVariant: "warning"
  },
  {
    id: "act_004",
    type: "disbursement",
    title: "Milestone Tranche Released",
    description: "$125,000 disbursed to Terrasync Precision Farming after verification",
    target: "GR-2026-AG05",
    time: "4 hours ago",
    timestamp: "2026-08-19T07:15:00Z",
    actor: { name: "Finance Desk", avatar: null, initials: "FD" },
    badgeText: "Disbursement",
    badgeVariant: "success"
  },
  {
    id: "act_005",
    type: "system",
    title: "Grant Application Form Updated",
    description: "Added ESG Environmental Impact section to AI in Healthcare grant form",
    target: "Form Builder",
    time: "Yesterday, 4:20 PM",
    timestamp: "2026-08-18T16:20:00Z",
    actor: { name: "Admin Rachel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80", initials: "RV" },
    badgeText: "Configuration",
    badgeVariant: "neutral"
  }
];

let activitiesState: ActivityItem[] = [...initialActivities];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Grant Deadline Approaching (14 days)",
    message: "NextGen CleanTech Grant closes in 14 days. 18 pending applications need committee review.",
    time: "25m ago",
    unread: true,
    type: "warning"
  },
  {
    id: "notif_2",
    title: "Direct Pitch Influx",
    message: "6 new direct pitches received in the AI & Robotics category this week.",
    time: "2h ago",
    unread: true,
    type: "info"
  },
  {
    id: "notif_3",
    title: "Disbursement Milestone Approved",
    message: "Finance team confirmed $125,000 disbursement for Terrasync Farming.",
    time: "4h ago",
    unread: true,
    type: "success"
  },
  {
    id: "notif_4",
    title: "Quarterly Allocation Report Ready",
    message: "Q2 2026 Grant Performance & Capital Deployment report is ready for export.",
    time: "1d ago",
    unread: false,
    type: "neutral"
  }
];

let notificationsState: NotificationItem[] = [...initialNotifications];

export const api = {

  // Auth & Roles for Dev Controls Header
  async getDevState(): Promise<{ role: SkillForgeRole; authenticated: boolean }> {
    return { role: currentRoleState, authenticated: authState };
  },

  async setDevRole(role: SkillForgeRole): Promise<SkillForgeRole> {
    currentRoleState = role;
    return currentRoleState;
  },

  async toggleAuth(authenticated: boolean): Promise<boolean> {
    authState = authenticated;
    return authState;
  },

  // Organization
  async getOrganization(): Promise<Organization> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...organizationState }), 80);
    });
  },

  async updateOrganization(updates: Partial<Organization>): Promise<Organization> {
    return new Promise((resolve) => {
      organizationState = { ...organizationState, ...updates };
      setTimeout(() => resolve({ ...organizationState }), 120);
    });
  },

  // Direct Pitch Toggle
  async toggleDirectPitch(enabled: boolean): Promise<boolean> {
    return new Promise((resolve) => {
      organizationState.directPitchEnabled = enabled;
      const activity: ActivityItem = {
        id: `act_${Date.now()}`,
        type: "system",
        title: enabled ? "Direct Pitch Portal Enabled" : "Direct Pitch Portal Paused",
        description: enabled
          ? "Innovators can now submit unsolicited direct pitches to your organization."
          : "Direct pitch intake has been temporarily paused.",
        target: "Direct Pitch Settings",
        time: "Just now",
        timestamp: new Date().toISOString(),
        actor: {
          name: organizationState.currentUser.name,
          avatar: organizationState.currentUser.avatar,
          initials: organizationState.currentUser.initials,
        },
        badgeText: enabled ? "Portal Active" : "Portal Paused",
        badgeVariant: enabled ? "success" : "neutral",
      };
      activitiesState = [activity, ...activitiesState];
      setTimeout(() => resolve(enabled), 100);
    });
  },

  // Grants
  async getGrants(filter?: string): Promise<Grant[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!filter || filter === "All") {
          resolve([...grantsState]);
        } else {
          resolve(grantsState.filter((g) => g.stage.toLowerCase() === filter.toLowerCase()));
        }
      }, 80);
    });
  },

  async createGrant(grantData: Partial<Grant>): Promise<Grant> {
    return new Promise((resolve) => {
      const newGrant: Grant = {
        id: `grant_${Date.now()}`,
        title: grantData.title || "New Grant Program",
        code: `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        category: grantData.category || "General Innovation",
        stage: "Draft",
        statusVariant: "neutral",
        totalPool: grantData.totalPool || 1000000,
        disbursed: 0,
        minAward: grantData.minAward || 25000,
        maxAward: grantData.maxAward || 250000,
        daysLeft: 60,
        deadline: grantData.deadline || "Nov 30, 2026",
        applicationCount: 0,
        pendingReview: 0,
        shortlisted: 0,
        awarded: 0,
        organizationName: organizationState.name,
        postedTime: "Just now",
        verified: true,
        description: grantData.description || "Program description and eligibility criteria defined in setup.",
        eligibilityBullets: [
          "Eligibility criteria and submission requirements defined in Phase 2.",
          "Customizable application form fields configured in Phase 3 Form Builder.",
          "Milestone disbursement rules configured upon activation."
        ],
        tags: ["#NewGrant", "#Draft", `#${grantData.category?.replace(/\s+/g, '') || 'Innovation'}`]
      };
      grantsState = [newGrant, ...grantsState];
      organizationState.activeGrantCount += 1;

      const activity: ActivityItem = {
        id: `act_${Date.now()}`,
        type: "system",
        title: "New Grant Program Initialized (Draft)",
        description: `${newGrant.title} was initialized by ${organizationState.currentUser.name}`,
        target: newGrant.code,
        time: "Just now",
        timestamp: new Date().toISOString(),
        actor: {
          name: organizationState.currentUser.name,
          avatar: organizationState.currentUser.avatar,
          initials: organizationState.currentUser.initials,
        },
        badgeText: "Grant Setup",
        badgeVariant: "info",
      };
      activitiesState = [activity, ...activitiesState];

      setTimeout(() => resolve(newGrant), 150);
    });
  },

  // Pipeline Stages
  async getPipelineStages(): Promise<PipelineStage[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...pipelineStagesState]), 80);
    });
  },

  // Direct Pitches
  async getDirectPitches(): Promise<DirectPitch[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...directPitchesState]), 80);
    });
  },

  // Activities
  async getActivities(type?: string): Promise<ActivityItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!type || type === "all") {
          resolve([...activitiesState]);
        } else {
          resolve(activitiesState.filter((a) => a.type === type));
        }
      }, 80);
    });
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...notificationsState]), 80);
    });
  },

  async markAllNotificationsRead(): Promise<void> {
    return new Promise((resolve) => {
      notificationsState = notificationsState.map((n) => ({ ...n, unread: false }));
      organizationState.unreadNotificationsCount = 0;
      setTimeout(() => resolve(), 80);
    });
  }
};
