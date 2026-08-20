'use client';

import React, { useState } from 'react';
import { Briefcase, GraduationCap, DollarSign, Clock, MapPin, CheckCircle2, XCircle, AlertCircle, Star, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { StatusBadge, Tabs, EmptyState, Button, Avatar } from '@/components/innovator/ui';
import { cn } from '@/lib/utils';
import type { Application } from '@/types/innovator';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'job', label: 'Jobs' },
  { id: 'internship', label: 'Internships' },
  { id: 'grant', label: 'Grants' },
];

const statusOrder = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

export default function OpportunitiesPage() {
  const { applications } = useApp();
  const [activeTab, setActiveTab] = useState('all');

  const filtered = applications.filter((a) => activeTab === 'all' || a.postType === activeTab);

  const stats = {
    total: applications.length,
    active: applications.filter((a) => !['Selected', 'Rejected'].includes(a.status)).length,
    selected: applications.filter((a) => a.status === 'Selected').length,
    pending: applications.filter((a) => a.status === 'Under Review' || a.status === 'Shortlisted').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">My Opportunities</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track your applications and their statuses</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Applied', value: stats.total, icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
          { label: 'Under Review', value: stats.pending, icon: AlertCircle, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
          { label: 'Selected', value: stats.selected, icon: Star, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={cn('rounded-2xl p-4 border shadow-sm', bg)}>
            <Icon className={cn('w-4 h-4 mb-2', color)} />
            <p className="text-2xl font-extrabold text-[#0F172A]">{value}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs.map((t) => ({ ...t, count: t.id === 'all' ? applications.length : applications.filter((a) => a.postType === t.id).length }))}
        activeTab={activeTab}
        onChange={setActiveTab}
        variant="underline"
      />

      {/* Application list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No applications yet"
            description="Go to the feed and start applying to jobs, internships, and grants!"
          />
        ) : (
          filtered.map((app) => <ApplicationCard key={app.id} app={app} />)
        )}
      </div>
    </div>
  );
}

function ApplicationCard({ app }: { app: Application }) {
  const typeIcon = app.postType === 'job' ? Briefcase : app.postType === 'internship' ? GraduationCap : DollarSign;
  const TypeIcon = typeIcon;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-11 h-11 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
          {app.logo || '🏢'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-sm text-[#0F172A] truncate">{app.title}</h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{app.companyOrOrg} • {app.domain}</p>
            </div>
            <StatusBadge status={app.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500">
            {app.salary && (
              <span className="flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                {app.salary}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Applied: {app.appliedAt}
            </span>
            {app.updatedAt && (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                Updated: {app.updatedAt}
              </span>
            )}
          </div>

          {/* Status progress */}
          <ApplicationStatusProgress status={app.status} />
        </div>
      </div>
    </div>
  );
}

const statusSteps = ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected'];

function ApplicationStatusProgress({ status }: { status: Application['status'] }) {
  if (status === 'Rejected') {
    return (
      <div className="mt-3 flex items-center gap-2 text-xs text-red-600 font-semibold">
        <XCircle className="w-3.5 h-3.5" />
        Application not progressed
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(status);

  return (
    <div className="mt-3">
      <div className="flex items-center gap-0">
        {statusSteps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold border-2 transition-all',
                  idx < currentStep
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : idx === currentStep
                    ? 'bg-[#0F172A] border-[#0F172A] text-white'
                    : 'bg-white border-slate-300 text-slate-400'
                )}
              >
                {idx < currentStep ? '✓' : idx + 1}
              </div>
              <span className={cn('text-[9px] font-bold mt-1 hidden sm:block', idx <= currentStep ? 'text-slate-700' : 'text-slate-400')}>
                {step.split(' ')[0]}
              </span>
            </div>
            {idx < statusSteps.length - 1 && (
              <div
                className={cn('flex-1 h-0.5 mx-1 mb-3 transition-all', idx < currentStep ? 'bg-emerald-500' : 'bg-slate-200')}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

