export type NotificationType = "system" | "application_update" | "pitch_update" | "message" | "alert";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  relatedEntityType?: "grant" | "application" | "directPitch" | "message";
  relatedEntityId?: string;
  actionUrl?: string;
}
