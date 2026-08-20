'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, Notification, Application, CollaborationRequest, ActiveCollaboration, Connection, Message, Pitch } from '@/types/innovator';
import { mockNotifications } from '@/data/innovator/mockNotifications';
import { mockApplications } from '@/data/innovator/mockApplications';
import { mockCollaborationRequests, mockSentRequests, mockActiveCollaborations, mockConnections } from '@/data/innovator/mockCollaborations';
import { mockMessages, mockConversations } from '@/data/innovator/mockMessages';
import { mockPitches } from '@/data/innovator/mockPitches';
import type { ChatConversation } from '@/types/innovator';

// ─── APP STATE ────────────────────────────────────────────────

interface AppState {
  // Auth
  currentUser: AuthUser;
  isLoggedIn: boolean;

  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;

  // Applications (my opportunities)
  applications: Application[];

  // Pitches (direct pitches & grant applications)
  pitches: Pitch[];

  // Collaboration
  incomingRequests: CollaborationRequest[];
  sentRequests: CollaborationRequest[];
  activeCollaborations: ActiveCollaboration[];
  connections: Connection[];

  // Chat
  conversations: ChatConversation[];
  messages: Record<string, Message[]>;

  // Toast
  toast: string | null;
}

interface AppActions {
  login: (user?: Partial<AuthUser>) => void;
  logout: () => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  applyToPost: (postId: string, postType: 'job' | 'internship' | 'grant', title: string, companyOrOrg: string, domain: string, salary?: string, logo?: string) => void;

  submitPitch: (pitch: Omit<Pitch, 'id' | 'createdAt' | 'innovatorId'>) => void;

  acceptCollaborationRequest: (requestId: string) => void;
  declineCollaborationRequest: (requestId: string) => void;
  endCollaboration: (collaborationId: string) => void;
  sendCollaborationRequest: (request: Omit<CollaborationRequest, 'id' | 'sentAt' | 'status'>) => void;

  sendMessage: (conversationId: string, content: string) => void;
  markConversationRead: (conversationId: string) => void;

  showToast: (message: string) => void;
  dismissToast: () => void;
}

type AppContextType = AppState & AppActions;

// ─── DEFAULT USER ─────────────────────────────────────────────

const defaultUser: AuthUser = {
  id: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@mit.edu',
  role: 'Student Innovator',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  isLoggedIn: true,
  profileComplete: true,
};

// ─── CONTEXT ──────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [pitches, setPitches] = useState<Pitch[]>(mockPitches);
  const [incomingRequests, setIncomingRequests] = useState<CollaborationRequest[]>(mockCollaborationRequests);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>(mockSentRequests);
  const [activeCollaborations, setActiveCollaborations] = useState<ActiveCollaboration[]>(mockActiveCollaborations);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [conversations, setConversations] = useState<ChatConversation[]>(mockConversations);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [toast, setToast] = useState<string | null>(null);

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 4000);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const submitPitch = useCallback(
    (pitchData: Omit<Pitch, 'id' | 'createdAt' | 'innovatorId'>) => {
      const newPitch: Pitch = {
        ...pitchData,
        id: `pitch-${Date.now()}`,
        innovatorId: currentUser.id,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setPitches((prev) => [newPitch, ...prev]);
      const targetName = pitchData.organizationName || 'funding organization';
      showToast(`🚀 Pitch "${pitchData.ideaTitle}" submitted to ${targetName}!`);
    },
    [currentUser.id, showToast]
  );

  const login = useCallback((user?: Partial<AuthUser>) => {
    setCurrentUser({ ...defaultUser, ...user });
    setIsLoggedIn(true);
    showToast('✅ Logged in successfully!');
  }, [showToast]);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    showToast('👋 Logged out successfully.');
  }, [showToast]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const applyToPost = useCallback(
    (postId: string, postType: 'job' | 'internship' | 'grant', title: string, companyOrOrg: string, domain: string, salary?: string, logo?: string) => {
      const existing = applications.find((a) => a.postId === postId);
      if (existing) return;

      const newApp: Application = {
        id: `app-${Date.now()}`,
        userId: currentUser.id,
        postId,
        postType,
        title,
        companyOrOrg,
        domain,
        salary,
        status: 'Applied',
        appliedAt: new Date().toISOString().split('T')[0],
        logo,
      };
      setApplications((prev) => [newApp, ...prev]);
      showToast(`🚀 Applied to "${title}" successfully!`);
    },
    [applications, currentUser.id, showToast]
  );

  const acceptCollaborationRequest = useCallback(
    (requestId: string) => {
      const req = incomingRequests.find((r) => r.id === requestId);
      if (!req) return;

      setIncomingRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'accepted' as const } : r)));

      const newCollab: ActiveCollaboration = {
        id: `ac-${Date.now()}`,
        collaborationRequestId: requestId,
        participant1: {
          userId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: currentUser.role,
        },
        participant2: {
          userId: req.fromUserId,
          name: req.fromUserName,
          avatar: req.fromUserAvatar,
          role: req.fromUserRole,
        },
        projectTitle: req.projectTitle,
        status: 'active',
        startedAt: new Date().toISOString().split('T')[0],
        chatId: `chat-${Date.now()}`,
      };

      setActiveCollaborations((prev) => [newCollab, ...prev]);
      setMessages((prev) => ({ ...prev, [newCollab.chatId]: [] }));
      showToast(`🤝 Collaboration with ${req.fromUserName} is now active!`);
    },
    [incomingRequests, currentUser, showToast]
  );

  const declineCollaborationRequest = useCallback(
    (requestId: string) => {
      setIncomingRequests((prev) => prev.map((r) => (r.id === requestId ? { ...r, status: 'declined' as const } : r)));
      showToast('Collaboration request declined.');
    },
    [showToast]
  );

  const endCollaboration = useCallback(
    (collaborationId: string) => {
      setActiveCollaborations((prev) =>
        prev.map((c) => (c.id === collaborationId ? { ...c, status: 'ended' as const, endedAt: new Date().toISOString() } : c))
      );
      showToast('Collaboration ended. Chat access has been disabled.');
    },
    [showToast]
  );

  const sendCollaborationRequest = useCallback(
    (request: Omit<CollaborationRequest, 'id' | 'sentAt' | 'status'>) => {
      const newReq: CollaborationRequest = {
        ...request,
        id: `cr-${Date.now()}`,
        status: 'pending',
        sentAt: new Date().toISOString(),
      };
      setSentRequests((prev) => [newReq, ...prev]);
      showToast(`📤 Collaboration request sent to ${request.toUserName}!`);
    },
    [showToast]
  );

  const sendMessage = useCallback(
    (conversationId: string, content: string) => {
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId,
        senderId: currentUser.id,
        senderName: currentUser.name,
        content,
        sentAt: new Date().toISOString(),
        isRead: true,
        type: 'text',
      };
      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), newMessage],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId ? { ...c, lastMessage: newMessage, lastMessageAt: newMessage.sentAt, unreadCount: 0 } : c
        )
      );
    },
    [currentUser]
  );

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)));
    setMessages((prev) => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).map((m) => ({ ...m, isRead: true })),
    }));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        notifications,
        unreadNotificationCount,
        applications,
        pitches,
        incomingRequests,
        sentRequests,
        activeCollaborations,
        connections,
        conversations,
        messages,
        toast,
        login,
        logout,
        markNotificationRead,
        markAllNotificationsRead,
        applyToPost,
        submitPitch,
        acceptCollaborationRequest,
        declineCollaborationRequest,
        endCollaboration,
        sendCollaborationRequest,
        sendMessage,
        markConversationRead,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
