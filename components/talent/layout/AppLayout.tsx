'use client';

import React, { useState } from 'react';
import Navbar from '@/components/talent/layout/Navbar';
import Sidebar from '@/components/talent/layout/Sidebar';
import clsx from 'clsx';

interface AppLayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  containerClassName?: string;
}

export default function AppLayout({
  children,
  searchQuery = '',
  onSearchChange,
  containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8',
}: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col antialiased text-slate-900">
      {/* 1. Flush Top Navigation Header */}
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      {/* 2. Body Area with Floating Sidebar & Fluid Main Content */}
      <div className="flex flex-1 relative w-full">
        {/* Floating Rounded Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        {/* 3. Dynamic Fluid Main Content: automatically expands on sidebar collapse */}
        <main
          className={clsx(
            'flex-1 w-full min-w-0 transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[280px]',
            'pl-0'
          )}
        >
          <div className={clsx('w-full transition-all duration-300', containerClassName)}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}