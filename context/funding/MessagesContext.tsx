"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Conversation, Message } from "@/types/funding/messages";
import { messagesApi } from "@/lib/funding/firebase/messagesApi";
import { useAlert } from "./AlertContext";

interface MessagesContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  unreadCount: number;
  
  loadConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const { showError } = useAlert();

  const loadConversations = useCallback(async () => {
    setLoading(true);
    try {
      const convs = await messagesApi.getConversations();
      setConversations(convs);
    } catch (err: any) {
      showError("Unable to load messages", "We couldn't load your conversations right now.");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const selectConversation = useCallback(async (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId) || null;
    setActiveConversation(conv);
    if (!conv) return;

    setLoading(true);
    try {
      const msgs = await messagesApi.getMessages(conversationId);
      setMessages(msgs);
      if (conv.unreadCount > 0) {
        await markAsRead(conversationId);
      }
    } catch (err: any) {
      showError("Unable to load messages", "We couldn't load messages for this conversation.");
    } finally {
      setLoading(false);
    }
  }, [conversations, showError]);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversation) return;
    setSending(true);
    try {
      const newMsg = await messagesApi.sendMessage(activeConversation.id, content);
      setMessages(prev => [...prev, newMsg]);
      
      // Update conversations list
      setConversations(prev => prev.map(c => 
        c.id === activeConversation.id 
          ? { ...c, lastMessagePreview: content, lastMessageAt: newMsg.timestamp }
          : c
      ));
    } catch (err: any) {
      showError("Message not sent", "We couldn't send your message. Please try again.");
    } finally {
      setSending(false);
    }
  }, [activeConversation, showError]);

  const markAsRead = useCallback(async (conversationId: string) => {
    await messagesApi.markAsRead(conversationId);
    setConversations(prev => prev.map(c => 
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ));
    setMessages(prev => prev.map(m => 
      m.senderId !== "usr_admin" ? { ...m, status: "read" } : m
    ));
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const unreadCount = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <MessagesContext.Provider value={{
      conversations,
      activeConversation,
      messages,
      loading,
      sending,
      unreadCount,
      loadConversations,
      selectConversation,
      sendMessage,
      markAsRead
    }}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}
