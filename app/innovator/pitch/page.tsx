'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, Sparkles, ArrowRight } from 'lucide-react';
import { mockFundingOrgs } from '@/data/innovator/mockUsers';
import { Button, Badge } from '@/components/innovator/ui';

export default function GenericPitchRedirectPage() {
  const directPitchOrgs = mockFundingOrgs.filter((o) => o.acceptsDirectPitches);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in py-6">
      <div className="bg-gradient-to-br from-[#0F172A] via-slate-800 to-[#18202F] text-white rounded-3xl p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center justify-center mx-auto text-2xl">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">Direct Innovation Pitches</h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          On SkillForge, direct pitches are submitted directly to specific funding organizations that accept year-round proposals.
        </p>
        <Link href="/innovator/funding-organizations" className="inline-block pt-2">
          <Button variant="emerald" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Funding Organizations
          </Button>
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Landmark className="w-4 h-4 text-amber-600" />
          Organizations Currently Accepting Direct Pitches
        </h2>

        <div className="space-y-3">
          {directPitchOrgs.map((org) => (
            <div key={org.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-all">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shrink-0">
                  {org.logo || '🌱'}
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0F172A]">{org.name}</h3>
                  <p className="text-xs text-slate-500">{org.orgType} • {org.focusAreas.join(' · ')}</p>
                </div>
              </div>
              <Link href={`/innovator/funding-organizations`}>
                <Button variant="primary" size="xs" leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />}>
                  Pitch Idea
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

