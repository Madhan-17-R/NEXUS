"use client";

import React, { useState } from "react";
import { useMessages } from "@/context/funding/MessagesContext";
import { Search, Send, FileText, ChevronRight, MessageSquare, AlertCircle } from "lucide-react";
import { cn } from "@/lib/funding/utils";
import { Button } from "@/components/funding/ui/Button";

export function MessagesLayout() {
  const { conversations, activeConversation, messages, loading, sending, selectConversation, sendMessage } = useMessages();
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState("");

  const filtered = conversations.filter(c => 
    c.participants.some(p => p.name.toLowerCase().includes(search.toLowerCase())) ||
    c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleSend = async () => {
    if (!compose.trim()) return;
    await sendMessage(compose);
    setCompose("");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden h-[800px] max-h-[85vh] flex">
      {/* Left Panel: Conversation List */}
      <div className="w-1/3 shrink-0 border-r border-surface-200 flex flex-col bg-surface-50/50">
        <div className="p-4 border-b border-surface-200">
          <h2 className="text-lg font-bold text-surface-900 mb-4">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-surface-500 text-sm">
              No conversations found.
            </div>
          ) : (
            <div className="divide-y divide-surface-100">
              {filtered.map(conv => {
                const otherParticipant = conv.participants.find(p => p.role !== "admin");
                const isActive = activeConversation?.id === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={cn(
                      "w-full text-left p-4 hover:bg-surface-100 transition-colors flex gap-3",
                      isActive ? "bg-brand-50/50 border-l-2 border-brand-500" : "border-l-2 border-transparent"
                    )}
                  >
                    {otherParticipant?.avatar ? (
                      <img src={otherParticipant.avatar} alt="Avatar" className="w-10 h-10 rounded-full shrink-0 border border-surface-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-surface-200 shrink-0 flex items-center justify-center text-surface-500">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-sm text-surface-900 truncate pr-2">
                          {otherParticipant?.name || "Unknown"}
                        </span>
                        <span className="text-[10px] font-semibold text-surface-400 shrink-0">
                          {new Date(conv.lastMessageAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-surface-700 truncate mb-1">
                        {conv.subject}
                      </div>
                      <div className={cn("text-xs truncate", conv.unreadCount > 0 ? "font-semibold text-surface-900" : "text-surface-500")}>
                        {conv.lastMessagePreview}
                      </div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div className="w-2 h-2 rounded-full bg-brand-500 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Thread */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {activeConversation ? (
          <>
            {/* Thread Header */}
            <div className="px-6 py-4 border-b border-surface-200 flex justify-between items-center bg-white shrink-0">
              <div>
                <h3 className="font-bold text-surface-900">{activeConversation.subject}</h3>
                <div className="text-xs text-surface-500 flex items-center gap-2 mt-0.5">
                  <span className="font-semibold">{activeConversation.participants.find(p => p.role !== "admin")?.name}</span>
                  {activeConversation.relatedEntityId && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-surface-300" />
                      <a href={`/${activeConversation.relatedEntityType === "directPitch" ? "direct-pitches" : "grants/g1/applications"}/${activeConversation.relatedEntityId}`} className="text-brand-600 hover:underline flex items-center gap-1">
                        View {activeConversation.relatedEntityType === "directPitch" ? "Pitch" : "Application"}
                        <ChevronRight className="w-3 h-3" />
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="w-6 h-6 border-2 border-surface-200 border-t-brand-600 rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-surface-500 py-12">No messages in this conversation yet.</div>
              ) : (
                messages.map(msg => {
                  const isMe = msg.senderId === "usr_admin";
                  return (
                    <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                        isMe ? "bg-brand-600 text-white rounded-br-none" : "bg-surface-100 text-surface-900 rounded-bl-none"
                      )}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        <div className={cn(
                          "text-[10px] mt-2 flex justify-end gap-1 font-medium",
                          isMe ? "text-brand-200" : "text-surface-400"
                        )}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <span>• {msg.status}</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Composer */}
            <div className="p-4 border-t border-surface-200 bg-surface-50 shrink-0">
              <div className="flex gap-3">
                <textarea
                  className="flex-1 bg-white border border-surface-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500"
                  rows={2}
                  placeholder="Type your message..."
                  value={compose}
                  onChange={e => setCompose(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <Button 
                  variant="primary" 
                  className="shrink-0 self-end h-[46px] w-[46px] rounded-xl p-0 flex items-center justify-center"
                  onClick={handleSend}
                  disabled={!compose.trim() || sending}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-surface-400 p-8">
            <MessageSquare className="w-16 h-16 mb-4 text-surface-200" />
            <h3 className="text-lg font-bold text-surface-900 mb-1">Select a Conversation</h3>
            <p className="text-sm text-center">Choose a conversation from the left panel to view the thread and send replies.</p>
          </div>
        )}
      </div>
    </div>
  );
}
