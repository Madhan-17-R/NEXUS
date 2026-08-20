'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, Briefcase, Users, MessageSquare, FolderKanban, Search, Bell } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { cn } from '@/lib/utils';

const mobileNavItems = [
  { href: '/innovator/feed', label: 'Feed', icon: Layers },
  { href: '/innovator/explore', label: 'Explore', icon: Search },
  { href: '/innovator/opportunities', label: 'Jobs', icon: Briefcase },
  { href: '/innovator/collaborate', label: 'Connect', icon: Users },
  { href: '/innovator/notifications', label: 'Alerts', icon: Bell, badge: true },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { unreadNotificationCount } = useApp();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex md:hidden"
      aria-label="Mobile navigation"
    >
      {mobileNavItems.map(({ href, label, icon: Icon, badge }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[10px] font-bold transition-colors relative',
              isActive ? 'text-[#0F172A]' : 'text-slate-400'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={cn('relative p-1.5 rounded-lg transition-colors', isActive && 'bg-[#DCF2E4]')}>
              <Icon className={cn('w-5 h-5', isActive ? 'text-emerald-700' : 'text-slate-400')} />
              {badge && unreadNotificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 text-white text-[8px] font-extrabold flex items-center justify-center">
                  {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                </span>
              )}
            </div>
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
