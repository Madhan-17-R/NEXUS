"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/funding/layout/AppLayout";
import { useMessages } from "@/context/funding/MessagesContext";
import { 
  Search, 
  Send, 
  Check, 
  CheckCheck, 
  User,
  Paperclip,
  MoreVertical,
  Bell,
  Archive,
  Info
} from "lucide-react";
import { cn } from "@/lib/funding/utils";

function formatDistanceToNow(dateInput: string | Date) {
  const diff = Date.now() - new Date(dateInput).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function formatDate(dateStr: string, formatStyle: "date" | "time") {
  const d = new Date(dateStr);
  if (formatStyle === "date") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function MessagesPage() {
  const { 
    conversations, 
    activeConversation, 
    messages, 
    loading, 
    sending,
    selectConversation, 
    sendMessage 
  } = useMessages();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [messageInput, setMessageInput] = useState("");

  const filteredConversations = conversations.filter(c => {
    const otherParticipant = c.participants.find(p => p.role !== 'admin');
    const nameMatch = otherParticipant?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const subjectMatch = c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || subjectMatch;
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() && !sending) {
      sendMessage(messageInput);
      setMessageInput("");
    }
  };

  const getOtherParticipant = (conv: typeof conversations[0]) => {
    return conv.participants.find(p => p.role !== 'admin') || conv.participants[0];
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-theme(spacing.24))] bg-white flex overflow-hidden border border-surface-200 rounded-xl m-6 shadow-sm">
        
        {/* Left Panel - Conversations List */}
        <div className="w-80 flex-shrink-0 border-r border-surface-200 flex flex-col bg-surface-50">
          <div className="p-4 border-b border-surface-200 bg-white">
            <h1 className="text-xl font-bold text-surface-900 mb-4">Messages</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input 
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-100 border border-transparent rounded-lg text-sm focus:bg-white focus:border-surface-300 focus:ring-2 focus:ring-surface-100 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading && !conversations.length ? (
              <div className="p-8 text-center text-surface-500 text-sm">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-surface-500 text-sm">No conversations found.</div>
            ) : (
              <div className="divide-y divide-surface-100">
                {filteredConversations.map(conv => {
                  const participant = getOtherParticipant(conv);
                  const isActive = activeConversation?.id === conv.id;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => selectConversation(conv.id)}
                      className={cn(
                        "w-full text-left p-4 hover:bg-surface-100 transition-colors relative",
                        isActive ? "bg-emerald-50/50" : "bg-white"
                      )}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600" />
                      )}
                      <div className="flex gap-3">
                        <div className="relative">
                          {participant.avatar ? (
                            <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover border border-surface-200" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center border border-surface-300">
                              <User className="w-5 h-5 text-surface-500" />
                            </div>
                          )}
                          {conv.unreadCount > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                              {conv.unreadCount}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                            <h3 className={cn("text-sm font-semibold truncate pr-2", conv.unreadCount > 0 ? "text-surface-900" : "text-surface-800")}>
                              {participant.name}
                            </h3>
                            <span className="text-[11px] text-surface-500 whitespace-nowrap">
                              {formatDistanceToNow(conv.lastMessageAt)}
                            </span>
                          </div>
                          <div className="text-xs text-surface-500 mb-1 flex items-center gap-1">
                            <span className="uppercase tracking-wider font-semibold text-[10px] text-surface-400">{participant.role}</span>
                            <span className="text-surface-300">•</span>
                            <span className="truncate">{conv.relatedEntityType}</span>
                          </div>
                          <p className={cn(
                            "text-xs truncate",
                            conv.unreadCount > 0 ? "text-surface-900 font-medium" : "text-surface-500"
                          )}>
                            {conv.lastMessagePreview}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="h-16 px-6 border-b border-surface-200 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-4">
                  {(() => {
                    const participant = getOtherParticipant(activeConversation);
                    return (
                      <>
                        {participant.avatar ? (
                          <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover border border-surface-200" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-surface-200 flex items-center justify-center border border-surface-300">
                            <User className="w-5 h-5 text-surface-500" />
                          </div>
                        )}
                        <div>
                          <h2 className="text-sm font-bold text-surface-900">{participant.name}</h2>
                          <div className="text-xs text-surface-500 flex items-center gap-2">
                            <span className="capitalize">{participant.role}</span>
                            <span>•</span>
                            <span className="text-emerald-600 font-medium">{activeConversation.relatedEntityId}</span>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-full transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-full transition-colors">
                    <Archive className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-full transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 bg-surface-50/50 flex flex-col gap-6">
                {loading && messages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-surface-500 text-sm">Loading messages...</div>
                ) : (
                  messages.map((msg, idx) => {
                    const isMe = msg.senderId === 'usr_admin';
                    const showDate = idx === 0 || new Date(messages[idx - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString();
                    
                    return (
                      <React.Fragment key={msg.id}>
                        {showDate && (
                          <div className="flex justify-center my-2">
                            <span className="text-[10px] font-semibold text-surface-400 bg-surface-200/50 px-3 py-1 rounded-full uppercase tracking-wider">
                              {formatDate(msg.timestamp, "date")}
                            </span>
                          </div>
                        )}
                        <div className={cn("flex max-w-[80%]", isMe ? "ml-auto justify-end" : "mr-auto justify-start")}>
                          <div className={cn(
                            "rounded-2xl px-4 py-2.5 shadow-sm text-[13px] leading-relaxed relative group",
                            isMe ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white border border-surface-200 text-surface-800 rounded-bl-sm"
                          )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <div className={cn(
                              "flex items-center gap-1 mt-1 text-[10px]",
                              isMe ? "text-emerald-100 justify-end" : "text-surface-400 justify-start"
                            )}>
                              <span>{formatDate(msg.timestamp, "time")}</span>
                              {isMe && (
                                <span>
                                  {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-surface-200 bg-white">
                <form onSubmit={handleSend} className="flex items-end gap-3">
                  <button type="button" className="p-2.5 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-full transition-colors shrink-0">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 bg-surface-100 border border-surface-200 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all relative">
                    <textarea 
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full max-h-32 min-h-[44px] bg-transparent resize-none outline-none px-4 py-3 text-sm text-surface-900"
                      rows={1}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSend(e);
                        }
                      }}
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!messageInput.trim() || sending}
                    className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center bg-surface-50 text-surface-400">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-surface-100">
                <Bell className="w-8 h-8 text-surface-300" />
              </div>
              <h3 className="text-lg font-semibold text-surface-600 mb-1">Your Inbox is Ready</h3>
              <p className="text-sm max-w-sm text-center text-surface-500">Select a conversation from the sidebar to view messages or start a new thread.</p>
            </div>
          )}
        </div>
        
      </div>
    </AppLayout>
  );
}
