import { Conversation, Message } from "@/types/funding/messages";

function uid(prefix = "msg") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

let mockConversations: Conversation[] = [
  {
    id: "conv_1",
    status: "active",
    participants: [
      { id: "usr_admin", name: "Funding Org", role: "admin" },
      { id: "usr_1", name: "Maya Krishnan", avatar: "https://i.pravatar.cc/150?u=maya", role: "applicant" }
    ],
    subject: "Regarding: AI-Powered Rural Healthcare Assistant",
    relatedEntityType: "application",
    relatedEntityId: "APP-2026-00124",
    lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
    lastMessagePreview: "Please let us know if you need any further details.",
    unreadCount: 1,
  },
  {
    id: "conv_2",
    status: "active",
    participants: [
      { id: "usr_admin", name: "Funding Org", role: "admin" },
      { id: "usr_2", name: "Dr. Priya Patel", avatar: "https://i.pravatar.cc/150?u=priya_p", role: "applicant" }
    ],
    subject: "Direct Pitch Clarification",
    relatedEntityType: "directPitch",
    relatedEntityId: "PITCH-2026-0017",
    lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
    lastMessagePreview: "Thank you for the update.",
    unreadCount: 0,
  }
];

let mockMessages: Message[] = [
  {
    id: "m_1",
    conversationId: "conv_1",
    senderId: "usr_admin",
    content: "Hi Maya, could you provide more details about the deployment costs?",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: "read",
    type: "text",
  },
  {
    id: "m_2",
    conversationId: "conv_1",
    senderId: "usr_1",
    content: "Absolutely. I have attached the detailed cost breakdown.",
    timestamp: new Date(Date.now() - 3700000).toISOString(),
    status: "read",
    type: "text",
  },
  {
    id: "m_3",
    conversationId: "conv_1",
    senderId: "usr_1",
    content: "Please let us know if you need any further details.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: "delivered",
    type: "text",
  },
  {
    id: "m_4",
    conversationId: "conv_2",
    senderId: "usr_2",
    content: "I have submitted the direct pitch. Looking forward to your feedback.",
    timestamp: new Date(Date.now() - 90000000).toISOString(),
    status: "read",
    type: "text",
  },
  {
    id: "m_5",
    conversationId: "conv_2",
    senderId: "usr_admin",
    content: "Thank you for the update.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: "read",
    type: "text",
  }
];

export const messagesApi = {
  async getConversations(): Promise<Conversation[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...mockConversations]), 300));
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMessages.filter(m => m.conversationId === conversationId).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()));
      }, 200);
    });
  },

  async sendMessage(conversationId: string, content: string): Promise<Message> {
    return new Promise((resolve, reject) => {
      const idx = mockConversations.findIndex(c => c.id === conversationId);
      if (idx === -1) return reject("Conversation not found");

      const newMessage: Message = {
        id: uid("m"),
        conversationId,
        senderId: "usr_admin", // mock sender
        content,
        timestamp: new Date().toISOString(),
        status: "sent",
        type: "text",
      };

      mockMessages.push(newMessage);
      
      const conv = { ...mockConversations[idx] };
      conv.lastMessagePreview = content;
      conv.lastMessageAt = newMessage.timestamp;
      mockConversations[idx] = conv;

      setTimeout(() => resolve(newMessage), 300);
    });
  },

  async markAsRead(conversationId: string): Promise<void> {
    return new Promise((resolve) => {
      mockMessages = mockMessages.map(m => 
        m.conversationId === conversationId && m.senderId !== "usr_admin" ? { ...m, status: "read" } : m
      );
      const idx = mockConversations.findIndex(c => c.id === conversationId);
      if (idx !== -1) {
        mockConversations[idx] = { ...mockConversations[idx], unreadCount: 0 };
      }
      setTimeout(() => resolve(), 100);
    });
  },

  async archiveConversation(conversationId: string): Promise<void> {
    return new Promise((resolve) => {
      const idx = mockConversations.findIndex(c => c.id === conversationId);
      if (idx !== -1) {
        mockConversations[idx] = { ...mockConversations[idx], status: "archived" };
      }
      setTimeout(() => resolve(), 200);
    });
  }
};
