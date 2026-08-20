'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, Sparkles, Landmark, DollarSign, Building2, Globe, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { mockFundingOrgs } from '@/data/innovator/mockUsers';
import { FundingOrganizationCard } from '@/components/innovator/ui/FundingOrganizationCard';
import { Tabs, EmptyState, Badge, Button } from '@/components/innovator/ui';
import { useApp } from '@/context/innovator/AppContext';
import { cn } from '@/lib/utils';
import type { Pitch } from '@/types/innovator';

const filterDomains = [
  'All', 'AI', 'Healthcare', 'FinTech', 'Sustainability', 'Education', 'IoT', 'Cybersecurity'
];

const mainTabs = [
  { id: 'discover', label: 'Discover Organizations' },
  { id: 'my-pitches', label: 'My Pitches & Applications' },
];

export default function FundingOrganizationsPage() {
  const { pitches } = useApp();
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');

  const filteredOrgs = useMemo(() => {
    return mockFundingOrgs.filter((org) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        org.name.toLowerCase().includes(q) ||
        org.description?.toLowerCase().includes(q) ||
        org.focusAreas.some((f) => f.toLowerCase().includes(q));

      const matchesDomain =
        selectedDomain === 'All' ||
        org.focusAreas.some((f) => f.toLowerCase().includes(selectedDomain.toLowerCase()));

      return matchesSearch && matchesDomain;
    });
  }, [searchQuery, selectedDomain]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
            <Landmark className="w-6 h-6 text-amber-600" />
            Funding Organizations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover funding institutions, apply for structured grants, or pitch directly to open orgs.
          </p>
        </div>

        <Tabs
          tabs={mainTabs.map((t) => ({
            ...t,
            count: t.id === 'discover' ? mockFundingOrgs.length : pitches.length,
          }))}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="pill"
        />
      </div>

      {/* ── DISCOVER ORGANIZATIONS TAB ── */}
      {activeTab === 'discover' && (
        <div className="space-y-5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search funding organizations by name, domain, or focus area..."
              className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
            />
          </div>

          {/* Domain Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
            {filterDomains.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0',
                  selectedDomain === domain
                    ? 'bg-[#0F172A] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                )}
              >
                {domain}
              </button>
            ))}
          </div>

          {/* Org Grid */}
          {filteredOrgs.length === 0 ? (
            <EmptyState
              icon="🔍"
              title="No funding organizations found"
              description="Try adjusting your search keywords or domain filter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrgs.map((org) => (
                <FundingOrganizationCard key={org.id} org={org} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MY PITCHES TAB ── */}
      {activeTab === 'my-pitches' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 font-medium flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-extrabold text-amber-900">Direct Pitches vs Grant Applications</p>
              <p className="text-amber-800 mt-0.5">
                Direct Pitches are submitted directly to funding organizations. Grant Applications are tied to specific grant listings.
              </p>
            </div>
          </div>

          {pitches.length === 0 ? (
            <EmptyState
              icon="💡"
              title="No submitted pitches yet"
              description="Select a funding organization that accepts direct pitches and click 'Pitch Your Idea'."
            />
          ) : (
            <div className="space-y-3">
              {pitches.map((pitch) => (
                <PitchCard key={pitch.id} pitch={pitch} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PitchCard({ pitch }: { pitch: Pitch }) {
  const isDirect = pitch.pitchType === 'Direct Pitch' || pitch.grantId === null;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-extrabold text-base text-[#0F172A]">{pitch.ideaTitle}</h3>
            <Badge variant={isDirect ? 'emerald' : 'blue'}>
              {isDirect ? 'Direct Pitch' : 'Grant Application'}
            </Badge>
            <Badge variant="amber">{pitch.stage}</Badge>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Recipient Org: <span className="text-[#0F172A] font-bold">{pitch.organizationName || 'Funding Organization'}</span>
            {!isDirect && pitch.grantTitle && (
              <span> • Grant: <span className="text-blue-700 font-bold">{pitch.grantTitle}</span></span>
            )}
          </p>
        </div>

        <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
          {pitch.status}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
        {pitch.problemStatement}
      </p>

      <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
        <span>Funding Requested: <strong className="text-slate-700">{pitch.fundingRequired}</strong></span>
        <span>Submitted: {pitch.createdAt}</span>
      </div>
    </div>
  );
}

