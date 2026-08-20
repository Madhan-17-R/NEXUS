'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Loader2,
  FileText,
  ExternalLink,
  Trash2,
  Clock,
  Building2,
  MapPin,
  ChevronRight,
  ClipboardList,
  Sparkles,
  Zap,
} from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import { useAuth } from '@/context/talent/AuthContext';
import { getUserApplications, withdrawApplication } from '@/lib/talent/firebase/api';
import {
  Application,
  ApplicationStatus,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/types/talent';
import clsx from 'clsx';

const STATUS_TABS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all',                label: 'All' },
  { value: 'submitted',          label: 'Submitted' },
  { value: 'under_review',       label: 'Under Review' },
  { value: 'shortlisted',        label: 'Shortlisted' },
  { value: 'interview_scheduled',label: 'Interview Scheduled' },
  { value: 'archived',           label: 'Archived' },
];

const STATUS_DOT_COLORS: Record<ApplicationStatus, string> = {
  submitted:           'bg-blue-400',
  under_review:        'bg-amber-400',
  shortlisted:        'bg-emerald-400',
  interview_scheduled: 'bg-purple-400',
  archived:            'bg-slate-400',
};

export default function ApplicationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'all'>('all');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/talent/auth/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoadingApps(true);
    getUserApplications(user.uid).then((apps) => {
      setApplications(apps);
      setLoadingApps(false);
    });
  }, [user]);

  async function handleWithdraw(appId: string) {
    if (!confirm('Withdraw this application? This cannot be undone.')) return;
    setWithdrawingId(appId);
    await withdrawApplication(appId);
    setApplications((prev) => prev.filter((a) => a.id !== appId));
    setWithdrawingId(null);
  }

  const filtered =
    activeTab === 'all'
      ? applications
      : applications.filter((a) => a.status === activeTab);

  const statusCounts = applications.reduce(
    (acc, a) => ({ ...acc, [a.status]: (acc[a.status] ?? 0) + 1 }),
    {} as Record<string, number>
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <ClipboardList className="w-7 h-7 text-emerald-600" />
            My Applications & Collaborations
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Track status for {applications.length} submitted job applications and innovator proposals
          </p>
        </div>

        {/* Status overview metric cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { label: 'Submitted',   status: 'submitted',           color: 'bg-blue-50 border-blue-200 text-blue-800',     dotColor: 'bg-blue-500' },
            { label: 'Under Review', status: 'under_review',        color: 'bg-amber-50 border-amber-200 text-amber-800',  dotColor: 'bg-amber-500' },
            { label: 'Shortlisted', status: 'shortlisted',         color: 'bg-emerald-50 border-emerald-200 text-emerald-800', dotColor: 'bg-emerald-500' },
            { label: 'Interview',   status: 'interview_scheduled',  color: 'bg-purple-50 border-purple-200 text-purple-800', dotColor: 'bg-purple-500' },
            { label: 'Archived',    status: 'archived',             color: 'bg-slate-100 border-slate-200 text-slate-600', dotColor: 'bg-slate-400' },
          ].map((s) => (
            <button
              key={s.status}
              id={`status-card-${s.status}`}
              onClick={() => setActiveTab(s.status as ApplicationStatus)}
              className={clsx(
                'border rounded-2xl p-4 text-left transition-all hover:shadow-xs',
                s.color,
                activeTab === s.status && 'ring-2 ring-emerald-500/40 shadow-xs'
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={clsx('w-2 h-2 rounded-full', s.dotColor)} />
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">{s.label}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-black">{statusCounts[s.status] ?? 0}</p>
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1 bg-slate-100/90 p-1 rounded-xl w-fit flex-wrap border border-slate-200/60">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              id={`app-tab-${tab.value}`}
              onClick={() => setActiveTab(tab.value)}
              className={clsx(
                'text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-all whitespace-nowrap',
                activeTab === tab.value
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              )}
            >
              {tab.label}
              {tab.value !== 'all' && statusCounts[tab.value] > 0 && (
                <span className="ml-1.5 bg-slate-200 text-slate-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {statusCounts[tab.value]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Application List Cards */}
        {loadingApps ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <FileText className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No applications in this view</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-4">
              Browse company jobs and innovator collabs to submit your proposals.
            </p>
            <Link
              href="/talent/"
              className="text-xs font-bold bg-[#0F172A] text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              Browse Opportunity Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app, idx) => (
              <article
                key={app.id}
                className={clsx(
                  'bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-all animate-fade-in-up p-5',
                  `stagger-${Math.min(idx + 1, 7)}`
                )}
              >
                <div className="flex items-start gap-4">
                  {/* Logo / Initials */}
                  {app.job && (
                    <div
                      className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-xs"
                      style={{ backgroundColor: app.job.companyColor }}
                    >
                      {app.job.companyInitials}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-base font-bold text-slate-900 leading-snug">
                            {app.job?.title ?? 'Position'}
                          </h3>
                          {app.type === 'collaboration' ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                              <Sparkles className="w-3 h-3" /> Collab Proposal
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.2 rounded-full bg-sky-50 text-sky-700">
                              <Zap className="w-3 h-3" /> Job Application
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
                          <span className="flex items-center gap-1 font-medium text-slate-800">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {app.job?.company ?? '—'}
                          </span>
                          {app.job?.location && (
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              {app.job.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status Pill */}
                      <span
                        className={clsx(
                          'inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border flex-shrink-0',
                          STATUS_COLORS[app.status]
                        )}
                      >
                        <span className={clsx('w-1.5 h-1.5 rounded-full', STATUS_DOT_COLORS[app.status])} />
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>

                    {/* Metadata row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Submitted {app.appliedAgo}
                      </span>
                      {app.resumeFileName && (
                        <span className="flex items-center gap-1 font-medium text-slate-700">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          {app.resumeFileName}
                        </span>
                      )}
                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Portfolio Link
                        </a>
                      )}
                    </div>

                    {/* Pitch snippet */}
                    {app.pitch && (
                      <div className="mt-3 text-xs text-slate-600 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 italic">
                        &quot;{app.pitch}&quot;
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <Link
                        href={`/?tab=${app.job?.type === 'innovator_post' ? 'innovator_posts' : 'company_jobs'}`}
                        id={`view-job-${app.id}`}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors"
                      >
                        View Post Details
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        id={`withdraw-${app.id}`}
                        onClick={() => handleWithdraw(app.id)}
                        disabled={withdrawingId === app.id}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors disabled:opacity-50 hover:bg-red-50 px-2.5 py-1 rounded-lg"
                      >
                        {withdrawingId === app.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5" />
                        )}
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}