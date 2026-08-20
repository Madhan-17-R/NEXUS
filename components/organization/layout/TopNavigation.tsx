"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, HelpCircle, ChevronDown, User, Briefcase, MessageSquare, Settings, LogOut, Menu, X } from "lucide-react";
import { authService } from "@/services/organization/firebase/auth";
import { profileService, CompanyProfile } from "@/services/organization/firebase/profile";

interface TopNavigationProps {
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export function TopNavigation({ onMenuToggle, sidebarOpen }: TopNavigationProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadProfile() {
      const data = await profileService.getProfile();
      setProfile(data);
    }
    loadProfile();
  }, []);

  const handleSignOut = async () => {
    await authService.logout();
    window.location.href = "/";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function getInitials(name: string) {
    return name ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : 'CO';
  }

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
        <Link href="/organization/dashboard" id="nav-logo" className="flex items-center gap-2 flex-shrink-0 group mr-2">
          <Image src="/skillforge-logo.png" alt="SkillForge Logo" width={140} height={40} className="object-contain" priority />
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-auto px-2 hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
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
          <button
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors hidden sm:flex"
            aria-label="Help"
            title="Help & Support"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications bell */}
          <Link
            href="/organization/notifications"
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
          </Link>

          {/* User Profile Pill */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen((v) => !v)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                {getInitials(profile?.name || "Company")}
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-800 leading-tight">
                  {profile ? profile.name : "Company"}
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  Company Account
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden md:block ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-scale-in z-50">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-sm font-bold text-slate-900">{profile ? profile.name : "Company"}</p>
                  <p className="text-xs text-slate-500 truncate">{profile ? profile.email : "user@company.com"}</p>
                  <span className="mt-1.5 inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Company Account
                  </span>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/organization/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <User className="w-4 h-4 text-emerald-600" /> Company Profile
                  </Link>
                  <Link
                    href="/organization/opportunities"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" /> My Recruitments
                  </Link>
                  <Link
                    href="/organization/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-emerald-600" /> Settings
                  </Link>

                  <div className="pt-1 mt-1 border-t border-slate-100">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
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
