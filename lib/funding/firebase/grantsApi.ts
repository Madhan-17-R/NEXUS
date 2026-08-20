import { FullGrant, GrantStatus, GrantActivity, ApplicationFormConfig, EligibilityCriteria } from "@/types/funding";

const makeActivity = (action: string, desc: string, actor: string, hoursAgo: number): GrantActivity => ({
  id: `act_${Math.random().toString(36).substring(2, 8)}`,
  action,
  description: desc,
  actor,
  timestamp: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
  time: hoursAgo < 1 ? "Just now" : hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
});

export const fullGrantsData: FullGrant[] = [
  {
    id: "grant_001",
    code: "GR-2026-CT01",
    title: "NextGen CleanTech & Carbon Sequestration 2026",
    shortDescription: "Funding hardware, software, and chemical solutions for carbon capture at gigaton scale.",
    description: "This grant targets breakthrough innovations in atmospheric carbon removal, direct air capture hardware, mineralization pipelines, and policy-compatible monitoring infrastructure. Funded projects receive milestone-linked non-dilutive capital with laboratory vouchers and expert mentorship.",
    domain: "Climate & CleanTech",
    focusAreas: ["Carbon Capture", "DAC Hardware", "Renewable Energy", "Circular Economy"],
    programType: "Innovation Grant",
    fundingType: "Grant",
    status: "active",
    currency: "USD",
    totalPool: 2500000,
    disbursed: 1400000,
    minAward: 50000,
    maxAward: 250000,
    numberOfAwards: 12,
    daysLeft: 14,
    postedTime: "2 hours ago",
    organizationName: "Aegis Frontier Fund",
    organizationId: "org_aegis_01",
    verified: true,
    applicationCount: 56,
    pendingReview: 18,
    shortlisted: 12,
    awarded: 6,
    tags: ["#DeepTech", "#CleanTech", "#CarbonRemoval", "#Hardware", "#StudentInnovators"],
    eligibilityBullets: [
      "Open to enrolled University Student Innovators, PhD Researchers & Early Lab Prototypes.",
      "Requires minimum TRL 3 (Proof of Concept) with lab testbench validation.",
      "Non-dilutive funding disbursed across 3 milestone verification checkpoints.",
      "Eligible for co-investment matching from participating venture partners."
    ],
    timeline: {
      openingDate: "Aug 1, 2026",
      deadline: "Sep 2, 2026",
      reviewPeriodEnd: "Sep 30, 2026",
      decisionDate: "Oct 15, 2026",
      fundingStartDate: "Nov 1, 2026",
    },
    eligibility: {
      applicantTypes: ["Student", "Researcher", "Innovator"],
      educationLevels: ["Undergraduate", "Postgraduate", "PhD"],
      experienceLevel: "0–2 years",
      domains: ["Climate & CleanTech", "AI & Machine Learning"],
      skills: ["Chemical Engineering", "Embedded Systems", "Python", "Carbon Accounting"],
      geography: "Global",
      selectedCountries: [],
      additionalRequirements: "Applicants must demonstrate a working prototype or validated laboratory proof-of-concept.",
    },
    applicationForm: {
      status: "configured",
      totalFields: 12,
      totalSections: 4,
      requiredFields: 8,
      optionalFields: 4,
      sections: ["Applicant Information", "Project Overview", "Funding Requirements", "Supporting Documents"],
      formId: "form_ct01",
      lastUpdated: "Aug 18, 2026",
    },
    activity: [
      makeActivity("Grant Published", "Grant round was published and made live to applicants.", "Dr. Rachel Vance", 72),
      makeActivity("Eligibility Updated", "Added PhD researcher eligibility tier.", "Dr. Rachel Vance", 96),
      makeActivity("Application Form Configured", "12-field customizable application form set up and linked.", "Admin Rachel", 120),
      makeActivity("Grant Created", "Grant round initialized as draft.", "Dr. Rachel Vance", 168),
    ],
    createdAt: "2026-07-15T10:00:00Z",
    updatedAt: "2026-08-18T15:30:00Z",
  },
  {
    id: "grant_002",
    code: "GR-2026-BIO02",
    title: "AI in Healthcare Diagnostics & Personalized Medicine",
    shortDescription: "Supporting AI-powered diagnostics, pathology automation, and patient-centric clinical workflows.",
    description: "Breakthrough diagnostic neural networks, automated biomarker analysis, and personalized therapy recommendation engines that advance equitable, accessible healthcare globally.",
    domain: "HealthTech & BioAI",
    focusAreas: ["Diagnostic AI", "Biomarker Analysis", "Clinical NLP", "Edge Inference"],
    programType: "Research Grant",
    fundingType: "Grant",
    status: "active",
    currency: "USD",
    totalPool: 3000000,
    disbursed: 2100000,
    minAward: 100000,
    maxAward: 500000,
    numberOfAwards: 8,
    daysLeft: 21,
    postedTime: "Yesterday",
    organizationName: "Aegis Frontier Fund",
    organizationId: "org_aegis_01",
    verified: true,
    applicationCount: 72,
    pendingReview: 12,
    shortlisted: 16,
    awarded: 9,
    tags: ["#HealthcareAI", "#BioDiagnostics", "#NeuralNetworks", "#EdgeAI", "#MedTech"],
    eligibilityBullets: [
      "Must have institutional review board (IRB) or clinical research roadmap.",
      "Prioritizes edge inference architectures with patient privacy guarantees.",
      "Direct mentorship from senior clinical oncologists and health system directors.",
    ],
    timeline: {
      openingDate: "Jul 15, 2026",
      deadline: "Sep 9, 2026",
      reviewPeriodEnd: "Oct 5, 2026",
      decisionDate: "Oct 20, 2026",
      fundingStartDate: "Nov 10, 2026",
    },
    eligibility: {
      applicantTypes: ["Researcher", "Startup", "Team"],
      educationLevels: ["Postgraduate", "PhD"],
      experienceLevel: "2–5 years",
      domains: ["Healthcare", "AI & Machine Learning"],
      skills: ["Machine Learning", "Python", "Clinical Research", "TensorFlow"],
      geography: "Global",
      selectedCountries: [],
      additionalRequirements: "Applicants must submit an IRB or equivalent ethics clearance letter.",
    },
    applicationForm: {
      status: "configured",
      totalFields: 15,
      totalSections: 5,
      requiredFields: 11,
      optionalFields: 4,
      sections: ["Researcher Profile", "Project Overview", "Clinical Research Plan", "Budget Breakdown", "Supporting Documents"],
      formId: "form_bio02",
      lastUpdated: "Aug 17, 2026",
    },
    activity: [
      makeActivity("Grant Published", "Grant round published and live.", "Dr. Rachel Vance", 48),
      makeActivity("Application Form Updated", "Added clinical ethics declaration section.", "Admin Rachel", 60),
      makeActivity("Grant Created", "Grant round initialized.", "Dr. Rachel Vance", 144),
    ],
    createdAt: "2026-07-01T09:00:00Z",
    updatedAt: "2026-08-17T11:00:00Z",
  },
  {
    id: "grant_003",
    code: "GR-2026-ROB03",
    title: "Autonomous Robotics & Industrial Intelligence",
    shortDescription: "Empowering spatial computing, robotic automation for agriculture and logistics.",
    description: "Funding robotics innovations in autonomous navigation, ROS2-based industrial systems, and sensor-fusion hardware applicable to agriculture, warehousing, and hazardous environments.",
    domain: "Robotics & Hardware",
    focusAreas: ["Autonomous Navigation", "ROS2", "Sensor Fusion", "Industrial Automation"],
    programType: "Innovation Grant",
    fundingType: "Grant",
    status: "active",
    currency: "USD",
    totalPool: 4000000,
    disbursed: 2800000,
    minAward: 100000,
    maxAward: 750000,
    numberOfAwards: 6,
    daysLeft: 38,
    postedTime: "3 days ago",
    organizationName: "Aegis Frontier Fund",
    organizationId: "org_aegis_01",
    verified: true,
    applicationCount: 22,
    pendingReview: 4,
    shortlisted: 7,
    awarded: 4,
    tags: ["#ROS2", "#Robotics", "#EmbeddedC", "#LiDAR", "#AutonomousSystems"],
    eligibilityBullets: [
      "Hardware testbench prototypes or ROS2 simulated nodes required in submission.",
      "Focus on sensor fusion, LiDAR navigation, and sub-millisecond control loops.",
      "Includes hardware lab credits and fast-track PCB fabrication vouchers.",
    ],
    timeline: {
      openingDate: "Aug 10, 2026",
      deadline: "Sep 26, 2026",
      reviewPeriodEnd: "Oct 20, 2026",
      decisionDate: "Nov 1, 2026",
      fundingStartDate: "Nov 20, 2026",
    },
    eligibility: {
      applicantTypes: ["Innovator", "Startup", "Team"],
      educationLevels: ["Undergraduate", "Postgraduate", "PhD", "Any Education Level"],
      experienceLevel: "0–2 years",
      domains: ["Robotics", "AI & Machine Learning"],
      skills: ["ROS2", "C++", "Embedded C", "LiDAR", "PCB Layout"],
      geography: "Global",
      selectedCountries: [],
      additionalRequirements: "Applicants must submit a hardware testbench video demo or ROS2 simulation recording.",
    },
    applicationForm: {
      status: "draft",
      totalFields: 8,
      totalSections: 3,
      requiredFields: 6,
      optionalFields: 2,
      sections: ["Applicant Profile", "Technical Specification", "Funding Plan"],
      formId: "form_rob03",
      lastUpdated: "Aug 16, 2026",
    },
    activity: [
      makeActivity("Application Form Draft Saved", "Form builder draft saved with 8 fields.", "Admin Rachel", 24),
      makeActivity("Grant Published", "Grant round published and open for applications.", "Dr. Rachel Vance", 72),
      makeActivity("Grant Created", "Grant round initialized.", "Dr. Rachel Vance", 200),
    ],
    createdAt: "2026-07-20T12:00:00Z",
    updatedAt: "2026-08-16T14:00:00Z",
  },
  {
    id: "grant_004",
    code: "GR-2026-ZK04",
    title: "Decentralized Infrastructure & Zero-Knowledge Systems",
    shortDescription: "Accelerating ZK-proof cryptographic infrastructure and verifiable decentralized systems.",
    description: "Supporting cryptographic proof acceleration, decentralized compute protocols, verifiable credentials, and privacy-preserving identity tooling.",
    domain: "Web3 & Security",
    focusAreas: ["ZK-SNARKs", "Decentralized Compute", "Verifiable Credentials", "Cryptographic Proofs"],
    programType: "Research Grant",
    fundingType: "Grant",
    status: "in_review",
    currency: "USD",
    totalPool: 1500000,
    disbursed: 1250000,
    minAward: 25000,
    maxAward: 150000,
    numberOfAwards: 10,
    daysLeft: 0,
    postedTime: "1 week ago",
    organizationName: "Aegis Frontier Fund",
    organizationId: "org_aegis_01",
    verified: true,
    applicationCount: 34,
    pendingReview: 8,
    shortlisted: 9,
    awarded: 5,
    tags: ["#ZeroKnowledge", "#Cryptography", "#Rust", "#DistributedSystems"],
    eligibilityBullets: [
      "Open-source implementation with reproducible ZK-SNARK benchmark circuits.",
      "Independent cryptographic security audit budget allocated per awardee.",
    ],
    timeline: {
      openingDate: "Jun 15, 2026",
      deadline: "Aug 15, 2026",
      reviewPeriodEnd: "Sep 1, 2026",
      decisionDate: "Sep 15, 2026",
      fundingStartDate: "Oct 1, 2026",
    },
    eligibility: {
      applicantTypes: ["Researcher", "Innovator", "Startup"],
      educationLevels: ["Postgraduate", "PhD"],
      experienceLevel: "2–5 years",
      domains: ["Web3 & Security", "AI & Machine Learning"],
      skills: ["Rust", "ZK-SNARKs", "Cryptography", "Distributed Systems"],
      geography: "Global",
      selectedCountries: [],
      additionalRequirements: "All submissions must include a reproducible open-source circuit implementation.",
    },
    applicationForm: {
      status: "configured",
      totalFields: 10,
      totalSections: 3,
      requiredFields: 8,
      optionalFields: 2,
      sections: ["Researcher Profile", "Technical Implementation", "Security Audit Plan"],
      formId: "form_zk04",
      lastUpdated: "Jun 20, 2026",
    },
    activity: [
      makeActivity("Review Phase Started", "Grant intake closed, review committee convened.", "Dr. Rachel Vance", 24 * 4),
      makeActivity("Grant Deadline Passed", "Application window closed with 34 submissions.", "System", 24 * 5),
      makeActivity("Grant Published", "Grant round published and live.", "Dr. Rachel Vance", 24 * 60),
    ],
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-08-15T18:00:00Z",
  },
  {
    id: "grant_005",
    code: "GR-2026-AG05",
    title: "Sustainable AgriTech & Soil Microbiome Resilience",
    shortDescription: "Funding bio-fertilizers, drought-tolerant genetics, and precision irrigation sensor systems.",
    description: "Targeted research funding for innovations addressing food security, sustainable agriculture practices, and precision farming tools. Projects must target dryland or arid agricultural zones.",
    domain: "AgriTech & Food",
    focusAreas: ["Bio-Fertilizers", "Precision Irrigation", "Soil Microbiome", "Drone Crop Sensing"],
    programType: "Research Grant",
    fundingType: "Grant",
    status: "draft",
    currency: "USD",
    totalPool: 1500000,
    disbursed: 0,
    minAward: 50000,
    maxAward: 200000,
    numberOfAwards: 8,
    daysLeft: 45,
    postedTime: "Draft",
    organizationName: "Aegis Frontier Fund",
    organizationId: "org_aegis_01",
    verified: true,
    applicationCount: 0,
    pendingReview: 0,
    shortlisted: 0,
    awarded: 0,
    tags: ["#AgriTech", "#BioFertilizers", "#PrecisionFarming", "#Sustainability"],
    eligibilityBullets: [
      "Field trials planned for dryland agricultural zones.",
      "Collaboration with agricultural university extension centers.",
    ],
    timeline: {
      openingDate: "Oct 1, 2026",
      deadline: "Nov 30, 2026",
      reviewPeriodEnd: "Dec 20, 2026",
      decisionDate: "Jan 10, 2027",
      fundingStartDate: "Feb 1, 2027",
    },
    eligibility: {
      applicantTypes: ["Researcher", "Startup", "Individual"],
      educationLevels: ["Undergraduate", "Postgraduate", "PhD"],
      experienceLevel: "Any experience",
      domains: ["Agriculture", "AI & Machine Learning"],
      skills: ["IoT Sensors", "Python", "Soil Science", "Data Analysis"],
      geography: "Global",
      selectedCountries: [],
      additionalRequirements: "Must have at least one agricultural scientist or agronomist on the team.",
    },
    applicationForm: {
      status: "not_configured",
      totalFields: 0,
      totalSections: 0,
      requiredFields: 0,
      optionalFields: 0,
      sections: [],
    },
    activity: [
      makeActivity("Grant Created", "Grant round initialized as draft.", "Dr. Rachel Vance", 24 * 2),
      makeActivity("Funding Configured", "Total pool and award range set.", "Dr. Rachel Vance", 24 * 2),
    ],
    createdAt: "2026-08-17T10:00:00Z",
    updatedAt: "2026-08-17T12:00:00Z",
  },
];

// Grant management service methods
let grantsState: FullGrant[] = [...fullGrantsData];

export const grantsApi = {
  async getAll(filter?: string, search?: string, sort?: string): Promise<FullGrant[]> {
    return new Promise((resolve) => {
      let result = [...grantsState];
      // Filter by status tab
      if (filter && filter !== "all") {
        if (filter === "closing_soon") {
          result = result.filter(g => g.daysLeft > 0 && g.daysLeft <= 14);
        } else {
          result = result.filter(g => g.status === filter);
        }
      }
      // Search
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          g =>
            g.title.toLowerCase().includes(q) ||
            g.domain.toLowerCase().includes(q) ||
            g.programType.toLowerCase().includes(q) ||
            g.tags.some(t => t.toLowerCase().includes(q))
        );
      }
      // Sort
      if (sort === "oldest") {
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      } else if (sort === "deadline_soonest") {
        result.sort((a, b) => a.daysLeft - b.daysLeft);
      } else if (sort === "most_applications") {
        result.sort((a, b) => b.applicationCount - a.applicationCount);
      } else if (sort === "highest_pool") {
        result.sort((a, b) => b.totalPool - a.totalPool);
      } else {
        // Default: newest
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      setTimeout(() => resolve(result), 60);
    });
  },

  async getById(id: string): Promise<FullGrant | null> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(grantsState.find(g => g.id === id) ?? null), 60);
    });
  },

  async create(grantData: Partial<FullGrant>): Promise<FullGrant> {
    return new Promise((resolve) => {
      const newGrant: FullGrant = {
        id: `grant_${Date.now()}`,
        code: `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: grantData.title || "New Grant Program",
        shortDescription: grantData.shortDescription || "",
        description: grantData.description || "",
        domain: grantData.domain || "AI & Machine Learning",
        focusAreas: grantData.focusAreas || [],
        programType: grantData.programType || "Innovation Grant",
        fundingType: grantData.fundingType || "Grant",
        status: "draft",
        currency: grantData.currency || "USD",
        totalPool: grantData.totalPool || 1000000,
        disbursed: 0,
        minAward: grantData.minAward || 25000,
        maxAward: grantData.maxAward || 250000,
        numberOfAwards: grantData.numberOfAwards || 4,
        daysLeft: 60,
        postedTime: "Just now",
        organizationName: "Aegis Frontier Fund",
        organizationId: "org_aegis_01",
        verified: true,
        applicationCount: 0,
        pendingReview: 0,
        shortlisted: 0,
        awarded: 0,
        tags: [],
        eligibilityBullets: [],
        timeline: grantData.timeline || {
          openingDate: "",
          deadline: "",
          reviewPeriodEnd: "",
          decisionDate: "",
          fundingStartDate: "",
        },
        eligibility: grantData.eligibility || {
          applicantTypes: [],
          educationLevels: [],
          experienceLevel: "Any experience",
          domains: [],
          skills: [],
          geography: "Global",
          selectedCountries: [],
          additionalRequirements: "",
        },
        applicationForm: {
          status: "not_configured",
          totalFields: 0,
          totalSections: 0,
          requiredFields: 0,
          optionalFields: 0,
          sections: [],
        },
        activity: [
          makeActivity("Grant Created", "Grant round initialized as draft.", "Dr. Rachel Vance", 0),
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      grantsState = [newGrant, ...grantsState];
      setTimeout(() => resolve(newGrant), 150);
    });
  },

  async update(id: string, updates: Partial<FullGrant>): Promise<FullGrant | null> {
    return new Promise((resolve) => {
      const idx = grantsState.findIndex(g => g.id === id);
      if (idx === -1) { resolve(null); return; }
      grantsState[idx] = {
        ...grantsState[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setTimeout(() => resolve({ ...grantsState[idx] }), 100);
    });
  },

  async publish(id: string): Promise<FullGrant | null> {
    return new Promise((resolve) => {
      const idx = grantsState.findIndex(g => g.id === id);
      if (idx === -1) { resolve(null); return; }
      grantsState[idx] = {
        ...grantsState[idx],
        status: "active",
        postedTime: "Just now",
        updatedAt: new Date().toISOString(),
        activity: [
          makeActivity("Grant Published", "Grant round published and now live for applications.", "Dr. Rachel Vance", 0),
          ...grantsState[idx].activity,
        ],
      };
      setTimeout(() => resolve({ ...grantsState[idx] }), 120);
    });
  },

  async close(id: string): Promise<FullGrant | null> {
    return new Promise((resolve) => {
      const idx = grantsState.findIndex(g => g.id === id);
      if (idx === -1) { resolve(null); return; }
      grantsState[idx] = {
        ...grantsState[idx],
        status: "closed",
        daysLeft: 0,
        updatedAt: new Date().toISOString(),
        activity: [
          makeActivity("Grant Closed", "Grant round was manually closed by the administrator.", "Dr. Rachel Vance", 0),
          ...grantsState[idx].activity,
        ],
      };
      setTimeout(() => resolve({ ...grantsState[idx] }), 120);
    });
  },

  async duplicate(id: string): Promise<FullGrant | null> {
    return new Promise((resolve) => {
      const original = grantsState.find(g => g.id === id);
      if (!original) { resolve(null); return; }
      const copy: FullGrant = {
        ...original,
        id: `grant_${Date.now()}`,
        code: `GR-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${original.title} — Copy`,
        status: "draft",
        disbursed: 0,
        applicationCount: 0,
        pendingReview: 0,
        shortlisted: 0,
        awarded: 0,
        postedTime: "Just now",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationForm: { ...original.applicationForm, status: "not_configured", formId: undefined },
        activity: [
          makeActivity("Grant Duplicated", `Duplicated from "${original.title}".`, "Dr. Rachel Vance", 0),
        ],
      };
      grantsState = [copy, ...grantsState];
      setTimeout(() => resolve(copy), 150);
    });
  },

  async saveDraft(id: string, updates: Partial<FullGrant>): Promise<FullGrant | null> {
    return grantsApi.update(id, { ...updates, status: "draft" });
  },

  async updateEligibility(id: string, eligibility: EligibilityCriteria): Promise<FullGrant | null> {
    return new Promise(async (resolve) => {
      const updated = await grantsApi.update(id, {
        eligibility,
        activity: [
          makeActivity("Eligibility Criteria Updated", "Eligibility rules updated by administrator.", "Dr. Rachel Vance", 0),
          ...(grantsState.find(g => g.id === id)?.activity ?? []),
        ],
      });
      resolve(updated);
    });
  },

  async updateFormConfig(id: string, formConfig: ApplicationFormConfig): Promise<FullGrant | null> {
    return grantsApi.update(id, { applicationForm: formConfig });
  },
};
