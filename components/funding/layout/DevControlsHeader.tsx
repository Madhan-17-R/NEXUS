"use client";

import React, { useState } from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { SkillForgeRole } from "@/types/funding";
import { Check } from "lucide-react";

export function DevControlsHeader() {
  const [activeRole, setActiveRole] = useState<SkillForgeRole>("Funding Organization");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { addToast } = useFundingOrg();

  const handleRoleChange = (role: SkillForgeRole) => {
    setActiveRole(role);
    addToast({
      type: "info",
      title: "Dev Role Switch",
      message: `Active view previewing role: ${role}. (Phase 1 focused on Funding Organization UX).`,
    });
  };

  return (
    <div className="bg-[#101928] text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b border-[#1E293B] select-none z-50 sticky top-0">
      {/* Left side: DEV CONTROLS badge & label */}
      <div className="flex items-center gap-2.5">
        <span className="bg-[#00D084] text-[#0B132B] font-extrabold text-[11px] px-2 py-0.5 rounded tracking-wide uppercase">
          DEV CONTROLS
        </span>
        <span className="text-surface-300 font-medium text-xs">
          Test Auth &amp; Role States:
        </span>
      </div>

      {/* Right side: State & Active Role selector */}
      <div className="flex items-center gap-4">
        {/* State Pill */}
        <div className="flex items-center gap-2">
          <span className="text-surface-400 text-xs font-medium">State:</span>
          <button
            onClick={() => {
              setIsLoggedIn(!isLoggedIn);
              addToast({
                type: isLoggedIn ? "warning" : "success",
                title: isLoggedIn ? "Auth State: LOGGED OUT" : "Auth State: LOGGED IN",
                message: isLoggedIn
                  ? "Simulating unauthenticated public applicant view."
                  : "Simulating authenticated Funding Organization workspace.",
              });
            }}
            className="bg-[#00D084] text-[#0B132B] font-extrabold text-[11px] px-2.5 py-0.5 rounded flex items-center gap-1 hover:brightness-105 transition-smooth"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            {isLoggedIn ? "LOGGED IN" : "GUEST / PUBLIC"}
          </button>
        </div>

        {/* Active Role Dropdown Pill */}
        <div className="flex items-center gap-2">
          <span className="text-surface-400 text-xs font-medium">Active Role:</span>
          <select
            value={activeRole}
            onChange={(e) => handleRoleChange(e.target.value as SkillForgeRole)}
            className="bg-[#0B132B] text-[#00D084] font-bold text-xs px-3 py-1 rounded border border-[#00D084]/40 focus:outline-none focus:ring-1 focus:ring-[#00D084] cursor-pointer"
          >
            <option value="Funding Organization">Funding Organization</option>
            <option value="Student Innovator">Student Innovator</option>
            <option value="Company Employer">Company Employer</option>
            <option value="Job Seeker">Job Seeker</option>
          </select>
        </div>
      </div>
    </div>
  );
}
