"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useApplications } from "@/context/funding/ApplicationsContext";
import { ApplicationStatus, GrantApplication } from "@/types/funding/applications";
import { Badge } from "@/components/funding/ui/Badge";
import { Search, Filter, MoreHorizontal, ArrowUpRight } from "lucide-react";

export function ApplicationList() {
  const router = useRouter();
  const { applications, searchQuery, setSearchQuery, statusFilter, reviewers } = useApplications();

  const filtered = useMemo(() => {
    return applications.filter(app => {
      const matchStatus = statusFilter === "All" || app.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = q === "" || 
        app.id.toLowerCase().includes(q) ||
        app.applicantSnapshot.fullName.toLowerCase().includes(q) ||
        app.projectTitle.toLowerCase().includes(q) ||
        app.domain.toLowerCase().includes(q);
      
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [applications, searchQuery, statusFilter]);

  if (applications.length === 0) {
    return (
      <div className="p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4 text-2xl">📥</div>
        <h2 className="text-xl font-bold text-surface-900">No Applications Yet</h2>
        <p className="text-surface-500 mt-2 max-w-md">This grant hasn&apos;t received any applications. Once innovators submit their forms, they will appear here.</p>
      </div>
    );
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch(status) {
      case "Submitted": return "neutral";
      case "Shortlisted": return "info";
      case "Awarded": return "success";
      case "Rejected": return "danger";
      case "More Information Required": return "warning";
      default: return "neutral";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filters bar */}
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search applicants, projects, or application ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-surface-200 rounded-lg text-sm font-semibold text-surface-700 hover:bg-surface-50">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <h3 className="text-lg font-bold text-surface-900">No Matching Applications</h3>
            <p className="text-surface-500 mt-1">Try changing your filters or search terms.</p>
            <button onClick={() => setSearchQuery("")} className="mt-4 text-brand-600 font-semibold hover:underline">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white border border-surface-200 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Applicant</th>
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Project & Domain</th>
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Funding</th>
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Reviewer</th>
                  <th className="px-4 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {filtered.map(app => {
                  const rev = reviewers.find(r => r.id === app.assignedReviewerId);
                  return (
                    <tr key={app.id} className="hover:bg-surface-50/50 group transition-colors">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <img src={app.applicantSnapshot.avatar} alt={app.applicantSnapshot.fullName} className="w-8 h-8 rounded-full border border-surface-200 object-cover" />
                          <div>
                            <div className="font-bold text-surface-900 text-sm flex items-center gap-1.5">
                              {app.applicantSnapshot.fullName}
                              {app.priority === "High" && <span className="w-2 h-2 rounded-full bg-rose-500" title="High Priority" />}
                            </div>
                            <div className="text-xs text-surface-500">{app.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-surface-900 text-sm line-clamp-1">{app.projectTitle}</div>
                        <div className="text-xs text-surface-500 mt-0.5">{app.domain}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-surface-900 text-sm">₹{app.fundingRequested.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] text-surface-400 mt-0.5">Submitted {new Date(app.submittedAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={getStatusColor(app.status)} size="sm">{app.status}</Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-surface-600">
                        {rev ? (
                          <div className="flex items-center gap-1.5">
                            <img src={rev.avatar} alt={rev.name} className="w-5 h-5 rounded-full" />
                            {rev.name}
                          </div>
                        ) : (
                          <span className="text-surface-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => router.push(`/grants/${app.grantId}/applications/${app.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm font-semibold text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition-smooth"
                        >
                          Review <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
