export interface ApplicationFields {
  dob: boolean;
  currentRole: boolean;
  totalExperience: boolean;
  relevantExperience: boolean;
  highestQualification: boolean;
  graduationYear: boolean;
  university: boolean;
  whyInterested: boolean;
  whyConsider: boolean;
  projectExperience: boolean;
  resume: boolean;
  portfolio: boolean;
  certificates: boolean;
  expectedCompensation: boolean;
  noticePeriod: boolean;
  coverLetter: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  type: string;
  target: string;
  project: string;
  skills: string[];
  salary: string;
  workMode: string;
  location: string;
  openings: number;
  deadline: string;
  status: string;
  published: string;
  description?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experience?: string;
  company?: string;
  applicationFields?: ApplicationFields;
}

const DEFAULT_APP_FIELDS: ApplicationFields = {
  dob: true, currentRole: true, totalExperience: true, relevantExperience: true,
  highestQualification: true, graduationYear: true, university: true,
  whyInterested: true, whyConsider: true, projectExperience: true,
  resume: true, portfolio: true, certificates: true,
  expectedCompensation: true, noticePeriod: true, coverLetter: true
};

const DEFAULT_OPPORTUNITIES: Opportunity[] = [
  {
    id: "OPP-001",
    title: "Frontend Developer",
    type: "Full-time",
    target: "Skilled Worker",
    project: "Control Interface v2.0",
    skills: ["React", "Next.js", "TypeScript"],
    salary: "$110k - $140k / yr",
    workMode: "Hybrid",
    location: "San Francisco, CA",
    openings: 2,
    deadline: "2026-09-30",
    status: "Active",
    published: "2026-08-10",
    description: "We are looking for a highly skilled Frontend Developer to join our team...",
    responsibilities: ["Develop UI", "Collaborate with team"],
    requiredSkills: ["React", "Next.js", "TypeScript"],
    preferredSkills: ["Three.js", "GraphQL"],
    experience: "2-5 Years",
    company: "Apex Robotics",
    applicationFields: DEFAULT_APP_FIELDS
  },
  {
    id: "OPP-002",
    title: "AI/ML Intern",
    type: "Internship",
    target: "Student",
    project: "Autonomous Navigation Model",
    skills: ["Python", "TensorFlow", "Computer Vision"],
    salary: "$3,000 / month (Paid)",
    workMode: "Remote",
    location: "Anywhere",
    openings: 5,
    deadline: "2026-08-25",
    status: "Closing Soon",
    published: "2026-08-01",
    company: "Apex Robotics",
    applicationFields: DEFAULT_APP_FIELDS
  },
  {
    id: "OPP-003",
    title: "UI/UX Freelance Designer",
    type: "Freelance",
    target: "Both",
    project: "Mobile App Redesign",
    skills: ["Figma", "Prototyping", "User Research"],
    salary: "$5,000 Budget (Fixed)",
    workMode: "Remote",
    location: "Anywhere",
    openings: 1,
    deadline: "2026-08-20",
    status: "Draft",
    published: "-",
    company: "Apex Robotics",
    applicationFields: DEFAULT_APP_FIELDS
  }
];

class OpportunityService {
  private getStorageKey() {
    return 'skillforge_mock_opportunities';
  }

  async getOpportunities(): Promise<Opportunity[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (typeof window === 'undefined') return DEFAULT_OPPORTUNITIES;
    
    const stored = localStorage.getItem(this.getStorageKey());
    if (!stored) {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(DEFAULT_OPPORTUNITIES));
      return DEFAULT_OPPORTUNITIES;
    }
    
    try {
      return JSON.parse(stored);
    } catch {
      return DEFAULT_OPPORTUNITIES;
    }
  }

  async getOpportunity(id: string): Promise<Opportunity | null> {
    const opps = await this.getOpportunities();
    return opps.find(o => o.id === id) || null;
  }

  async createOpportunity(data: Omit<Opportunity, 'id' | 'status' | 'published' | 'company'>): Promise<Opportunity> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const opps = await this.getOpportunities();
    const newOpp: Opportunity = {
      ...data,
      id: `OPP-00${opps.length + 1}`,
      status: 'Active',
      published: new Date().toISOString().split('T')[0],
      company: 'Apex Robotics'
    };
    
    opps.unshift(newOpp);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(opps));
    }
    
    return newOpp;
  }
  async deleteOpportunity(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const opps = await this.getOpportunities();
    const updated = opps.filter(o => o.id !== id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(updated));
    }
  }

  async updateOpportunity(id: string, data: Partial<Opportunity>): Promise<Opportunity | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const opps = await this.getOpportunities();
    const index = opps.findIndex(o => o.id === id);
    if (index === -1) return null;
    
    opps[index] = { ...opps[index], ...data };
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.getStorageKey(), JSON.stringify(opps));
    }
    return opps[index];
  }

  async duplicateOpportunity(id: string): Promise<Opportunity | null> {
    const opp = await this.getOpportunity(id);
    if (!opp) return null;
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, status, published, company, ...rest } = opp;
    return this.createOpportunity({
      ...rest,
      title: `Copy of ${opp.title}`
    });
  }
}

export const opportunityService = new OpportunityService();
