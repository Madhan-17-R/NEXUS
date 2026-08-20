"use client";

import { useState } from "react";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);

  const conversations = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Frontend Developer",
      avatar: "SJ",
      lastMessage: "Hi Alex, we reviewed your ROS2 background...",
      time: "10:42 AM",
      unread: true
    },
    {
      id: 2,
      name: "Nina Patel",
      role: "UX Designer",
      avatar: "NP",
      lastMessage: "Your LiDAR SLAM experience is exactly what...",
      time: "Yesterday",
      unread: false
    }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-brand-foreground">Messages & Direct Messaging</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Chat directly with talent and applicants.</p>
      </div>

      <div className="flex-1 card p-0 flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-1/3 border-r border-brand-border flex flex-col bg-white">
          <div className="p-4 border-b border-brand-border">
            <h2 className="text-xs font-bold text-brand-foreground/50 tracking-wider mb-3">CONVERSATIONS ({conversations.length})</h2>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-9 pr-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={`flex gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                  activeChat === chat.id 
                    ? "bg-brand-mint border-brand-primary" 
                    : "border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="font-bold text-brand-foreground text-sm truncate">{chat.name}</p>
                    <span className="text-[10px] text-brand-foreground/50 whitespace-nowrap">{chat.time}</span>
                  </div>
                  <p className="text-xs text-brand-primary truncate">{chat.role}</p>
                  <p className={`text-xs mt-1 truncate ${chat.unread ? 'font-semibold text-brand-foreground' : 'text-brand-foreground/60'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Chat */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Chat Header */}
          <div className="p-4 border-b border-brand-border flex justify-between items-center bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-sm">
                SJ
              </div>
              <div>
                <p className="font-bold text-brand-foreground">Sarah Jenkins</p>
                <p className="text-xs text-brand-primary flex items-center gap-1">
                  Frontend Developer • Candidate
                </p>
              </div>
            </div>
            <button className="text-gray-400 hover:text-brand-foreground">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
            {/* Incoming Message */}
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1">
                SJ
              </div>
              <div>
                <div className="bg-white border border-brand-border p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-brand-foreground">
                  Hi! Thank you for reviewing my application for the Frontend Developer role at Apex Robotics.
                </div>
                <span className="text-[10px] text-brand-foreground/40 mt-1 ml-1">10:30 AM</span>
              </div>
            </div>

            {/* Outgoing Message */}
            <div className="flex gap-3 max-w-[80%] ml-auto justify-end">
              <div>
                <div className="bg-brand-navy p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                  Hi Sarah! Thanks for getting back to me. We would be thrilled to discuss the team and projects.
                </div>
                <div className="flex justify-end items-center gap-1 mt-1 mr-1">
                  <span className="text-[10px] text-brand-foreground/40">10:35 AM</span>
                  <span className="text-brand-primary text-[10px]">✓✓</span>
                </div>
              </div>
            </div>

            {/* Incoming Message */}
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1">
                SJ
              </div>
              <div>
                <div className="bg-white border border-brand-border p-3 rounded-2xl rounded-tl-none shadow-sm text-sm text-brand-foreground">
                  I'm available for a technical call later this week. Let me know what times work best for you!
                </div>
                <span className="text-[10px] text-brand-foreground/40 mt-1 ml-1">10:42 AM</span>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-brand-border">
            <div className="flex items-end gap-3">
              <button className="p-2.5 text-gray-400 hover:text-brand-primary hover:bg-gray-50 rounded-full transition-colors mb-0.5">
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="flex-1 bg-white border border-brand-border rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-brand-primary focus-within:border-brand-primary transition-all">
                <textarea 
                  rows={1}
                  placeholder="Message Sarah Jenkins..."
                  className="w-full max-h-32 px-4 py-3 bg-transparent text-sm focus:outline-none resize-none"
                />
              </div>
              <button className="p-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-full transition-colors mb-0.5 shadow-sm">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
