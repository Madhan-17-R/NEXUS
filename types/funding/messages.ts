export type MessageStatus = "sent" | "delivered" | "read";
export type ConversationStatus = "active" | "archived";
export type MessageType = "text" | "attachment" | "system";

export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size?: string;
  type?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  type: MessageType;
  attachments?: MessageAttachment[];
}

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: "applicant" | "reviewer" | "admin" | "system";
  organizationId?: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  participants: ConversationParticipant[];
  subject: string;
  relatedEntityType: "grant" | "application" | "directPitch" | "none";
  relatedEntityId?: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadCount: number;
}
