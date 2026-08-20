'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Building2, CheckCircle2, DollarSign } from 'lucide-react';
import { Button, Badge, Avatar } from '@/components/innovator/ui';
import type { FundingOrganization } from '@/types/innovator';
import { cn } from '@/lib/utils';

export function FundingOrganizationCard({ org }: { org: FundingOrganization }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shadow-sm shrink-0">
              {org.logo || '🌐'}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-[#0F172A] leading-tight">{org.name}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{org.orgType} • {org.location}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {org.description}
        </p>

        {/* Focus Domains */}
        <div className="mb-4">
          <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mb-1.5">
            Focus Domains
          </h4>
          <div className="flex flex-wrap gap-1">
            {org.focusAreas.map((domain, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200"
              >
                {domain}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            Grants Available: <strong className="text-[#0F172A]">{org.grantsCount || 1}</strong>
          </span>
          {org.acceptsDirectPitches ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-600" /> Direct Pitches Open
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
              Grants Only
            </span>
          )}
        </div>

        <Link href={`/funding-organizations/${org.id}`} className="block">
          <Button variant="outline" size="sm" className="w-full flex items-center justify-center gap-1.5 font-extrabold text-slate-800">
            View Organization <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

