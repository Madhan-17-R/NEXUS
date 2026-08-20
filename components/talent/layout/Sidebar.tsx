'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Bookmark,
  MessageSquare,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const MAIN_NAV: NavItem[] = [
  { id: 'main-feed',     label: 'Main Feed',          href: '/',                    icon: LayoutDashboard },
  { id: 'company-jobs',  label: 'Company Jobs',        href: '/?tab=company_jobs',    icon: Building2 },
  { id: 'collaborations',label: 'Innovator Collabs',   href: '/?tab=innovator_posts',  icon: Users },
  { id: 'applications',  label: 'Applied Jobs',        href: '/applications',        icon: ClipboardList },
  { id: 'saved',         label: 'Saved Posts',         href: '/saved',               icon: Bookmark },
  { id: 'messages',      label: 'Messages',            href: '/messages',            icon: MessageSquare, badge: 1 },
  { id: 'notifications', label: 'Notifications',       href: '/notifications',       icon: Bell,          badge: 2 },
];

const BOTTOM_NAV: NavItem[] = [
  { id: 'settings', label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  function isActive(href: string): boolean {
    if (href === '/') {
      return pathname === '/' && !tabParam;
    }
    if (href.startsWith('/?tab=')) {
      const targetTab = href.split('=')[1];
      return pathname === '/' && tabParam === targetTab;
    }
    return pathname.startsWith(href);
  }

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
          <button
            id="sidebar-collapse-toggle"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors hidden lg:flex items-center justify-center"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            id="sidebar-mobile-close"
            onClick={onClose}
            className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors lg:hidden flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Navigation List */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-1">
          {MAIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                id={`sidebar-${item.id}`}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
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
                  {item.label}
                </span>
                {item.badge && (
                  <>
                    {/* Badge text on mobile and expanded desktop */}
                    <span className={clsx(
                      'flex-shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs',
                      collapsed && 'lg:hidden'
                    )}>
                      {item.badge}
                    </span>
                    {/* Collapsed dot badge on desktop only */}
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
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                id={`sidebar-${item.id}`}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  'flex items-center rounded-xl transition-all group font-medium text-sm',
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
                <span className={clsx('truncate', collapsed && 'lg:hidden')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}