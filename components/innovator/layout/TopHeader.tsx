'use client';

import Image from "next/image";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  HelpCircle,
  LogOut,
  Zap,
  ChevronDown,
  Settings,
  User,
  Menu,
  X,
} from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Avatar } from '@/components/innovator/ui';

interface TopHeaderProps {
  desktopSidebarOpen?: boolean;
  mobileMenuOpen?: boolean;
  onToggleSidebar?: () => void;
  onMobileMenuToggle?: () => void;
  onMenuToggle?: () => void;
  sidebarOpen?: boolean;
}

export default function TopHeader({
  desktopSidebarOpen = true,
  mobileMenuOpen = false,
  onToggleSidebar,
  onMobileMenuToggle,
  onMenuToggle,
  sidebarOpen,
}: TopHeaderProps) {
  const router = useRouter();
  const { currentUser, isLoggedIn, logout, unreadNotificationCount } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleToggle = onMenuToggle || onToggleSidebar || onMobileMenuToggle;
  const isNavVisible = sidebarOpen || desktopSidebarOpen || mobileMenuOpen;

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-slate-200/80 shadow-sm">
      <div className="flex items-center h-[60px] px-4 gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={handleToggle}
          className="p-2 rounded-xl hover:bg-slate-100 active:bg-slate-200 text-slate-700 lg:hidden flex-shrink-0 cursor-pointer transition-transform active:scale-95"
          aria-label={isNavVisible ? 'Close navigation' : 'Open navigation'}
        >
          {sidebarOpen || mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Brand Logo - NEVER overlapped */}
        <Link href="/innovator/feed" className="flex items-center gap-2 flex-shrink-0 group mr-2">
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
              placeholder="Search company roles, skills (ROS2, Welding), or funding grants..."
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

          {isLoggedIn ? (
            <>
              {/* Notifications bell */}
              <Link
                href="/innovator/notifications"
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors relative"
                aria-label={`Notifications (${unreadNotificationCount} unread)`}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
                )}
              </Link>

              {/* User profile pill */}
              <div className="relative ml-1">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  aria-expanded={showUserMenu}
                >
                  <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-semibold text-slate-800 leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      Innovator
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform hidden md:block ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-scale-in z-50">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">{currentUser.role}</p>
                        <span className="mt-1.5 inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Innovator Account
                        </span>
                      </div>

                      <div className="p-1.5 space-y-0.5">
                        <Link
                          href="/innovator/profile"
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4 text-emerald-600" /> My Profile
                        </Link>

                        <div className="pt-1 mt-1 border-t border-slate-100">
                          <button
                            onClick={() => {
                              logout();
                              setShowUserMenu(false);
                              window.location.href = '/';
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link
                href="/innovator/login"
                className="text-sm font-semibold text-slate-700 px-3 py-1.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
