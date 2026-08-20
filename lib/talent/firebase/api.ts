/**
 * Mock Firestore API layer for Job Seeker Workflow.
 */

import {
  JobPost,
  Application,
  ApplicationStatus,
  FeedFilters,
  Conversation,
  DirectMessage,
  AppNotification,
} from '@/types/talent';

// ─── Seed Job Posts & Innovator Collaborations (NO Funding Grants) ────────────
const JOB_POSTS: JobPost[] = [
  {
    id: 'job-001',
    type: 'company_job',
    title: 'Embedded Systems & ROS2 Engineer',
    company: 'Apex Robotics Inc.',
    companyInitials: 'AR',
    companyColor: '#6366f1',
    isVerified: true,
    location: 'Boston, MA',
    workMode: 'hybrid',
    salaryMin: 110000,
    salaryMax: 135000,
    salaryUnit: 'yr',
    jobType: 'full_time',
    description: 'Build next-gen autonomous mobile robots with a world-class team.',
    roleDetails: [
      'Design and program microcontrollers for autonomous mobile robots.',
      'Develop real-time ROS2 nodes for sensor fusion and LIDAR navigation.',
      'Collaborate with hardware teams to test PCB power distribution boards.',
      'Participate in daily agile sprints and field prototype testing.',
    ],
    skills: ['ROS2', 'C++', 'Embedded C', 'LIDAR', 'PCB Layout'],
    postedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    postedAgo: '2 hours ago',
    applicants: 14,
  },
  {
    id: 'job-002',
    type: 'innovator_post',
    title: 'Co-Founder & Robotics Lead: Autonomous Drone Navigation',
    company: 'SkySense Student Labs',
    companyInitials: 'SS',
    companyColor: '#f59e0b',
    isVerified: false,
    location: 'Austin, TX (Hybrid)',
    workMode: 'hybrid',
    description: 'Seeking a talented robotics engineer to join our student startup building autonomous indoor inspection drones.',
    roleDetails: [
      'Develop onboard vision and path-planning algorithms in ROS2.',
      'Integrate SLAM for GPS-denied indoor navigation.',
      'Collaborate on flight hardware selection and payload optimization.',
      'Present prototype at MIT DeepTech Showcase and seed pitch meetings.',
    ],
    skills: ['ROS2', 'Python', 'C++', 'SLAM', 'Computer Vision', 'LIDAR'],
    postedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    postedAgo: '3 hours ago',
    innovatorBadge: 'Innovator Collab',
    innovatorAuthor: 'Nina Patel (MIT Robotics)',
    applicants: 8,
  },
  {
    id: 'job-003',
    type: 'company_job',
    title: 'Full-Stack Software Engineer (React / Node)',
    company: 'Nexus Cloud Technologies',
    companyInitials: 'NC',
    companyColor: '#0ea5e9',
    isVerified: true,
    location: 'San Francisco, CA',
    workMode: 'remote',
    salaryMin: 130000,
    salaryMax: 165000,
    salaryUnit: 'yr',
    jobType: 'full_time',
    description: 'Build scalable cloud-native applications serving millions of users.',
    roleDetails: [
      'Architect and develop high-throughput REST and GraphQL APIs.',
      'Build responsive React frontends with Next.js and TypeScript.',
      'Optimize PostgreSQL and Redis for performance at scale.',
      'Collaborate in cross-functional engineering squads.',
    ],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'FullStack'],
    postedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    postedAgo: '1 day ago',
    applicants: 67,
  },
  {
    id: 'job-004',
    type: 'innovator_post',
    title: 'Collaborator & Full-Stack Developer: AI Mental Health Companion',
    company: 'MindBridge Initiative',
    companyInitials: 'MB',
    companyColor: '#ec4899',
    isVerified: false,
    location: 'Remote',
    workMode: 'remote',
    description: 'Student-led initiative creating an AI-driven journaling and emotion tracking app for university students.',
    roleDetails: [
      'Build a React Native / Next.js web dashboard with smooth UX.',
      'Integrate LLM sentiment analysis pipelines for mood tracking.',
      'Design privacy-first data architecture with end-to-end encryption.',
      'Conduct user testing sessions with student focus groups.',
    ],
    skills: ['React', 'TypeScript', 'Python', 'AI/ML', 'FullStack'],
    postedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    postedAgo: '12 hours ago',
    innovatorBadge: 'Student Project',
    innovatorAuthor: 'David Zhang (Stanford CS)',
    applicants: 5,
  },
  {
    id: 'job-005',
    type: 'company_job',
    title: 'Machine Learning Engineer — Computer Vision & NLP',
    company: 'Semantix AI',
    companyInitials: 'SA',
    companyColor: '#8b5cf6',
    isVerified: true,
    location: 'New York, NY',
    workMode: 'on_site',
    salaryMin: 145000,
    salaryMax: 185000,
    salaryUnit: 'yr',
    jobType: 'full_time',
    description: 'Pioneer state-of-the-art multimodal vision and NLP models.',
    roleDetails: [
      'Fine-tune multimodal LLMs for domain-specific vision & search tasks.',
      'Maintain scalable PyTorch training pipelines on AWS SageMaker.',
      'Deploy real-time inference microservices with latency optimization.',
      'Author technical research papers and internal engineering specs.',
    ],
    skills: ['Python', 'PyTorch', 'AI/ML', 'Computer Vision', 'AWS'],
    postedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    postedAgo: '2 days ago',
    applicants: 42,
  },
  {
    id: 'job-006',
    type: 'company_job',
    title: 'DevOps & Kubernetes Platform Engineer',
    company: 'Orbital Systems',
    companyInitials: 'OS',
    companyColor: '#dc2626',
    isVerified: true,
    location: 'Remote',
    workMode: 'remote',
    salaryMin: 105000,
    salaryMax: 130000,
    salaryUnit: 'yr',
    jobType: 'full_time',
    description: 'Own the cloud infrastructure powering satellite ground station software.',
    roleDetails: [
      'Build and maintain Kubernetes clusters on GCP and AWS.',
      'Implement CI/CD pipelines with GitHub Actions and ArgoCD.',
      'Monitor production services with Datadog and Prometheus.',
      'Drive infrastructure-as-code with Terraform and Helm.',
    ],
    skills: ['Kubernetes', 'Terraform', 'GCP', 'AWS', 'Docker'],
    postedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    postedAgo: '6 hours ago',
    applicants: 23,
  },
];

// ─── Applications Store ───────────────────────────────────────────────────────
let APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    jobId: 'job-003',
    userId: 'user-001',
    type: 'job',
    status: 'interview_scheduled',
    resumeFileName: 'Alex_Rivera_Robotics_Resume_2026.pdf',
    portfolioUrl: 'https://alexrivera.dev',
    pitch: 'I have 3+ years experience with Next.js and high-throughput Node.js microservices.',
    appliedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    appliedAgo: '3 days ago',
  },
  {
    id: 'app-002',
    jobId: 'job-005',
    userId: 'user-001',
    type: 'job',
    status: 'under_review',
    resumeFileName: 'Alex_Rivera_Robotics_Resume_2026.pdf',
    appliedAt: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString(),
    appliedAgo: '7 days ago',
  },
  {
    id: 'app-003',
    jobId: 'job-002',
    userId: 'user-001',
    type: 'collaboration',
    status: 'shortlisted',
    resumeFileName: 'Alex_Rivera_Robotics_Resume_2026.pdf',
    portfolioUrl: 'https://github.com/alexrivera-robotics',
    pitch: 'Excited about autonomous drone navigation! I built ROS2 packages for LIDAR SLAM at university.',
    appliedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    appliedAgo: '1 day ago',
  },
];

// ─── Saved Posts Store ────────────────────────────────────────────────────────
let SAVED_POST_IDS: Set<string> = new Set(['job-001', 'job-004']);

// ─── Conversations Store ──────────────────────────────────────────────────────
let CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Sarah Jenkins',
    participantRole: 'Technical Recruiter',
    participantAvatar: 'SJ',
    companyOrProject: 'Apex Robotics Inc.',
    lastMessage: 'Hi Alex, we reviewed your ROS2 background and would love to schedule a technical call!',
    lastMessageTime: '10:42 AM',
    unreadCount: 1,
    online: true,
    messages: [
      {
        id: 'm1',
        senderId: 'sarah',
        text: 'Hi Alex! Thank you for applying for the Embedded Systems & ROS2 Engineer role at Apex Robotics.',
        timestamp: '10:30 AM',
        isMe: false,
      },
      {
        id: 'm2',
        senderId: 'user-001',
        text: 'Hi Sarah! Thanks for getting back to me. I would be thrilled to discuss the team and projects.',
        timestamp: '10:35 AM',
        isMe: true,
      },
      {
        id: 'm3',
        senderId: 'sarah',
        text: 'Hi Alex, we reviewed your ROS2 background and would love to schedule a technical call!',
        timestamp: '10:42 AM',
        isMe: false,
      },
    ],
  },
  {
    id: 'conv-2',
    participantName: 'Nina Patel',
    participantRole: 'Student Innovator & Founder',
    participantAvatar: 'NP',
    companyOrProject: 'SkySense Student Labs',
    lastMessage: 'Your LIDAR SLAM experience is exactly what our autonomous drone team needs.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    online: false,
    messages: [
      {
        id: 'm4',
        senderId: 'user-001',
        text: 'Hey Nina! I saw your collaboration post for SkySense. I have experience with ROS2 and LIDAR.',
        timestamp: 'Yesterday 2:15 PM',
        isMe: true,
      },
      {
        id: 'm5',
        senderId: 'nina',
        text: 'Your LIDAR SLAM experience is exactly what our autonomous drone team needs.',
        timestamp: 'Yesterday 4:30 PM',
        isMe: false,
      },
    ],
  },
];

// ─── Notifications Store ──────────────────────────────────────────────────────
let NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Interview Scheduled',
    message: 'Apex Robotics invited you for a technical interview for Embedded Systems & ROS2 Engineer.',
    timestamp: '10 mins ago',
    read: false,
    type: 'application',
    link: '/applications',
  },
  {
    id: 'notif-2',
    title: 'New Message from Sarah Jenkins',
    message: '"Hi Alex, we reviewed your ROS2 background and would love to schedule..."',
    timestamp: '1 hour ago',
    read: false,
    type: 'message',
    link: '/messages',
  },
  {
    id: 'notif-3',
    title: 'Shortlisted for Collaboration',
    message: 'Nina Patel shortlisted your proposal for SkySense Autonomous Drone Navigation.',
    timestamp: 'Yesterday',
    read: true,
    type: 'match',
    link: '/applications',
  },
  {
    id: 'notif-4',
    title: 'Profile View',
    message: 'Nexus Cloud Technologies HR team viewed your candidate profile.',
    timestamp: '2 days ago',
    read: true,
    type: 'system',
    link: '/profile',
  },
];

// ─── API Functions ────────────────────────────────────────────────────────────

export async function getJobPosts(filters?: Partial<FeedFilters>): Promise<JobPost[]> {
  await delay(250);
  let results = [...JOB_POSTS];

  if (filters?.activeTab && filters.activeTab !== 'all') {
    const targetType = filters.activeTab === 'company_jobs' ? 'company_job' : 'innovator_post';
    results = results.filter((j) => j.type === targetType);
  }

  if (filters?.query) {
    const q = filters.query.toLowerCase();
    results = results.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (filters?.activeTags?.length) {
    results = results.filter((j) =>
      filters.activeTags!.some((tag) =>
        j.skills.some((s) => s.toLowerCase() === tag.toLowerCase())
      )
    );
  }

  if (filters?.workMode) {
    results = results.filter((j) => j.workMode === filters.workMode);
  }

  if (filters?.jobType) {
    results = results.filter((j) => j.jobType === filters.jobType);
  }

  if (filters?.salaryMin && filters.salaryMin > 0) {
    results = results.filter(
      (j) => !j.salaryMin || j.salaryMin >= (filters.salaryMin ?? 0)
    );
  }

  return results;
}

export async function getSavedJobPosts(): Promise<JobPost[]> {
  await delay(200);
  return JOB_POSTS.filter((j) => SAVED_POST_IDS.has(j.id));
}

export async function toggleSaveJobPost(jobId: string): Promise<boolean> {
  await delay(150);
  if (SAVED_POST_IDS.has(jobId)) {
    SAVED_POST_IDS.delete(jobId);
    return false;
  } else {
    SAVED_POST_IDS.add(jobId);
    return true;
  }
}

export function isJobSaved(jobId: string): boolean {
  return SAVED_POST_IDS.has(jobId);
}

export async function getUserApplications(userId: string): Promise<Application[]> {
  await delay(300);
  const apps = APPLICATIONS.filter((a) => a.userId === userId);
  return apps.map((a) => ({
    ...a,
    job: JOB_POSTS.find((j) => j.id === a.jobId),
  }));
}

export async function submitApplication(
  jobId: string,
  userId: string,
  payload: {
    type?: 'job' | 'collaboration';
    resumeFileName?: string;
    portfolioUrl?: string;
    pitch?: string;
  }
): Promise<Application> {
  await delay(500);

  const existing = APPLICATIONS.find(
    (a) => a.jobId === jobId && a.userId === userId
  );
  if (existing) throw new Error('You have already submitted an application/proposal for this post.');

  const job = JOB_POSTS.find((j) => j.id === jobId);

  const newApp: Application = {
    id: `app-${Date.now()}`,
    jobId,
    userId,
    type: payload.type || (job?.type === 'innovator_post' ? 'collaboration' : 'job'),
    status: 'submitted',
    resumeFileName: payload.resumeFileName,
    portfolioUrl: payload.portfolioUrl,
    pitch: payload.pitch,
    appliedAt: new Date().toISOString(),
    appliedAgo: 'Just now',
    job,
  };

  APPLICATIONS = [newApp, ...APPLICATIONS];
  return newApp;
}

export function getAppliedJobIds(userId: string): Set<string> {
  return new Set(
    APPLICATIONS.filter((a) => a.userId === userId).map((a) => a.jobId)
  );
}

export async function withdrawApplication(appId: string): Promise<void> {
  await delay(300);
  APPLICATIONS = APPLICATIONS.filter((a) => a.id !== appId);
}

// ─── Messaging API ────────────────────────────────────────────────────────────
export async function getConversations(): Promise<Conversation[]> {
  await delay(200);
  return [...CONVERSATIONS];
}

export async function sendDirectMessage(conversationId: string, text: string): Promise<DirectMessage> {
  await delay(150);
  const conv = CONVERSATIONS.find((c) => c.id === conversationId);
  if (!conv) throw new Error('Conversation not found');

  const newMsg: DirectMessage = {
    id: `msg-${Date.now()}`,
    senderId: 'user-001',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    isMe: true,
  };

  conv.messages.push(newMsg);
  conv.lastMessage = text;
  conv.lastMessageTime = 'Just now';
  return newMsg;
}

// ─── Notifications API ────────────────────────────────────────────────────────
export async function getNotifications(): Promise<AppNotification[]> {
  await delay(200);
  return [...NOTIFICATIONS];
}

export async function markNotificationAsRead(id: string): Promise<void> {
  await delay(100);
  const n = NOTIFICATIONS.find((item) => item.id === id);
  if (n) n.read = true;
}

export async function markAllNotificationsAsRead(): Promise<void> {
  await delay(150);
  NOTIFICATIONS.forEach((n) => (n.read = true));
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}