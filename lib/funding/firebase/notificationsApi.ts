import { Notification } from "@/types/funding/notifications";

function uid(prefix = "notif") {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}`;
}

let mockNotifications: Notification[] = [
  {
    id: "notif_1",
    type: "application_update",
    title: "New Application Submitted",
    message: "Maya Krishnan submitted a new application for AI-Powered Rural Healthcare Assistant.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    isRead: false,
    relatedEntityType: "application",
    relatedEntityId: "APP-2026-00124",
    actionUrl: "/grants/g1/applications/APP-2026-00124",
  },
  {
    id: "notif_2",
    type: "pitch_update",
    title: "High Priority Pitch Received",
    message: "Aris Thorne submitted a High priority direct pitch.",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    isRead: false,
    relatedEntityType: "directPitch",
    relatedEntityId: "PITCH-2026-0018",
    actionUrl: "/direct-pitches/PITCH-2026-0018",
  },
  {
    id: "notif_3",
    type: "system",
    title: "Weekly Review Summary",
    message: "You have 5 pending applications awaiting your review.",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    actionUrl: "/reviews",
  }
];

export const notificationsApi = {
  async getNotifications(): Promise<Notification[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...mockNotifications]), 300));
  },

  async markAsRead(id: string): Promise<void> {
    return new Promise((resolve) => {
      const idx = mockNotifications.findIndex(n => n.id === id);
      if (idx !== -1) {
        mockNotifications[idx] = { ...mockNotifications[idx], isRead: true };
      }
      setTimeout(() => resolve(), 200);
    });
  },

  async markAllAsRead(): Promise<void> {
    return new Promise((resolve) => {
      mockNotifications = mockNotifications.map(n => ({ ...n, isRead: true }));
      setTimeout(() => resolve(), 200);
    });
  }
};
