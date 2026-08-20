"use client";

import React, { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Sidebar } from "./Sidebar";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { AppAlert } from "@/components/funding/ui/AppAlert";
import { cn } from "@/lib/funding/utils";


export function AppLayout({ children }: { children: ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useFundingOrg();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col antialiased text-slate-900 selection:bg-[#00D084] selection:text-[#0B132B]">
      {/* 1. Flush Top Navigation Header */}
      <TopNav
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
      />

      {/* 2. Body Area with Floating Sidebar & Fluid Main Content */}
      <div className="flex flex-1 relative w-full">
        {/* Floating Rounded Sidebar */}
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* 3. Dynamic Fluid Main Content: automatically expands on sidebar collapse */}
        <main
          className={cn(
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

      {/* Toast Feedback notifications */}
      <AppAlert />
    </div>
  );
}
