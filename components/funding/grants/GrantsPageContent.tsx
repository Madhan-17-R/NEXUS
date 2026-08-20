"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { AppLayout } from "@/components/funding/layout/AppLayout";
import { useGrants } from "@/context/funding/GrantsContext";
import { GrantCard } from "@/components/funding/grants/GrantCard";
import { GrantDetailPanel } from "@/components/funding/grants/GrantDetailPanel";
import { CreateGrantWizard } from "@/components/funding/grants/CreateGrantWizard";
import { CloseGrantModal, DuplicateGrantModal, PublishSuccessModal } from "@/components/funding/grants/GrantModals";
import { Button } from "@/components/funding/ui/Button";
import { Badge } from "@/components/funding/ui/Badge";
import { FullGrant, GrantStatus } from "@/types/funding";
import { GrantFilterTab } from "@/context/funding/GrantsContext";
import { cn } from "@/lib/funding/utils";
import {
  Plus, Search, SlidersHorizontal, ArrowUpDown,
  LayoutGrid, List, RefreshCw, DollarSign, Users,
  Clock, CheckCircle, ChevronDown, X, Filter
} from "lucide-react";

// ─── Filter Tabs ───────────────────────────────────────────────────────────────

const FILTER_TABS: { id: GrantFilterTab; label: string; badge?: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "draft", label: "Draft" },
  { id: "in_review", label: "In Review" },
  { id: "closing_soon", label: "Closing Soon" },
  { id: "closed", label: "Closed" },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "oldest", label: "Oldest" },
  { id: "deadline_soonest", label: "Deadline Soonest" },
  { id: "most_applications", label: "Most Applications" },
  { id: "highest_pool", label: "Highest Funding Pool" },
];

const DOMAIN_FILTER_OPTIONS = [
  "AI & Machine Learning", "HealthTech & BioAI", "Climate & CleanTech",
  "Robotics & Hardware", "Web3 & Security", "AgriTech & Food",
  "Education", "FinTech", "Social Innovation"
];

// ─── GrantsPageContent ─────────────────────────────────────────────────────────

export function GrantsPageContent() {
  const {
    grants, loading, filterTab, searchQuery, sortOption,
    loadGrants, setFilterTab, setSearchQuery, setSortOption,
    selectGrant, selectedGrant, openCreateWizard, wizardOpen,
    closeConfirmGrant, duplicateConfirmGrant, publishSuccess
  } = useGrants();

  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [domainFilter, setDomainFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const sortRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Initial load + reactive reload
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { loadGrants(); }, [filterTab, searchQuery, sortOption]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Client-side domain filter on top of server filter
  const displayedGrants = domainFilter.length > 0
    ? grants.filter(g => domainFilter.includes(g.domain))
    : grants;

  const tabCounts = FILTER_TABS.reduce((acc, tab) => {
    if (tab.id === "all") acc[tab.id] = grants.length;
    else if (tab.id === "closing_soon") acc[tab.id] = grants.filter(g => g.daysLeft > 0 && g.daysLeft <= 14).length;
    else acc[tab.id] = grants.filter(g => g.status === tab.id as GrantStatus).length;
    return acc;
  }, {} as Record<string, number>);

  const currentSort = SORT_OPTIONS.find(s => s.id === sortOption)?.label ?? "Sort";

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-black text-surface-900 tracking-tight">Grant Programs</h1>
            <p className="text-sm text-surface-500 mt-1">
              Create, manage, and monitor your organization&apos;s funding opportunities.
            </p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateWizard}
            id="create-grant-cta"
          >
            Create Grant Round
          </Button>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            {
              icon: DollarSign,
              label: "Total Active Grants",
              value: String(grants.filter(g => g.status === "active").length),
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              icon: Users,
              label: "Total Applications",
              value: String(grants.reduce((s, g) => s + g.applicationCount, 0)),
              color: "text-sky-600 bg-sky-50",
            },
            {
              icon: Clock,
              label: "Closing Soon",
              value: String(grants.filter(g => g.daysLeft > 0 && g.daysLeft <= 14).length),
              color: "text-amber-600 bg-amber-50",
            },
            {
              icon: CheckCircle,
              label: "Drafts",
              value: String(grants.filter(g => g.status === "draft").length),
              color: "text-surface-500 bg-surface-100",
            },
          ].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-xl border border-surface-200 p-3 flex items-center gap-3 shadow-sm">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", kpi.color)}>
                <kpi.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-xs text-surface-500">{kpi.label}</div>
                <div className="text-xl font-black text-surface-900">{kpi.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter / Search / Sort Bar */}
      <div className="bg-white rounded-2xl border border-surface-200 shadow-sm mb-4 overflow-hidden">
        {/* Tab Bar */}
        <div className="flex items-center gap-0 border-b border-surface-200 overflow-x-auto px-2 pt-2">
          {FILTER_TABS.map(tab => {
            const count = tabCounts[tab.id] ?? 0;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-smooth",
                  filterTab === tab.id
                    ? "border-surface-900 text-surface-900"
                    : "border-transparent text-surface-500 hover:text-surface-800 hover:bg-surface-50"
                )}
                id={`tab-${tab.id}`}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                    filterTab === tab.id
                      ? "bg-surface-900 text-white"
                      : "bg-surface-100 text-surface-500"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search + Controls */}
        <div className="flex items-center gap-2 p-3">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search grant programs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-surface-300 bg-surface-50 text-sm text-surface-900 pl-9 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:bg-white focus:border-brand-400 transition-smooth placeholder:text-surface-400"
              id="grants-search"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Domain Filter */}
          <div ref={filterRef} className="relative shrink-0">
            <Button
              variant={domainFilter.length > 0 ? "secondary" : "outline"}
              size="sm"
              leftIcon={<Filter className="w-3.5 h-3.5" />}
              rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
              onClick={() => setFilterOpen(v => !v)}
              id="grants-filter-btn"
            >
              {domainFilter.length > 0 ? `${domainFilter.length} Filter${domainFilter.length > 1 ? "s" : ""}` : "Filter"}
            </Button>
            {filterOpen && (
              <div className="absolute right-0 top-10 z-20 w-64 bg-white rounded-xl border border-surface-200 shadow-xl p-3">
                <div className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-2">Domain</div>
                <div className="space-y-1 max-h-52 overflow-y-auto">
                  {DOMAIN_FILTER_OPTIONS.map(d => (
                    <label key={d} className="flex items-center gap-2 text-sm text-surface-700 cursor-pointer hover:text-surface-900 py-1 px-1 rounded hover:bg-surface-50 transition-smooth">
                      <input
                        type="checkbox"
                        checked={domainFilter.includes(d)}
                        onChange={e => {
                          setDomainFilter(prev =>
                            e.target.checked ? [...prev, d] : prev.filter(x => x !== d)
                          );
                        }}
                        className="accent-brand-600 w-3.5 h-3.5 rounded"
                      />
                      {d}
                    </label>
                  ))}
                </div>
                {domainFilter.length > 0 && (
                  <button
                    onClick={() => setDomainFilter([])}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold mt-2 w-full text-left"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Sort */}
          <div ref={sortRef} className="relative shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowUpDown className="w-3.5 h-3.5" />}
              rightIcon={<ChevronDown className="w-3.5 h-3.5" />}
              onClick={() => setSortOpen(v => !v)}
              id="grants-sort-btn"
            >
              <span className="hidden sm:inline">{currentSort}</span>
              <span className="sm:hidden">Sort</span>
            </Button>
            {sortOpen && (
              <div className="absolute right-0 top-10 z-20 w-52 bg-white rounded-xl border border-surface-200 shadow-xl py-1">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => { setSortOption(opt.id as any); setSortOpen(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm transition-smooth",
                      sortOption === opt.id
                        ? "bg-surface-900 text-white font-semibold"
                        : "text-surface-700 hover:bg-surface-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="hidden sm:flex items-center border border-surface-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn("p-2 transition-smooth", viewMode === "grid" ? "bg-surface-900 text-white" : "text-surface-400 hover:text-surface-700 hover:bg-surface-50")}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn("p-2 transition-smooth", viewMode === "list" ? "bg-surface-900 text-white" : "text-surface-400 hover:text-surface-700 hover:bg-surface-50")}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={() => loadGrants()}
            className="p-2 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-smooth"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4", loading ? "animate-spin" : "")} />
          </button>
        </div>
      </div>

      {/* Active filter pills */}
      {(domainFilter.length > 0 || searchQuery) && (
        <div className="flex flex-wrap gap-2 mb-3">
          {searchQuery && (
            <span className="flex items-center gap-1.5 text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-full">
              Search: &quot;{searchQuery}&quot;
              <button onClick={() => setSearchQuery("")}><X className="w-3 h-3" /></button>
            </span>
          )}
          {domainFilter.map(d => (
            <span key={d} className="flex items-center gap-1.5 text-xs font-medium bg-surface-100 text-surface-700 border border-surface-200 px-2.5 py-1 rounded-full">
              {d}
              <button onClick={() => setDomainFilter(prev => prev.filter(x => x !== d))}><X className="w-3 h-3" /></button>
            </span>
          ))}
          <button
            onClick={() => { setSearchQuery(""); setDomainFilter([]); }}
            className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Grant Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-surface-200 h-64 animate-pulse" />
          ))}
        </div>
      ) : displayedGrants.length === 0 ? (
        <div className="bg-white rounded-2xl border border-surface-200 p-12 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 bg-surface-100 rounded-2xl flex items-center justify-center">
            <Search className="w-7 h-7 text-surface-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-surface-900">No grants found</h3>
            <p className="text-sm text-surface-500 mt-1">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search or clear filters.`
                : "No grants match the selected filter. Create a new grant to get started."}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />} onClick={openCreateWizard}>
              Create Grant Round
            </Button>
            {(searchQuery || domainFilter.length > 0) && (
              <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setDomainFilter([]); setFilterTab("all"); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            : "flex flex-col gap-3"
        )}>
          {displayedGrants.map(grant => (
            <GrantCard key={grant.id} grant={grant} onView={selectGrant} />
          ))}
        </div>
      )}

      {/* Results summary */}
      {!loading && displayedGrants.length > 0 && (
        <p className="text-xs text-surface-400 text-center mt-4">
          Showing {displayedGrants.length} grant{displayedGrants.length !== 1 ? "s" : ""}
          {filterTab !== "all" ? ` · ${FILTER_TABS.find(t => t.id === filterTab)?.label}` : ""}
        </p>
      )}

      {/* Grant Detail Slide-over Panel */}
      {selectedGrant && (
        <GrantDetailPanel grant={selectedGrant} onClose={() => selectGrant(null)} />
      )}

      {/* Create Grant Wizard */}
      {wizardOpen && <CreateGrantWizard />}

      {/* Confirmation Modals */}
      {closeConfirmGrant && <CloseGrantModal />}
      {duplicateConfirmGrant && <DuplicateGrantModal />}
      {publishSuccess && <PublishSuccessModal />}
    </AppLayout>
  );
}
