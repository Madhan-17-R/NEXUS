"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText,
  Briefcase, 
  Users, 
  MessageSquare, 
  Bell, 
  Settings, 
  UserCircle 
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { profileService, CompanyProfile } from "@/services/organization/firebase/profile";

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function CompanySidebar({ open = false, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await profileService.getProfile();
      setProfile(data);
    }
    loadProfile();
  }, []);

  const navItems = [
    { name: "Dashboard", href: "/organization/dashboard", icon: LayoutDashboard },
    { name: "Posts", href: "/organization/posts", icon: FileText },
    { name: "Recruitments", href: "/organization/opportunities", icon: Briefcase },
    { name: "People", href: "/organization/people", icon: Users },
    { name: "Notifications", href: "/organization/notifications", icon: Bell, badge: 2 },
  ];

  const bottomItems = [
    { name: "Profile", href: "/organization/profile", icon: UserCircle },
    { name: "Settings", href: "/organization/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
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
          'fixed z-50 lg:z-20 flex flex-col bg-[#F0FDF4] border border-slate-200/90 shadow-xl lg:shadow-sm rounded-2xl md:rounded-3xl overflow-hidden',
          'transition-all duration-300 ease-in-out',
          'top-16 lg:top-[76px] left-3 lg:left-4 bottom-3 lg:bottom-4',
          'w-72 max-w-[calc(100vw-1.5rem)]',
          collapsed ? 'lg:w-20' : 'lg:w-64',
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
              onClick={onToggleCollapse}
              className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors hidden lg:flex items-center justify-center"
            >
              {collapsed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              )}
            </button>
          )}

          {/* Mobile Close Button */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100 transition-colors lg:hidden flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>

        {/* Main Navigation List */}
        <nav className="flex-1 px-2.5 py-3 overflow-y-auto space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.name : undefined}
                className={clsx(
                  'flex items-center rounded-xl transition-all group relative font-medium text-sm',
                  'gap-3 px-3.5 py-2.5',
                  collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                  isActive
                    ? 'bg-[#DCFCE7] text-emerald-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50/90 hover:text-emerald-900'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  )}
                />
                <span className={clsx('flex-1 truncate', collapsed && 'lg:hidden')}>
                  {item.name}
                </span>
                {item.badge && (
                  <>
                    <span className={clsx(
                      'flex-shrink-0 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs',
                      collapsed && 'lg:hidden'
                    )}>
                      {item.badge}
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

        {/* Bottom Nav Links */}
        <nav className="px-2.5 py-2.5 space-y-1 bg-emerald-50/30">
          {bottomItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                title={collapsed ? item.name : undefined}
                className={clsx(
                  'flex items-center rounded-xl transition-all group font-medium text-sm',
                  'gap-3 px-3.5 py-2.5',
                  collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                  isActive
                    ? 'bg-[#DCFCE7] text-emerald-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50/90 hover:text-emerald-900'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    isActive ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  )}
                />
                <span className={clsx('truncate', collapsed && 'lg:hidden')}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
