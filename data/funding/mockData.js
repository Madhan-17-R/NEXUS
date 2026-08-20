export const mockOrganization = {
  id: "org_aegis_01",
  name: "Aegis Frontier Fund",
  shortName: "Aegis",
  type: "Venture Grant & Innovation Catalyst",
  logoInitials: "AF",
  badge: "Verified Global Partner",
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
    role: "Director of Grant Allocations",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    initials: "RV"
  }
};

export const mockGrants = [
  {
    id: "grant_001",
    title: "NextGen CleanTech & Carbon Sequestration 2026",
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
    description: "Catalyzing hardware, chemical engineering, and software solutions to remove atmospheric carbon at scale."
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
    description: "Funding breakthrough diagnostic neural networks and automated biomarker sequencing systems."
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
    description: "Empowering spatial computing, robotic automation for agriculture, and warehouse logistics."
  },
  {
    id: "grant_004",
    title: "Decentralized Infrastructure & Zero-Knowledge Systems",
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
    description: "Supporting cryptographic proofs, decentralized compute protocols, and verifiable credentials."
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
    description: "Targeted research funding for bio-fertilizers and drought-resistant precision irrigation sensors."
  }
];

export const mockPipelineStages = [
  { id: "submitted", name: "Submitted / New", count: 42, percentage: 22.8, color: "#3B82F6", hint: "Awaiting initial assessment" },
  { id: "screening", name: "Eligibility Screening", count: 58, percentage: 31.5, color: "#6366F1", hint: "Criteria validation" },
  { id: "tech_review", name: "Technical Evaluation", count: 46, percentage: 25.0, color: "#8B5CF6", hint: "Expert committee scoring" },
  { id: "due_diligence", name: "Due Diligence & Interview", count: 24, percentage: 13.0, color: "#F59E0B", hint: "Legal and financial review" },
  { id: "approved", name: "Awarded / Funded", count: 14, percentage: 7.6, color: "#10B981", hint: "Milestone disbursement active" }
];

export const mockRecentActivities = [
  {
    id: "act_001",
    type: "application",
    title: "New Grant Application Received",
    description: "Solara Carbon Solutions submitted for NextGen CleanTech Grant",
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
    description: "QuantumAI Edge submitted direct pitch with 12-page deck and demo video",
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
    title: "Shortlist Recommendation Added",
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

export const mockDirectPitches = [
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
    readiness: "TRL 5 - Ready for pilot scale-up",
    pitchDeckUrl: "#",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80"
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
    readiness: "TRL 6 - Field tested in GPS-denied environments",
    pitchDeckUrl: "#",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
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
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
  }
];

export const mockNotifications = [
  {
    id: "notif_1",
    title: "Deadline Approaching (14 days)",
    message: "NextGen CleanTech Grant closes in 14 days. 18 pending applications need review.",
    time: "25m ago",
    unread: true,
    type: "warning"
  },
  {
    id: "notif_2",
    title: "Direct Pitch Surge",
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
