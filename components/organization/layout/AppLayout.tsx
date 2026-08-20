'use client';

import React, { useState } from 'react';
import { TopNavigation } from '@/components/organization/layout/TopNavigation';
import { CompanySidebar } from '@/components/organization/layout/CompanySidebar';
import clsx from 'clsx';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col antialiased text-slate-900">
      {/* 1. Flush Top Navigation Header */}
      <TopNavigation
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      {/* 2. Body Area with Floating Sidebar & Fluid Main Content */}
      <div className="flex flex-1 relative w-full">
        {/* Floating Rounded Sidebar */}
        <CompanySidebar
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
          <div className="w-full transition-all duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
