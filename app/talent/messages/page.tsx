'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  CheckCheck,
  Building2,
  Users,
} from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import { useAuth } from '@/context/talent/AuthContext';
import { getConversations, sendDirectMessage } from '@/lib/talent/firebase/api';
import { Conversation } from '@/types/talent';
import clsx from 'clsx';

export default function MessagesPage() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('conv-1');
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) setActiveConvId(data[0].id);
      setLoading(false);
    });
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    setSending(true);
    const text = inputText.trim();
    setInputText('');

    try {
      const newMsg = await sendDirectMessage(activeConvId, text);
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === activeConvId) {
            return {
              ...c,
              lastMessage: text,
              lastMessageTime: 'Just now',
              messages: [...c.messages, newMsg],
            };
          }
          return c;
        })
      );
    } catch {
      setInputText(text);
    } finally {
      setSending(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full h-[calc(100vh-140px)] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-7 h-7 text-emerald-600" />
            Messages & Direct Inquiries
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Chat directly with verified recruiters and student innovator team leads
          </p>
        </div>

        {/* Split Pane Container */}
        {loading ? (
          <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl flex items-center justify-center shadow-xs">
            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        ) : (
          <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden flex flex-col md:flex-row">
            {/* Inbox List (Left) */}
            <div className="w-full md:w-80 border-r border-slate-200/80 flex flex-col bg-slate-50/50">
              <div className="p-3.5 border-b border-slate-200/80 bg-white">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                  Conversations ({conversations.length})
                </p>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={clsx(
                      'w-full p-3.5 text-left flex items-start gap-3 transition-colors hover:bg-slate-100/80',
                      activeConvId === conv.id && 'bg-emerald-50/80 border-l-4 border-emerald-600'
                    )}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {conv.participantAvatar}
                      </div>
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {conv.participantName}
                        </p>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">
                          {conv.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700 truncate">
                        {conv.companyOrProject}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Chat Window (Right) */}
            {activeConv ? (
              <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      {activeConv.participantAvatar}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {activeConv.participantName}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        {activeConv.participantRole.includes('Recruiter') ? (
                          <Building2 className="w-3 h-3 text-sky-600" />
                        ) : (
                          <Users className="w-3 h-3 text-emerald-600" />
                        )}
                        {activeConv.participantRole} · <span className="font-semibold text-slate-700">{activeConv.companyOrProject}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                  {activeConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={clsx(
                        'flex flex-col max-w-[80%]',
                        msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'
                      )}
                    >
                      <div
                        className={clsx(
                          'px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-2xs',
                          msg.isMe
                            ? 'bg-[#0F172A] text-white rounded-br-none'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 px-1">
                        {msg.timestamp}
                        {msg.isMe && <CheckCheck className="w-3 h-3 text-emerald-500" />}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSend} className="p-3 border-t border-slate-100 bg-white flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={`Message ${activeConv.participantName}...`}
                    className="flex-1 px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                               focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}