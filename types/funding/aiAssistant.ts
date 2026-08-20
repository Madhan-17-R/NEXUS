export type AiRole = "user" | "assistant" | "system";

export interface AiMessage {
  id: string;
  role: AiRole;
  content: string;
  timestamp: string;
  isTyping?: boolean;
}

export interface AiInsight {
  title: string;
  description: string;
  actionLabel?: string;
  actionUrl?: string;
}
