'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCheck,
  Loader2,
  MessageSquare,
  Sparkles,
  User,
  ClipboardList,
} from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import { useAuth } from '@/context/talent/AuthContext';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '@/lib/talent/firebase/api';
import { AppNotification } from '@/types/talent';
import clsx from 'clsx';

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    getNotifications().then((data) => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  async function handleMarkRead(id: string) {
    await markNotificationAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  async function handleMarkAllRead() {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered =
    activeTab === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Bell className="w-7 h-7 text-emerald-600" />
              Notifications & Alerts
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Stay updated on recruiter interview invites, proposal responses, and profile views ({unreadCount} unread)
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1.5 bg-slate-100/90 p-1 rounded-xl w-fit border border-slate-200/60">
          <button
            onClick={() => setActiveTab('all')}
            className={clsx(
              'text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all',
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={clsx(
              'text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all',
              activeTab === 'unread'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            )}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <Bell className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No notifications</h3>
            <p className="text-sm text-slate-500 max-w-xs">
              You&apos;re all caught up! Updates regarding your applications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => handleMarkRead(item.id)}
                className={clsx(
                  'p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer',
                  item.read
                    ? 'bg-white border-slate-200/80 text-slate-700 hover:shadow-xs'
                    : 'bg-emerald-50/50 border-emerald-200/90 text-slate-900 shadow-xs hover:shadow-sm'
                )}
              >
                <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                  {item.type === 'application' && <ClipboardList className="w-5 h-5 text-emerald-400" />}
                  {item.type === 'message' && <MessageSquare className="w-5 h-5 text-sky-400" />}
                  {item.type === 'match' && <Sparkles className="w-5 h-5 text-amber-400" />}
                  {item.type === 'system' && <User className="w-5 h-5 text-purple-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      {item.title}
                      {!item.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-200" />
                      )}
                    </h4>
                    <span className="text-xs text-slate-400 font-medium">
                      {item.timestamp}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.message}
                  </p>
                  {item.link && (
                    <Link
                      href={item.link}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 mt-2.5"
                    >
                      View Details →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}