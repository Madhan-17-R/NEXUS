"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { cn } from "@/lib/funding/utils";
import { usePathname, useRouter } from "next/navigation";
import { useMessages } from "@/context/funding/MessagesContext";
import {
  Layers,
  Briefcase,
  DollarSign,
  Award,
  Sparkles,
  CheckSquare,
  MessageSquare,
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ open = false, onClose, collapsed = false, onToggleCollapse }: SidebarProps) {
  const { org } = useFundingOrg();
  const { unreadCount: messagesUnreadCount } = useMessages();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      id: "feed",
      name: "Main Feed",
      icon: Layers,
      href: "/funding",
    },
    {
      id: "grants",
      name: "Funding Grants",
      icon: DollarSign,
      href: "/funding/grants",
      count: org?.activeGrantCount,
      countVariant: "emerald",
    },
    {
      id: "applications",
      name: "Application Pipeline",
      icon: Award,
      href: `/funding/grants/${pathname.startsWith("/funding/grants/") && pathname.split('/')[3] ? pathname.split('/')[3] : "grant_001"}/applications`,
      count: org?.pendingReviewCount,
      countVariant: "warning",
    },
    {
      id: "pitches",
      name: "Direct Pitches",
      icon: Sparkles,
      href: "/funding/direct-pitches",
      count: org?.incomingPitchesCount,
      countVariant: "purple",
    },
    {
      id: "reviews",
      name: "Review Queue",
      icon: CheckSquare,
      href: "/funding/reviews",
    },
    {
      id: "messages",
      name: "Messages & Alerts",
      icon: MessageSquare,
      href: "/funding/messages",
      count: messagesUnreadCount > 0 ? messagesUnreadCount : undefined,
      countVariant: "warning",
    },
  ];

  const isActive = (item: typeof navItems[0]) => {
    switch (item.id) {
      case "feed":
        return pathname === "/funding" || pathname === "/funding/";
      case "grants":
        return pathname === "/funding/grants" || (pathname.startsWith("/funding/grants/") && !pathname.includes("/applications"));
      case "applications":
        return pathname.includes("/applications");
      case "pitches":
        return pathname === "/funding/direct-pitches" || pathname.startsWith("/funding/direct-pitches/");
      case "reviews":
        return pathname === "/funding/reviews" || pathname.startsWith("/funding/reviews/");
      case "messages":
        return pathname === "/funding/messages" || pathname.startsWith("/funding/messages/");
      default:
        return false;
    }
  };

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
        className={cn(
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
          <span className={cn(
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
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
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
            const Icon = item.icon;
            const active = isActive(item);
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.href) {
                    router.push(item.href);
                    onClose?.();
                  }
                }}
                title={collapsed ? item.name : undefined}
                className={cn(
                  'w-full flex items-center rounded-xl transition-all group relative font-medium text-sm text-left',
                  'gap-3 px-3.5 py-2.5',
                  collapsed && 'lg:justify-center lg:px-2 lg:py-2.5',
                  active
                    ? 'bg-[#DCFCE7] text-emerald-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50/90 hover:text-emerald-900'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0 transition-colors',
                    active ? 'text-emerald-700' : 'text-slate-400 group-hover:text-emerald-600'
                  )}
                />
                <span className={cn('flex-1 truncate', collapsed && 'lg:hidden')}>
                  {item.name}
                </span>
                
                {typeof item.count === "number" && (
                  <>
                    <span className={cn(
                      'flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-xs',
                      collapsed && 'lg:hidden',
                      item.countVariant === "warning"
                        ? "bg-amber-100 text-amber-800"
                        : item.countVariant === "purple"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-600 text-white"
                    )}>
                      {item.count}
                    </span>
                    {collapsed && (
                      <span className={cn(
                        "hidden lg:block absolute top-2 right-2 w-2.5 h-2.5 rounded-full ring-2 ring-[#F0FDF4]",
                        item.countVariant === "warning"
                        ? "bg-amber-500"
                        : item.countVariant === "purple"
                        ? "bg-purple-500"
                        : "bg-emerald-600"
                      )} />
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-3.5 border-t border-emerald-200/60" />

        {/* Sidebar Footer: Organization verified badge */}
        <div className="px-2.5 py-2.5 bg-emerald-50/30">
          <div className={cn("bg-white rounded-xl p-3 border border-surface-200 shadow-sm text-xs", collapsed && "hidden lg:hidden")}>
            <div className="flex items-center gap-1.5 text-xs font-bold text-surface-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{org?.shortName || "Aegis Fund"}</span>
            </div>
            <div className="text-[11px] text-surface-500 mt-0.5">
              Funding Organization
            </div>
          </div>
          {collapsed && (
            <div className="hidden lg:flex w-full items-center justify-center p-2" title={org?.shortName || "Aegis Fund"}>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
