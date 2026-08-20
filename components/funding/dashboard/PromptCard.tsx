"use client";

import React from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Avatar } from "@/components/funding/ui/Avatar";
import { Plus, Sparkles } from "lucide-react";

export function PromptCard() {
  const { org, setIsCreateGrantOpen } = useFundingOrg();

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-4 sm:p-5 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-smooth hover:border-surface-300">
      {/* Left: Avatar + Prompt text */}
      <div className="flex items-center gap-3.5">
        <Avatar
          src={org?.currentUser.avatar}
          name={org?.currentUser.name || "Dr. Rachel Vance"}
          size="md"
        />
        <div>
          <h3 className="text-sm font-bold text-surface-900 font-heading">
            Create &amp; Publish a Funding Grant Round
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">
            Click to configure allocation pools, eligibility criteria, and publish to the SkillForge community
          </p>
        </div>
      </div>

      {/* Right: Black rounded button matching screenshot */}
      <button
        onClick={() => setIsCreateGrantOpen(true)}
        className="inline-flex items-center justify-center gap-2 bg-[#0F172A] hover:bg-black text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-smooth shadow-sm shrink-0 active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Create Grant Round</span>
      </button>
    </div>
  );
}
