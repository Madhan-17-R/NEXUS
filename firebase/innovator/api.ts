// ============================================================
// FIREBASE SERVICE LAYER — STUB IMPLEMENTATION
// Ready for Firebase integration. Currently uses mock data.
// Replace stub implementations with actual Firebase calls.
// ============================================================

import type {
  User,
  Innovator,
  FeedPost,
  Application,
  CollaborationRequest,
  ActiveCollaboration,
  Project,
  Pitch,
  Notification,
  Message,
  ChatConversation,
} from '@/types/innovator';

// ─── AUTH SERVICE ─────────────────────────────────────────────

export const authService = {
  /**
   * Sign in with email and password.
   * TODO: Replace with Firebase signInWithEmailAndPassword
   */
  async signInWithEmail(email: string, password: string): Promise<{ user: User; token: string }> {
    // STUB — mock delay
    await delay(500);
    console.log('[AuthService] signInWithEmail', email, password);
    throw new Error('Not implemented — replace with Firebase auth');
  },

  /**
   * Register a new user.
   * TODO: Replace with Firebase createUserWithEmailAndPassword
   */
  async register(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500);
    console.log('[AuthService] register', name, email);
    throw new Error('Not implemented — replace with Firebase auth');
  },

  /**
   * Send OTP to email.
   * TODO: Replace with Firebase OTP or email link
   */
  async sendOTP(email: string): Promise<void> {
    await delay(300);
    console.log('[AuthService] sendOTP', email);
    // Mock: pretend OTP sent
  },

  /**
   * Sign out.
   * TODO: Replace with Firebase signOut
   */
  async signOut(): Promise<void> {
    await delay(200);
    console.log('[AuthService] signOut');
  },
};

// ─── USER SERVICE ─────────────────────────────────────────────

export const userService = {
  /**
   * Get an innovator profile by ID.
   * TODO: Replace with Firestore getDoc('users', id)
   */
  async getInnovator(id: string): Promise<Innovator | null> {
    await delay(300);
    const { mockInnovators } = await import('@/data/innovator/mockUsers');
    return mockInnovators.find((u) => u.id === id) || null;
  },

  /**
   * Update an innovator's profile.
   * TODO: Replace with Firestore updateDoc('users', id, data)
   */
  async updateProfile(id: string, data: Partial<Innovator>): Promise<void> {
    await delay(400);
    console.log('[UserService] updateProfile', id, data);
  },

  /**
   * Search users.
   * TODO: Replace with Firestore query or Algolia search
   */
  async searchUsers(query: string): Promise<Innovator[]> {
    await delay(300);
    const { mockInnovators } = await import('@/data/innovator/mockUsers');
    return mockInnovators.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) ||
        u.domains.some((d) => d.toLowerCase().includes(query.toLowerCase()))
    );
  },
};

// ─── FEED SERVICE ─────────────────────────────────────────────

export const feedService = {
  /**
   * Get feed posts.
   * TODO: Replace with Firestore collection query
   */
  async getFeedPosts(): Promise<FeedPost[]> {
    await delay(300);
    const { mockFeedPosts } = await import('@/data/innovator/mockPosts');
    return mockFeedPosts;
  },

  /**
   * Get posts by type.
   * TODO: Replace with Firestore where('postType', '==', type)
   */
  async getPostsByType(type: FeedPost['postType']): Promise<FeedPost[]> {
    await delay(200);
    const { mockFeedPosts } = await import('@/data/innovator/mockPosts');
    return mockFeedPosts.filter((p) => p.postType === type);
  },
};

// ─── APPLICATION SERVICE ──────────────────────────────────────

export const applicationService = {
  /**
   * Get user's applications.
   * TODO: Replace with Firestore where('userId', '==', userId)
   */
  async getApplications(userId: string): Promise<Application[]> {
    await delay(300);
    const { mockApplications } = await import('@/data/innovator/mockApplications');
    return mockApplications.filter((a) => a.userId === userId);
  },

  /**
   * Submit an application.
   * TODO: Replace with Firestore addDoc('applications', data)
   */
  async submitApplication(data: Omit<Application, 'id'>): Promise<Application> {
    await delay(400);
    console.log('[ApplicationService] submitApplication', data);
    return { ...data, id: `app-${Date.now()}` };
  },
};

// ─── COLLABORATION SERVICE ────────────────────────────────────

export const collaborationService = {
  /**
   * Get incoming collaboration requests.
   * TODO: Replace with Firestore where('toUserId', '==', userId)
   */
  async getIncomingRequests(userId: string): Promise<CollaborationRequest[]> {
    await delay(300);
    const { mockCollaborationRequests } = await import('@/data/innovator/mockCollaborations');
    return mockCollaborationRequests.filter((r) => r.toUserId === userId);
  },

  /**
   * Send a collaboration request.
   * TODO: Replace with Firestore addDoc('collaborationRequests', data)
   */
  async sendRequest(data: Omit<CollaborationRequest, 'id' | 'sentAt'>): Promise<CollaborationRequest> {
    await delay(400);
    return { ...data, id: `cr-${Date.now()}`, sentAt: new Date().toISOString() };
  },

  /**
   * Accept a collaboration request.
   * TODO: Replace with Firestore updateDoc + create collaboration
   */
  async acceptRequest(requestId: string): Promise<ActiveCollaboration> {
    await delay(300);
    console.log('[CollaborationService] acceptRequest', requestId);
    throw new Error('Not implemented — replace with Firebase');
  },
};

// ─── PROJECT SERVICE ──────────────────────────────────────────

export const projectService = {
  /**
   * Get user's projects.
   * TODO: Replace with Firestore where('ownerId', '==', userId)
   */
  async getProjects(userId: string): Promise<Project[]> {
    await delay(300);
    const { mockProjects } = await import('@/data/innovator/mockProjects');
    return mockProjects.filter((p) => p.ownerId === userId);
  },

  /**
   * Create a project.
   * TODO: Replace with Firestore addDoc('projects', data)
   */
  async createProject(data: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    await delay(400);
    return { ...data, id: `p-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  },
};

// ─── PITCH SERVICE ────────────────────────────────────────────

export const pitchService = {
  /**
   * Submit a pitch.
   * TODO: Replace with Firestore addDoc('pitches', data)
   */
  async submitPitch(data: Omit<Pitch, 'id' | 'createdAt'>): Promise<Pitch> {
    await delay(500);
    return { ...data, id: `pitch-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  },

  /**
   * Save a pitch draft.
   * TODO: Replace with Firestore setDoc('pitches', id, data)
   */
  async saveDraft(data: Omit<Pitch, 'id' | 'createdAt'>): Promise<Pitch> {
    await delay(300);
    return { ...data, id: `draft-${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
  },
};

// ─── NOTIFICATION SERVICE ─────────────────────────────────────

export const notificationService = {
  /**
   * Get notifications.
   * TODO: Replace with Firestore onSnapshot listener
   */
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(200);
    const { mockNotifications } = await import('@/data/innovator/mockNotifications');
    return mockNotifications.filter((n) => n.userId === userId);
  },
};

// ─── CHAT SERVICE ─────────────────────────────────────────────

export const chatService = {
  /**
   * Get conversations.
   * TODO: Replace with Firestore query on conversations collection
   */
  async getConversations(userId: string): Promise<ChatConversation[]> {
    await delay(200);
    const { mockConversations } = await import('@/data/innovator/mockMessages');
    return mockConversations.filter((c) => c.participants.some((p) => p.userId === userId));
  },

  /**
   * Get messages for a conversation.
   * TODO: Replace with Firestore onSnapshot on messages subcollection
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    await delay(200);
    const { mockMessages } = await import('@/data/innovator/mockMessages');
    return mockMessages[conversationId] || [];
  },

  /**
   * Send a message.
   * TODO: Replace with Firestore addDoc('messages', data)
   */
  async sendMessage(conversationId: string, senderId: string, content: string): Promise<Message> {
    await delay(100);
    return {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName: 'You',
      content,
      sentAt: new Date().toISOString(),
      isRead: true,
      type: 'text',
    };
  },
};

// ─── UTILITY ──────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

