'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, SearchX, Lightbulb, Briefcase, Sparkles } from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import JobCard from '@/components/talent/jobs/JobCard';
import JobFilters from '@/components/talent/jobs/JobFilters';
import ApplyModal from '@/components/talent/jobs/ApplyModal';
import CollabModal from '@/components/talent/jobs/CollabModal';
import { useAuth } from '@/context/talent/AuthContext';
import { getJobPosts } from '@/lib/talent/firebase/api';
import { JobPost, FeedFilters } from '@/types/talent';

const DEFAULT_FILTERS: FeedFilters = {
  query: '',
  activeTab: 'all',
  activeTags: [],
  jobType: '',
  workMode: '',
  salaryMin: 0,
};

function FeedContent() {
  const { user, loading: authLoading, appliedJobIds, refreshAppliedJobs } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab');

  const [filters, setFilters] = useState<FeedFilters>(DEFAULT_FILTERS);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [applyingJob, setApplyingJob] = useState<JobPost | null>(null);
  const [collaboratingJob, setCollaboratingJob] = useState<JobPost | null>(null);
  const [justApplied, setJustApplied] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (tabParam === 'company_jobs' || tabParam === 'innovator_posts') {
      setFilters((prev) => ({ ...prev, activeTab: tabParam }));
    } else if (tabParam === null) {
      setFilters((prev) => ({ ...prev, activeTab: 'all' }));
    }
  }, [tabParam]);

  const fetchJobs = useCallback(async () => {
    setLoadingJobs(true);
    const data = await getJobPosts(filters);
    setJobs(data);
    setLoadingJobs(false);
  }, [filters]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/talent/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  function handleFilterChange(updated: Partial<FeedFilters>) {
    setFilters((prev) => ({ ...prev, ...updated }));
  }

  function handleSearchChange(q: string) {
    setFilters((prev) => ({ ...prev, query: q }));
  }

  function handleApplySuccess(jobId: string) {
    setJustApplied((prev) => new Set(prev).add(jobId));
    setApplyingJob(null);
    setCollaboratingJob(null);
    refreshAppliedJobs();
  }

  function isApplied(jobId: string): boolean {
    return appliedJobIds.has(jobId) || justApplied.has(jobId);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          <span className="text-sm font-semibold">Loading SkillForge Job Seeker Feed…</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout
      searchQuery={filters.query}
      onSearchChange={handleSearchChange}
      containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="w-full space-y-6">
        {/* Header Title & Applications CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Briefcase className="w-7 h-7 text-emerald-600" />
              Main Opportunity Feed
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Explore verified employer job openings and student innovator collaboration projects.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="/talent/applications"
              id="view-applications-btn"
              className="text-xs sm:text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              My Applications ({appliedJobIds.size}) →
            </a>
          </div>
        </div>

        {/* Filter Tabs & Tags */}
        <div>
          <JobFilters filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Job Listings: Fluid Width Cards */}
        {loadingJobs ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-xs h-48 animate-pulse p-6 space-y-3"
              >
                <div className="h-6 bg-slate-200 rounded-md w-2/3" />
                <div className="h-4 bg-slate-100 rounded-md w-1/3" />
                <div className="h-12 bg-slate-100 rounded-md w-full mt-4" />
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <SearchX className="w-7 h-7 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No matching opportunities found</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              Try clearing your skill tags or search terms to see all available jobs and collabs.
            </p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="mt-4 text-xs font-bold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, idx) => (
              <JobCard
                key={job.id}
                job={job}
                index={idx}
                isApplied={isApplied(job.id)}
                onApply={setApplyingJob}
                onCollaborate={setCollaboratingJob}
              />
            ))}

            <div className="flex items-center justify-center gap-3 py-6 text-slate-300">
              <div className="h-px bg-slate-200 flex-1" />
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Lightbulb className="w-3.5 h-3.5 text-emerald-500" />
                You&apos;ve viewed all {jobs.length} relevant listings
              </div>
              <div className="h-px bg-slate-200 flex-1" />
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal for Company Jobs */}
      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={handleApplySuccess}
        />
      )}

      {/* Collaboration Modal for Innovator Posts */}
      {collaboratingJob && (
        <CollabModal
          job={collaboratingJob}
          onClose={() => setCollaboratingJob(null)}
          onSuccess={handleApplySuccess}
        />
      )}
    </AppLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <FeedContent />
    </Suspense>
  );
}