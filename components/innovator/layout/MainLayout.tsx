'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import TopHeader from '@/components/innovator/layout/TopHeader';
import Sidebar from '@/components/innovator/layout/Sidebar';
import clsx from 'clsx';
import { useApp } from '@/context/innovator/AppContext';
import { Toast } from '@/components/innovator/ui';

export default function InnovatorLayout({ children }: { children: React.ReactNode }) {
  const { toast, dismissToast } = useApp();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAuthPage = pathname?.includes('/login') || pathname?.includes('/register') || pathname?.includes('/profile-setup');

  if (isAuthPage) {
    return (
      <>
        {children}
        {toast && <Toast message={toast} onDismiss={dismissToast} />}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col antialiased text-slate-900">
      <TopHeader
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex flex-1 relative w-full">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        />

        <main
          className={clsx(
            'flex-1 w-full min-w-0 transition-all duration-300 ease-in-out',
            sidebarCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[280px]',
            'pl-0'
          )}
          id="main-content"
        >
          <div className="w-full transition-all duration-300 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
