"use client";

import React, { useState } from "react";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import { formatCurrency } from "@/lib/funding/utils";
import { Grant } from "@/types/funding";
import {
  Award,
  CheckCircle2,
  DollarSign,
  Users,
  Clock,
  ArrowRight,
  Plus,
  Globe,
  Bot,
  Zap,
  Check,
  ShieldCheck,
} from "lucide-react";

export function GrantOverview() {
  const {
    grants,
    activeGrantTab,
    setActiveGrantTab,
    setSelectedGrant,
    setIsCreateGrantOpen,
    searchQuery,
    addToast,
  } = useFundingOrg();

  const filteredGrants = grants.filter((grant) => {
    if (activeGrantTab !== "All" && grant.stage.toLowerCase() !== activeGrantTab.toLowerCase()) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        grant.title.toLowerCase().includes(q) ||
        grant.code.toLowerCase().includes(q) ||
        grant.category.toLowerCase().includes(q) ||
        grant.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const getGrantIcon = (category: string) => {
    if (category.includes("Climate") || category.includes("CleanTech")) {
      return (
        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
          <Globe className="w-5 h-5" />
        </div>
      );
    }
    if (category.includes("Robotics") || category.includes("Hardware")) {
      return (
        <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 shrink-0">
          <Bot className="w-5 h-5" />
        </div>
      );
    }
    return (
      <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
        <Award className="w-5 h-5" />
      </div>
    );
  };

  return (
    <div className="space-y-4 mb-8">
      {/* Category Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-600" />
          <h3 className="text-lg font-bold text-surface-900 font-heading">
            Active Funding Programs &amp; Grant Rounds
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 bg-surface-200 text-surface-700 rounded-full">
            {grants.length} Total
          </span>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-100 p-1 rounded-xl border border-surface-200">
          {["All", "Active", "In Review", "Draft"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveGrantTab(tab)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-smooth ${
                activeGrantTab.toLowerCase() === tab.toLowerCase()
                  ? "bg-white text-surface-900 shadow-sm font-bold"
                  : "text-surface-600 hover:text-surface-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grant Cards List matching reference screenshot */}
      <div className="space-y-4">
        {filteredGrants.map((grant) => {
          const disbursedPercent = Math.round((grant.disbursed / grant.totalPool) * 100);

          return (
            <div
              key={grant.id}
              className="bg-white rounded-2xl border border-surface-200 p-5 sm:p-6 shadow-sm hover:border-surface-300 transition-smooth group"
            >
              {/* Top Header: Icon + Title + Type Badge + Organization / Posted Time + Money Pill */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  {getGrantIcon(grant.category)}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4
                        onClick={() => setSelectedGrant(grant)}
                        className="text-base sm:text-lg font-bold text-surface-900 group-hover:text-brand-600 transition-smooth cursor-pointer font-heading leading-snug"
                      >
                        {grant.title}
                      </h4>
                      <span className="bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0">
                        Funding Program
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-surface-500 font-medium">
                      <span>{grant.organizationName}</span>
                      <span>•</span>
                      <span>{grant.category}</span>
                      <span>•</span>
                      <span>{grant.postedTime}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Funding Pool Pill */}
                <div className="shrink-0 sm:text-right">
                  <span className="inline-block bg-[#D1FAE5] text-[#065F46] font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full border border-emerald-200/60">
                    {formatCurrency(grant.minAward)} – {formatCurrency(grant.maxAward)} / Grant
                  </span>
                  <div className="text-[11px] text-surface-400 font-medium mt-1">
                    Total Pool: {formatCurrency(grant.totalPool)} ({disbursedPercent}% deployed)
                  </div>
                </div>
              </div>

              {/* Body: PROGRAM DETAILS Box (matching screenshot's ROLE DETAILS box) */}
              <div className="bg-[#F8FAFC] rounded-xl p-4 border border-surface-100 my-4 space-y-2">
                <div className="text-[11px] font-bold text-surface-500 uppercase tracking-wider font-heading">
                  PROGRAM &amp; ELIGIBILITY CRITERIA
                </div>
                <ul className="space-y-1.5 text-xs text-surface-700">
                  {grant.eligibilityBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-600 mt-1.5 shrink-0" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags Row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {grant.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-surface-100 text-surface-700 text-xs font-semibold px-2.5 py-1 rounded-lg border border-surface-200/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Card Footer: Verified Listing + Action Buttons */}
              <div className="pt-3 border-t border-surface-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-surface-500 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Funding Organization Listing</span>
                  <span className="text-surface-300">•</span>
                  <span className="text-surface-600 font-semibold">{grant.applicationCount} applications received</span>
                  {grant.pendingReview > 0 && (
                    <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold border border-amber-200">
                      {grant.pendingReview} pending review
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedGrant(grant)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-surface-700 bg-surface-100 hover:bg-surface-200 transition-smooth"
                  >
                    Program Details
                  </button>

                  <button
                    onClick={() => {
                      addToast({
                        type: "info",
                        title: "Application Pipeline (Phase 4)",
                        message: `Viewing ${grant.applicationCount} submissions for ${grant.code}. Full review scoring workflow ready in Phase 4.`,
                      });
                      setSelectedGrant(grant);
                    }}
                    className="bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold px-5 py-2 rounded-xl transition-smooth flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Intake Active ({grant.applicationCount} Apps)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
