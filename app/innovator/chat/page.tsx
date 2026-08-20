'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Circle, MessageSquare, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Avatar, Button, EmptyState } from '@/components/innovator/ui';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { conversations, messages, sendMessage, markConversationRead, activeCollaborations, currentUser } = useApp();
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0]?.id || null);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvIds = new Set(
    activeCollaborations.filter((c) => c.status === 'active').map((c) => c.chatId)
  );
  const activeConversations = conversations.filter((c) => activeConvIds.has(c.id));

  const selectedConversation = activeConversations.find((c) => c.id === selectedConvId);
  const currentMessages = selectedConvId ? messages[selectedConvId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  useEffect(() => {
    if (selectedConvId) markConversationRead(selectedConvId);
  }, [selectedConvId, markConversationRead]);

  const handleSend = () => {
    if (!input.trim() || !selectedConvId) return;
    sendMessage(selectedConvId, input.trim());
    setInput('');
  };

  const partner = selectedConversation?.participants.find((p) => p.userId !== currentUser.id);

  if (activeConversations.length === 0) {
    return (
      <div className="space-y-4 animate-fade-in">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Chat</h1>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState
            icon="💬"
            title="No active chats"
            description="Chat is only available for active collaborations. Accept or send a collaboration request to start chatting!"
            action={<Button variant="primary" size="sm">Go to Collaborate</Button>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Chat</h1>
      <p className="text-xs text-slate-500 -mt-2">Chat is enabled for active collaborations only</p>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversation List */}
          <div className={cn('w-full md:w-72 border-r border-slate-200 flex flex-col shrink-0', selectedConvId && 'hidden md:flex')}>
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Active Collaborations</h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeConversations.map((conv) => {
                const p = conv.participants.find((part) => part.userId !== currentUser.id);
                if (!p) return null;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConvId(conv.id)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors text-left',
                      selectedConvId === conv.id && 'bg-[#EFF7F2] border-l-2 border-l-emerald-600'
                    )}
                  >
                    <div className="relative shrink-0">
                      <Avatar src={p.avatar} name={p.name} size="md" />
                      {conv.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse-dot" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#0F172A] truncate">{p.name}</span>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold flex items-center justify-center shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.lastMessage && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5 font-medium">
                          {conv.lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Window */}
          {selectedConversation && partner ? (
            <div className={cn('flex-1 flex flex-col', !selectedConvId && 'hidden md:flex')}>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
                <button
                  className="md:hidden text-slate-500 hover:text-slate-700 mr-1"
                  onClick={() => setSelectedConvId(null)}
                  aria-label="Back to conversations"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <Avatar src={partner.avatar} name={partner.name} size="md" />
                  {selectedConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{partner.name}</h3>
                  <p className="text-[11px] font-semibold flex items-center gap-1">
                    {selectedConversation.isOnline ? (
                      <><Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> <span className="text-emerald-600">Online</span></>
                    ) : (
                      <span className="text-slate-400">Offline</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-bold text-slate-500">Start the conversation!</p>
                      <p className="text-xs text-slate-400 mt-1">Send a message to {partner.name}</p>
                    </div>
                  </div>
                ) : (
                  currentMessages.map((msg) => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={cn('flex gap-2', isMe && 'flex-row-reverse')}>
                        {!isMe && <Avatar src={partner.avatar} name={partner.name} size="xs" className="shrink-0 mt-1" />}
                        <div className={cn('max-w-[75%]', isMe && 'items-end flex flex-col')}>
                          <div
                            className={cn(
                              'px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                              isMe
                                ? 'bg-[#0F172A] text-white rounded-tr-sm'
                                : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                            )}
                          >
                            {msg.content}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 font-medium">
                            {new Date(msg.sentAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                  placeholder={`Message ${partner.name}...`}
                  className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
                />
                <Button variant="primary" size="md" leftIcon={<Send className="w-4 h-4" />} onClick={handleSend} aria-label="Send message">
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center text-center p-8">
              <div>
                <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                <h3 className="text-base font-extrabold text-slate-400">Select a conversation</h3>
                <p className="text-sm text-slate-400 mt-1">Choose a collaboration chat from the list</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

