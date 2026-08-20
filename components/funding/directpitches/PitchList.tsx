"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDirectPitches } from "@/context/funding/DirectPitchesContext";
import { DirectPitchStatus } from "@/types/funding/directPitches";
import { Badge } from "@/components/funding/ui/Badge";
import { Search, Filter, ArrowUpRight } from "lucide-react";

export function PitchList() {
  const router = useRouter();
  const { pitches, searchQuery, setSearchQuery, statusFilter, reviewers, settings } = useDirectPitches();

  const filtered = useMemo(() => {
    return pitches.filter(p => {
      const matchStatus = statusFilter === "All" || p.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = q === "" || 
        p.id.toLowerCase().includes(q) ||
        p.applicantSnapshot.fullName.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.domain.toLowerCase().includes(q);
      
      return matchStatus && matchSearch;
    }).sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [pitches, searchQuery, statusFilter]);

  if (pitches.length === 0) {
    return (
      <div className="bg-white border border-surface-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4 text-2xl">📥</div>
        {settings?.isAcceptingPitches ? (
          <>
            <h2 className="text-xl font-bold text-surface-900">No Direct Pitches Yet</h2>
            <p className="text-surface-500 mt-2 max-w-md">Your organization is accepting pitches. New submissions will appear here.</p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-surface-900">Direct Pitching is Disabled</h2>
            <p className="text-surface-500 mt-2 max-w-md">Enable direct pitching in the settings above to start receiving ideas from Innovators.</p>
          </>
        )}
      </div>
    );
  }

  const getStatusColor = (status: DirectPitchStatus) => {
    switch(status) {
      case "New": return "neutral";
      case "Shortlisted": return "info";
      case "Awarded": return "success";
      case "Rejected": return "danger";
      case "More Information Required": return "warning";
      default: return "neutral";
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search innovators, ideas, or pitch ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-surface-200 rounded-xl text-sm font-semibold text-surface-700 hover:bg-surface-50 shadow-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl py-12 text-center shadow-sm">
          <h3 className="text-lg font-bold text-surface-900">No Matching Pitches</h3>
          <p className="text-surface-500 mt-1">Try changing your filters or search terms.</p>
          <button onClick={() => setSearchQuery("")} className="mt-4 text-brand-600 font-semibold hover:underline">Clear Filters</button>
        </div>
      ) : (
        <div className="bg-white border border-surface-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-50 border-b border-surface-200">
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Innovator</th>
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Idea & Domain</th>
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Funding</th>
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Reviewer</th>
                  <th className="px-5 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200">
                {filtered.map(pitch => {
                  const rev = reviewers.find(r => r.id === pitch.assignedReviewerId);
                  return (
                    <tr key={pitch.id} className="hover:bg-surface-50/50 group transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={pitch.applicantSnapshot.avatar} alt={pitch.applicantSnapshot.fullName} className="w-8 h-8 rounded-full border border-surface-200 object-cover" />
                          <div>
                            <div className="font-bold text-surface-900 text-sm flex items-center gap-1.5">
                              {pitch.applicantSnapshot.fullName}
                              {pitch.priority === "High" && <span className="w-2 h-2 rounded-full bg-rose-500" title="High Priority" />}
                            </div>
                            <div className="text-xs text-surface-500">{pitch.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-surface-900 text-sm line-clamp-1">{pitch.title}</div>
                        <div className="text-xs text-surface-500 mt-0.5">{pitch.domain}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-surface-900 text-sm">₹{pitch.fundingRequested.toLocaleString("en-IN")}</div>
                        <div className="text-[10px] text-surface-400 mt-0.5">Submitted {new Date(pitch.submittedAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short' })}</div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={getStatusColor(pitch.status)} size="sm">{pitch.status}</Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-surface-600">
                        {rev ? (
                          <div className="flex items-center gap-1.5">
                            <img src={rev.avatar} alt={rev.name} className="w-5 h-5 rounded-full" />
                            {rev.name}
                          </div>
                        ) : (
                          <span className="text-surface-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => router.push(`/direct-pitches/${pitch.id}`)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-surface-200 rounded-lg text-sm font-semibold text-brand-700 hover:bg-brand-50 hover:border-brand-300 transition-smooth"
                        >
                          View Pitch <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
