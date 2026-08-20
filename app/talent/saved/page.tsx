'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Loader2 } from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import JobCard from '@/components/talent/jobs/JobCard';
import ApplyModal from '@/components/talent/jobs/ApplyModal';
import CollabModal from '@/components/talent/jobs/CollabModal';
import { useAuth } from '@/context/talent/AuthContext';
import { getSavedJobPosts } from '@/lib/talent/firebase/api';
import { JobPost } from '@/types/talent';

export default function SavedPage() {
  const { user, loading: authLoading, appliedJobIds, refreshAppliedJobs } = useAuth();
  const [savedPosts, setSavedPosts] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingJob, setApplyingJob] = useState<JobPost | null>(null);
  const [collaboratingJob, setCollaboratingJob] = useState<JobPost | null>(null);

  useEffect(() => {
    setLoading(true);
    getSavedJobPosts().then((data) => {
      setSavedPosts(data);
      setLoading(false);
    });
  }, []);

  function handleApplySuccess() {
    setApplyingJob(null);
    setCollaboratingJob(null);
    refreshAppliedJobs();
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Bookmark className="w-7 h-7 text-amber-500 fill-amber-500" />
              Saved Jobs & Collaborations
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Bookmarked postings saved for quick access ({savedPosts.length} items)
            </p>
          </div>

          <Link
            href="/talent/"
            className="text-xs sm:text-sm font-bold bg-[#0F172A] text-white px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
          >
            Browse All Feed
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xs">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-3">
              <Bookmark className="w-7 h-7 text-amber-500" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">No saved posts yet</h3>
            <p className="text-sm text-slate-500 max-w-xs mb-4">
              Click the bookmark icon on any job or collaboration post in the feed to save it here.
            </p>
            <Link
              href="/talent/"
              className="text-xs font-bold bg-emerald-600 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-xs"
            >
              Explore Opportunity Feed
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((job, idx) => (
              <JobCard
                key={job.id}
                job={job}
                index={idx}
                isApplied={appliedJobIds.has(job.id)}
                onApply={setApplyingJob}
                onCollaborate={setCollaboratingJob}
              />
            ))}
          </div>
        )}
      </div>

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          onClose={() => setApplyingJob(null)}
          onSuccess={handleApplySuccess}
        />
      )}

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