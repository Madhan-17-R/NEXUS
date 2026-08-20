'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, X } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Button, Avatar, EmptyState, Badge } from '@/components/innovator/ui';
import { getNotificationIcon, formatRelativeTime, cn } from '@/lib/utils';

export default function NotificationsPage() {
  const router = useRouter();
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayed = notifications.filter((n) => filter === 'all' || !n.isRead);

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationRead(notif.id);
    if (notif.actionUrl) {
      router.push(notif.actionUrl);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {unreadNotificationCount > 0
              ? `${unreadNotificationCount} unread notification${unreadNotificationCount > 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        {unreadNotificationCount > 0 && (
          <Button variant="ghost" size="sm" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as 'all' | 'unread')}
            className={cn(
              'px-4 py-1.5 rounded-xl text-xs font-bold transition-all',
              filter === f ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            )}
          >
            {f === 'all' ? 'All' : `Unread (${unreadNotificationCount})`}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="space-y-2">
        {displayed.length === 0 ? (
          <EmptyState icon="🎉" title="All caught up!" description="No new notifications right now. Check back later." />
        ) : (
          displayed.map((notif) => (
            <div
              key={notif.id}
              className={cn(
                'bg-white border rounded-2xl p-4 shadow-sm flex items-start gap-4 transition-all cursor-pointer hover:shadow-md',
                !notif.isRead ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200'
              )}
              onClick={() => handleNotificationClick(notif)}
            >
              {/* Icon or avatar */}
              <div className="shrink-0 mt-0.5">
                {notif.fromUser ? (
                  <div className="relative">
                    <Avatar src={notif.fromUser.avatar} name={notif.fromUser.name} size="md" />
                    <span className="absolute -bottom-1 -right-1 text-sm">{getNotificationIcon(notif.type)}</span>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xl">
                    {getNotificationIcon(notif.type)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn('text-sm leading-tight', !notif.isRead ? 'font-extrabold text-[#0F172A]' : 'font-bold text-slate-700')}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{notif.body}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {formatRelativeTime(notif.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

