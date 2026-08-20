import type { CollaborationRequest, ActiveCollaboration, Connection } from '@/types/innovator';

export const mockCollaborationRequests: CollaborationRequest[] = [
  {
    id: 'cr1',
    fromUserId: 'u2',
    fromUserName: 'Priya Nair',
    fromUserAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    fromUserRole: 'Student Innovator',
    toUserId: 'u1',
    toUserName: 'Alex Rivera',
    projectTitle: 'AI-powered Medical Diagnostic Tool',
    reason: 'Looking for an embedded systems expert to help integrate our AI model into an edge device for real-time diagnostics.',
    skills: ['ROS2', 'Embedded C', 'Python'],
    message: 'Hi Alex! I love your drone navigation work. Think your skills would be perfect for our project. Would love to collaborate!',
    status: 'pending',
    sentAt: '2026-08-17T10:30:00Z',
  },
  {
    id: 'cr2',
    fromUserId: 'u5',
    fromUserName: 'Rahul Sharma',
    fromUserAvatar: 'https://images.unsplash.com/photo-1499996860823-5214fcc65f8f?w=150&auto=format&fit=crop&q=80',
    fromUserRole: 'Student Innovator',
    toUserId: 'u1',
    toUserName: 'Alex Rivera',
    projectTitle: 'Autonomous Agricultural Drone',
    reason: 'Need a ROS2 and LIDAR expert to help build the navigation system for our soil sampling drone.',
    skills: ['ROS2', 'LIDAR', 'Python', 'C++'],
    message: 'Hey Alex, saw your profile and you\'re exactly who we need. Let\'s talk!',
    status: 'pending',
    sentAt: '2026-08-16T14:00:00Z',
  },
];

export const mockSentRequests: CollaborationRequest[] = [
  {
    id: 'cr3',
    fromUserId: 'u1',
    fromUserName: 'Alex Rivera',
    fromUserAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    fromUserRole: 'Student Innovator',
    toUserId: 'u4',
    toUserName: 'Sara Kim',
    projectTitle: 'DeFi Micro-lending Platform',
    reason: 'Interested in learning about blockchain while contributing embedded systems knowledge to IoT payment terminals.',
    skills: ['Python', 'Arduino', 'Embedded C'],
    status: 'pending',
    sentAt: '2026-08-15T09:00:00Z',
  },
];

export const mockActiveCollaborations: ActiveCollaboration[] = [
  {
    id: 'ac1',
    collaborationRequestId: 'cr4',
    participant1: {
      userId: 'u1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      role: 'Student Innovator',
    },
    participant2: {
      userId: 'u6',
      name: 'Mei-Ling Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
      role: 'Independent Innovator',
    },
    projectTitle: 'ROS2 + NLP Integration for Multi-language Robot Commands',
    status: 'active',
    startedAt: '2026-08-01',
    chatId: 'chat1',
  },
];

export const mockConnections: Connection[] = [
  {
    id: 'conn1',
    userId: 'u3',
    name: 'David Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Working Professional',
    connectedAt: '2026-08-10',
    mutualConnections: 5,
  },
  {
    id: 'conn2',
    userId: 'u2',
    name: 'Priya Nair',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    role: 'Student Innovator',
    connectedAt: '2026-08-05',
    mutualConnections: 12,
  },
];
