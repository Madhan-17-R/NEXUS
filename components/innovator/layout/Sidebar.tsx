'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Layers,
  Briefcase,
  DollarSign,
  Users,
  MessageSquare,
  FolderKanban,
  Landmark,
  Bell,
  Search,
  User,
  Settings,
  LogIn,
  Lock,
  TrendingUp,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Avatar, Badge } from '@/components/innovator/ui';
import { cn } from '@/lib/utils';
import clsx from 'clsx';

const navItems = [
  { href: '/innovator/feed', label: 'Main Feed', icon: Layers, color: 'text-emerald-700' },
  { href: '/innovator/explore', label: 'Explore', icon: Search, color: 'text-blue-600' },
  { href: '/innovator/collaborate', label: 'Collaborate', icon: Users, color: 'text-violet-700' },
  { href: '/innovator/chat', label: 'Chat', icon: MessageSquare, color: 'text-teal-700' },
  { href: '/innovator/projects', label: 'My Projects', icon: FolderKanban, color: 'text-orange-700' },
  { href: '/innovator/funding-organizations', label: 'Funding Organizations', icon: Landmark, color: 'text-amber-700' },
  { href: '/innovator/notifications', label: 'Notifications', icon: Bell, color: 'text-red-600', badge: true },
];



interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({ open = false, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { currentUser, isLoggedIn, unreadNotificationCount } = useApp();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Mobile Backdrop (z-40 ensures it sits above navbar, below mobile sidebar at z-50) */}
      {open && (
        <div
          id="mobile-sidebar-backdrop"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/* Floating Rounded Sidebar Container */}
      <aside
        id="app-sidebar"
        className={clsx(
          // z-50 on mobile so it is fully interactive above backdrop; z-20 on desktop
          'fixed z-50 lg:z-20 flex flex-col bg-[#F0FDF4] border border-slate-200/90 shadow-xl lg:shadow-sm rounded-2xl md:rounded-3xl overflow-hidden',
          'transition-all duration-300 ease-in-out',
          // Floating positions
          'top-16 lg:top-[76px] left-3 lg:left-4 bottom-3 lg:bottom-4',
          // Mobile: always comfortable full width drawer (w-72); Desktop: w-20 (collapsed) vs w-64 (expanded)
          'w-72 max-w-[calc(100vw-1.5rem)]',
          collapsed ? 'lg:w-20' : 'lg:w-64',
          // Mobile slide-in / slide-out
          open ? 'translate-x-0 opacity-100 shadow-2xl' : '-translate-x-[calc(100%+2rem)] opacity-0 lg:opacity-100 lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="h-12 flex items-center justify-between px-3.5 border-b border-emerald-100/80 flex-shrink-0 bg-emerald-50/50">
          <span className={clsx(
            'text-[11px] font-bold tracking-wider text-emerald-900 uppercase px-1',
            collapsed && 'lg:hidden'
          )}>
            Navigation
          </span>

          {/* Desktop Collapse / Expand Toggle */}
          {onToggleCollapse && (
            <button
              id="sidebar-collapse-toggle"
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors hidden lg:flex items-center justify-center"
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {onClose && (
            <button
              id="sidebar-mobile-close"
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors lg:hidden flex items-center justify-center"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Navigation List */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-1">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={clsx(
                  'flex items-center rounded-xl transition-all group relative font-medium text-sm',
                  // Mobile: always expanded spacing; Desktop: collapsed vs expanded
                  'gap-3 px-3.5 py-2.5',
                  collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                  active
                    ? 'bg-[#DCFCE7] text-emerald-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50/90 hover:text-emerald-900'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    active ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  )}
                />
                <span className={clsx('flex-1 truncate', collapsed && 'lg:hidden')}>
                  {label}
                </span>
                {badge && unreadNotificationCount > 0 && (
                  <>
                    <span className={clsx(
                      'flex-shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs',
                      collapsed && 'lg:hidden'
                    )}>
                      {unreadNotificationCount > 9 ? '9+' : unreadNotificationCount}
                    </span>
                    {collapsed && (
                      <span className="hidden lg:block absolute top-2 right-2 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-2 ring-[#F0FDF4]" />
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3.5 border-t border-emerald-200/60" />

        {/* Bottom Nav Links: Settings */}
        <nav className="px-2.5 py-2.5 space-y-1 bg-emerald-50/30">
          {isLoggedIn ? (
            <Link
              href="/innovator/settings"
              onClick={onClose}
              title={collapsed ? 'Settings' : undefined}
              className={clsx(
                'flex items-center rounded-xl transition-all group font-medium text-sm',
                'gap-3 px-3.5 py-2.5',
                collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                isActive('/innovator/settings')
                  ? 'bg-[#DCFCE7] text-emerald-950 font-bold shadow-xs'
                  : 'text-slate-600 hover:bg-emerald-50/90 hover:text-emerald-900'
              )}
            >
              <Settings
                className={clsx(
                  'w-5 h-5 flex-shrink-0 transition-colors',
                  isActive('/innovator/settings') ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                )}
              />
              <span className={clsx('truncate', collapsed && 'lg:hidden')}>
                Settings
              </span>
            </Link>
          ) : (
            <div className={clsx(
              "bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm",
              collapsed && "hidden"
            )}>
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-extrabold text-[#0F172A]">Pre-Login Mode</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 mb-3">Sign in to submit innovation pitches or collaborate.</p>
              <Link
                href="/innovator/login"
                className="w-full bg-[#0F172A] text-white py-2 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                Login / Sign Up
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
