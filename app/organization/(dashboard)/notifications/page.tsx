"use client";

import { Bell, Heart, MessageCircle, UserPlus, Briefcase, Settings } from "lucide-react";
import Link from "next/link";

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "application",
      icon: Briefcase,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      title: "New Application Received",
      content: "Alex Rivera applied for your Frontend Developer opportunity.",
      time: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      type: "follow",
      icon: UserPlus,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      title: "New Follower",
      content: "Tech Innovations Inc. started following your company.",
      time: "5 hours ago",
      unread: true
    },
    {
      id: 3,
      type: "like",
      icon: Heart,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      title: "Post Engagement",
      content: "Your recent Project Update reached 500 likes.",
      time: "1 day ago",
      unread: false
    },
    {
      id: 4,
      type: "comment",
      icon: MessageCircle,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      title: "New Comment",
      content: "Sarah Jenkins commented on your recent Recruitment Post.",
      time: "2 days ago",
      unread: false
    },
    {
      id: 5,
      type: "system",
      icon: Bell,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      title: "Profile Completion",
      content: "Your company profile is 80% complete. Add a cover banner to reach 100%.",
      time: "3 days ago",
      unread: false
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-6 pb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">Notifications</h1>
          <p className="text-brand-foreground/70 text-sm mt-1">Stay updated with your company's activity and engagement.</p>
        </div>
        <Link href="/organization/settings" className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-brand-border bg-gray-50/50">
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-brand-navy text-white text-sm font-medium rounded-full">All</button>
            <button className="px-4 py-1.5 bg-transparent hover:bg-gray-100 text-brand-foreground/70 text-sm font-medium rounded-full transition-colors">Unread</button>
          </div>
          <button className="text-sm font-medium text-brand-primary hover:underline">Mark all as read</button>
        </div>

        <div className="divide-y divide-brand-border">
          {notifications.map(notif => (
            <div 
              key={notif.id} 
              className={`p-5 flex gap-4 transition-colors hover:bg-gray-50 cursor-pointer ${notif.unread ? 'bg-brand-mint/30' : 'bg-white'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                <notif.icon className={`w-6 h-6 ${notif.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className={`text-sm ${notif.unread ? 'font-bold text-brand-foreground' : 'font-medium text-brand-foreground/80'}`}>
                    {notif.title}
                  </p>
                  <span className="text-xs text-brand-foreground/50 whitespace-nowrap ml-4">{notif.time}</span>
                </div>
                <p className={`text-sm ${notif.unread ? 'text-brand-foreground/90 font-medium' : 'text-brand-foreground/70'}`}>
                  {notif.content}
                </p>
              </div>
              {notif.unread && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-primary shrink-0 mt-2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
