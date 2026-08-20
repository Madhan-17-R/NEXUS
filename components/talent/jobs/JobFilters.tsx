'use client';

import { useState } from 'react';
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  Sparkles,
  Briefcase,
  Globe,
} from 'lucide-react';
import { FeedFilters, JobType, WorkMode } from '@/types/talent';
import clsx from 'clsx';

const POPULAR_TAGS = [
  'ROS2',
  'C++',
  'LIDAR',
  'FullStack',
  'React',
  'Python',
  'AI/ML',
  'Kubernetes',
];

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'gig', label: 'Gig' },
  { value: 'contract', label: 'Contract' },
];

const WORK_MODES: { value: WorkMode; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'on_site', label: 'On-site' },
];

interface JobFiltersProps {
  filters: FeedFilters;
  onChange: (updated: Partial<FeedFilters>) => void;
}

export default function JobFilters({ filters, onChange }: JobFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleTag(tag: string) {
    const current = filters.activeTags;
    if (current.includes(tag)) {
      onChange({ activeTags: current.filter((t) => t !== tag) });
    } else {
      onChange({ activeTags: [...current, tag] });
    }
  }

  const activeCount =
    filters.activeTags.length +
    (filters.jobType ? 1 : 0) +
    (filters.workMode ? 1 : 0) +
    (filters.salaryMin > 0 ? 1 : 0);

  function clearAll() {
    onChange({ activeTags: [], jobType: '', workMode: '', salaryMin: 0 });
  }

  return (
    <div className="w-full">
      {/* Sleek Collapsible Toggle Button */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            id="toggle-filter-drawer"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className={clsx(
              'inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-xl text-sm font-medium transition-all shadow-sm',
              isOpen || activeCount > 0
                ? 'border-emerald-500/70 text-slate-900 ring-2 ring-emerald-500/10'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
            )}
          >
            <SlidersHorizontal
              className={clsx(
                'w-4 h-4 transition-colors',
                activeCount > 0 ? 'text-emerald-600' : 'text-slate-500'
              )}
            />
            <span>Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800 min-w-[20px]">
                {activeCount}
              </span>
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-slate-400 ml-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 ml-0.5" />
            )}
          </button>

          {/* Quick Clear Button outside when active */}
          {activeCount > 0 && !isOpen && (
            <button
              onClick={clearAll}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition-colors inline-flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Clear ({activeCount})
            </button>
          )}
        </div>

        {/* Active tags preview when closed */}
        {!isOpen && activeCount > 0 && (
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            {filters.activeTags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg inline-flex items-center gap-1"
              >
                #{tag}
                <button
                  onClick={() => toggleTag(tag)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {filters.jobType && (
              <span className="text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                {JOB_TYPES.find((j) => j.value === filters.jobType)?.label}
              </span>
            )}
            {filters.workMode && (
              <span className="text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg">
                {WORK_MODES.find((w) => w.value === filters.workMode)?.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expandable Accordion Filter Panel */}
      {isOpen && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm mt-3 animate-fade-in space-y-5">
          {/* Section 1: Skills & Tech */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Skills & Tech Stack
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_TAGS.map((tag) => {
                const active = filters.activeTags.includes(tag);
                return (
                  <button
                    key={tag}
                    id={`tag-filter-${tag.toLowerCase()}`}
                    onClick={() => toggleTag(tag)}
                    className={clsx(
                      'text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all',
                      active
                        ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800'
                    )}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {/* Section 2 & 3: Employment Type & Work Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Employment Type */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Employment Type
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((jt) => {
                  const active = filters.jobType === jt.value;
                  return (
                    <button
                      key={jt.value}
                      id={`jobtype-filter-${jt.value}`}
                      onClick={() =>
                        onChange({
                          jobType: filters.jobType === jt.value ? '' : jt.value,
                        })
                      }
                      className={clsx(
                        'text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all',
                        active
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800'
                      )}
                    >
                      {jt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Work Mode */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Globe className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Work Mode
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {WORK_MODES.map((wm) => {
                  const active = filters.workMode === wm.value;
                  return (
                    <button
                      key={wm.value}
                      id={`workmode-filter-${wm.value}`}
                      onClick={() =>
                        onChange({
                          workMode:
                            filters.workMode === wm.value ? '' : wm.value,
                        })
                      }
                      className={clsx(
                        'text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all',
                        active
                          ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-800'
                      )}
                    >
                      {wm.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel Footer: Status & Clear All */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-medium">
              {activeCount > 0
                ? `${activeCount} filter${activeCount > 1 ? 's' : ''} applied`
                : 'No active filters'}
            </span>

            <div className="flex items-center gap-3">
              {activeCount > 0 && (
                <button
                  id="clear-all-filters"
                  onClick={clearAll}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors inline-flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-1.5 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}