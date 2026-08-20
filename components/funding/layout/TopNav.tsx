"use client";

import Image from "next/image";
import React, { useRef, useState, useEffect } from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useNotifications } from "@/context/funding/NotificationsContext";
import { Avatar } from "@/components/funding/ui/Avatar";
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Zap,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/funding/utils";

interface TopNavProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export function TopNav({ onMenuToggle, sidebarOpen }: TopNavProps) {
  const {
    org,
    isNotificationsOpen,
    setIsNotificationsOpen,
    searchQuery,
    setSearchQuery,
    toggleDirectPitch,
    addToast,
  } = useFundingOrg();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    notifications,
    unreadCount: notifsUnreadCount,
    markAllAsRead,
    markAsRead
  } = useNotifications();
  
  const router = useRouter();
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setIsProfileMenuOpen(false);
    addToast({
      type: "success",
      title: "Signed Out",
      message: "You have been signed out successfully.",
    });
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center h-[60px] px-4 gap-3">
        {/* Mobile menu toggle */}
        <button
          id="nav-menu-toggle"
          type="button"
          onClick={onMenuToggle}
          className="p-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 text-slate-700 lg:hidden flex-shrink-0 cursor-pointer transition-transform active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Logo - NEVER overlapped */}
        <Link href="/funding/dashboard" id="nav-logo" className="flex items-center gap-2 flex-shrink-0 group mr-2">
          <Image src="/skillforge-logo.png" alt="SkillForge Logo" width={140} height={40} className="object-contain" priority />
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-auto px-2 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search innovators, applications, or keywords..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 placeholder:text-slate-400 transition-all"
            />
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Direct Pitch quick pill */}
          <button
            onClick={() => toggleDirectPitch(!org?.directPitchEnabled)}
            className={cn(
              "hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth",
              org?.directPitchEnabled
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-surface-100 text-surface-600 border-surface-200"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                org?.directPitchEnabled ? "bg-emerald-500 animate-pulse" : "bg-surface-400"
              )}
            />
            <span>Pitching: {org?.directPitchEnabled ? "Active" : "Paused"}</span>
          </button>

          <button
            onClick={() =>
              addToast({
                type: "info",
                title: "SkillForge Help Center",
                message: "Accessing Funding Organization onboarding guides & documentation.",
              })
            }
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors hidden sm:flex"
            aria-label="Help Center"
            title="Help Center"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors relative"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifsUnreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-rose-500 rounded-full ring-2 ring-white flex items-center justify-center text-[8px] text-white font-bold">
                  {notifsUnreadCount > 9 ? '9+' : notifsUnreadCount}
                </span>
              )}
            </button>

            {/* Flyout */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-surface-200 shadow-dropdown z-50 overflow-hidden animate-in zoom-in-95 duration-150">
                <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                  <span className="font-bold text-xs text-surface-900 font-heading">
                    Notifications &amp; Alerts
                  </span>
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-surface-100">
                  {notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => {
                        markAsRead(notif.id);
                        setIsNotificationsOpen(false);
                        if (notif.actionUrl) {
                          router.push(notif.actionUrl);
                        }
                      }}
                      className={cn(
                        "w-full text-left p-3 hover:bg-surface-50 transition-smooth flex items-start gap-2.5",
                        !notif.isRead && "bg-brand-50/20"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h5 className={cn("text-xs text-surface-900", !notif.isRead ? "font-bold" : "font-semibold")}>
                            {notif.title}
                          </h5>
                          {!notif.isRead && <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />}
                        </div>
                        <p className="text-[11px] text-surface-600 mt-0.5 leading-relaxed truncate whitespace-normal line-clamp-2">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-surface-400 mt-1 block font-semibold">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill (Avatar + Name + Role + Dropdown) */}
          <div className="relative ml-1" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              aria-expanded={isProfileMenuOpen}
              aria-haspopup="true"
            >
              <Avatar
                src={org?.currentUser.avatar}
                name={org?.currentUser.name || "Dr. Rachel Vance"}
                size="sm"
              />
              <div className="hidden md:flex flex-col items-start pr-2">
                <span className="text-sm font-semibold text-slate-800 leading-tight">
                  {org?.currentUser.name || "Dr. Rachel Vance"}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  {org?.currentUser.role || "Funding Organization"}
                </span>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-scale-in z-50">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {org?.currentUser.name || "Dr. Rachel Vance"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {org?.currentUser.role || "Funding Organization"}
                  </p>
                  <span className="mt-1.5 inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Funding Account
                  </span>
                </div>
                
                <div className="p-1.5 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      router.push("/funding/profile");
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    View Profile
                  </button>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
