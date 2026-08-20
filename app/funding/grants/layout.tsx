import type { Metadata } from "next";
import { FundingOrgProvider } from "@/context/funding/FundingOrgContext";
import { GrantsProvider } from "@/context/funding/GrantsContext";

export const metadata: Metadata = {
  title: "Grant Programs | SkillForge Funding Platform",
  description: "Create, manage, and monitor funding grant rounds for your organization.",
};

export default function GrantsLayout({ children }: { children: React.ReactNode }) {
  return (
    <FundingOrgProvider>
      <GrantsProvider>
        {children}
      </GrantsProvider>
    </FundingOrgProvider>
  );
}
