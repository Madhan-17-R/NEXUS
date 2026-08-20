'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  Users,
  Zap,
  Sparkles,
} from 'lucide-react';
import { JobPost, WorkMode } from '@/types/talent';
import { toggleSaveJobPost, isJobSaved } from '@/lib/talent/firebase/api';
import clsx from 'clsx';

const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remote',
  on_site: 'On-site',
  hybrid: 'Hybrid',
};

const WORK_MODE_COLORS: Record<WorkMode, string> = {
  remote: 'bg-blue-50 text-blue-700 border border-blue-100',
  on_site: 'bg-slate-100 text-slate-700 border border-slate-200',
  hybrid: 'bg-purple-50 text-purple-700 border border-purple-100',
};

interface JobCardProps {
  job: JobPost;
  index?: number;
  isApplied: boolean;
  onApply: (job: JobPost) => void;
  onCollaborate: (job: JobPost) => void;
}

export default function JobCard({
  job,
  index = 0,
  isApplied,
  onApply,
  onCollaborate,
}: JobCardProps) {
  const [saved, setSaved] = useState(() => isJobSaved(job.id));
  const [expanded, setExpanded] = useState(false);

  const isCollab = job.type === 'innovator_post';

  const salaryText =
    job.salaryMin && job.salaryMax && job.salaryMin > 0
      ? `$${job.salaryMin.toLocaleString()} – $${job.salaryMax.toLocaleString()} / ${job.salaryUnit}`
      : isCollab
      ? 'Equity / Student Collab'
      : null;

  async function handleToggleSave() {
    const newSavedState = await toggleSaveJobPost(job.id);
    setSaved(newSavedState);
  }

  const staggerClass = `stagger-${Math.min(index + 1, 7)}`;

  return (
    <article
      className={clsx(
        'bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden animate-fade-in-up',
        staggerClass
      )}
    >
      <div className="p-5">
        {/* Top Row: Logo, Title, Badge, Compensation, Time */}
        <div className="flex items-start gap-3.5">
          {/* Avatar / Logo */}
          <div
            className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-xs"
            style={{ backgroundColor: job.companyColor }}
          >
            {job.companyInitials}
          </div>

          {/* Title & Organization */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 leading-snug">{job.title}</h3>

              {/* Category Badge */}
              {isCollab ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  {job.innovatorBadge || 'Innovator Collab'}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  <Zap className="w-3 h-3 text-sky-600" />
                  Company Job
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-slate-500">
              <span className="font-medium text-slate-800">{job.company}</span>
              {job.isVerified && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600 font-medium text-xs">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              <span className={clsx('text-[11px] font-semibold px-2 py-0.2 rounded-full', WORK_MODE_COLORS[job.workMode])}>
                {WORK_MODE_LABELS[job.workMode]}
              </span>
            </div>
          </div>

          {/* Compensation & Time (Desktop) */}
          <div className="flex-shrink-0 text-right hidden sm:block">
            {salaryText && (
              <p className="text-base font-bold text-emerald-700 whitespace-nowrap">{salaryText}</p>
            )}
            <p className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5">
              <Clock className="w-3 h-3" />
              {job.postedAgo}
            </p>
            {job.applicants !== undefined && (
              <p className="text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                <Users className="w-3 h-3" />
                {job.applicants} interested
              </p>
            )}
          </div>
        </div>

        {/* Mobile Compensation */}
        {salaryText && (
          <p className="sm:hidden text-base font-bold text-emerald-700 mt-2">{salaryText}</p>
        )}

        {/* Role Details */}
        <div className="mt-4">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-2">
            Role Details
          </p>
          <ul className="space-y-1.5">
            {(expanded ? job.roleDetails : job.roleDetails.slice(0, 3)).map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-[7px]" />
                {detail}
              </li>
            ))}
          </ul>
          {job.roleDetails.length > 3 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="text-xs text-emerald-700 font-semibold mt-2 flex items-center gap-1 hover:text-emerald-900 transition-colors"
            >
              {expanded ? (
                <><ChevronUp className="w-3.5 h-3.5" /> Show less</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> +{job.roleDetails.length - 3} more details</>
              )}
            </button>
          )}
        </div>

        {/* Skill Tag Chips */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {job.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 transition-colors cursor-default"
            >
              #{skill}
            </span>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isCollab ? 'Verified Innovator Post' : 'Verified Employer Listing'}
          </span>

          <div className="flex items-center gap-2">
            {/* Save / Bookmark Button */}
            <button
              id={`save-job-${job.id}`}
              onClick={handleToggleSave}
              aria-label={saved ? 'Unsave post' : 'Save post'}
              title={saved ? 'Remove from saved' : 'Save post'}
              className={clsx(
                'p-2 rounded-xl border transition-all',
                saved
                  ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                  : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600 hover:bg-slate-50'
              )}
            >
              {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Dynamic Action Button based on Post Type & Applied Status */}
            {isApplied ? (
              <span
                id={`applied-badge-${job.id}`}
                className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {isCollab ? 'Proposal Submitted' : 'Application Submitted'}
              </span>
            ) : isCollab ? (
              <button
                id={`collab-btn-${job.id}`}
                onClick={() => onCollaborate(job)}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                Collaborate
              </button>
            ) : (
              <button
                id={`apply-btn-${job.id}`}
                onClick={() => onApply(job)}
                className="inline-flex items-center gap-1.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-xs hover:shadow-md active:scale-95"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                Quick Apply
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}