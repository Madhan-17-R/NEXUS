"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReviews } from "@/context/funding/ReviewsContext";
import { Badge } from "@/components/funding/ui/Badge";
import { Search, Filter, ClipboardList, Clock, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";
import { reviewsApi } from "@/lib/funding/firebase/reviewsApi";
import { ReviewerAssignment, ReviewerEvaluation } from "@/types/funding/reviews";
import { AppLayout } from "@/components/funding/layout/AppLayout";

export default function ReviewQueuePage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<ReviewerAssignment[]>([]);
  const [evaluations, setEvaluations] = useState<ReviewerEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadAllData() {
      try {
        const asgs = await reviewsApi.getAllAssignments();
        // Mock loading all evaluations for simplicity
        const allEvals = await Promise.all(
          asgs.map(a => reviewsApi.getEvaluations(a.applicationId))
        );
        setAssignments(asgs);
        setEvaluations(allEvals.flat());
      } finally {
        setLoading(false);
      }
    }
    loadAllData();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const currentUserAssignments = assignments.filter(a => a.reviewerId === "rev_2"); // Mock current user

  const getFilteredAssignments = () => {
    let result = currentUserAssignments;

    if (filter === "Pending") result = result.filter(a => a.status === "Pending");
    if (filter === "In Progress") result = result.filter(a => a.status === "In Progress");
    if (filter === "Submitted") result = result.filter(a => a.status === "Submitted");
    if (filter === "Grant Applications") result = result.filter(a => a.ownerType === "grant");
    if (filter === "Direct Pitches") result = result.filter(a => a.ownerType === "directPitch");

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => a.applicationId.toLowerCase().includes(q));
    }

    return result;
  };

  const filteredAssignments = getFilteredAssignments();

  // KPIs
  const pendingCount = currentUserAssignments.filter(a => a.status === "Pending").length;
  const inProgressCount = currentUserAssignments.filter(a => a.status === "In Progress").length;
  const submittedCount = currentUserAssignments.filter(a => a.status === "Submitted").length;
  
  const submittedEvals = evaluations.filter(e => e.reviewerId === "rev_2" && e.status === "Submitted");
  const avgScore = submittedEvals.length > 0 
    ? (submittedEvals.reduce((a, b) => a + b.totalScore, 0) / submittedEvals.length).toFixed(1)
    : "-";

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        <header className="bg-white border border-surface-200 rounded-xl shadow-sm px-6 py-4 shrink-0 flex items-center gap-4 mb-6">
          <button
            onClick={() => router.push("/funding/")}
          className="p-2 -ml-2 text-surface-400 hover:text-surface-700 hover:bg-surface-100 rounded-lg transition-smooth shrink-0"
          title="Back to Main"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-surface-900">Review Queue</h1>
          <p className="text-xs text-surface-500 mt-0.5">
            Applications and direct pitches requiring your attention.
          </p>
        </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm">
              <div className="flex items-center gap-2 text-amber-500 mb-2">
                <Clock className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Pending Reviews</span>
              </div>
              <div className="text-2xl font-black text-surface-900">{pendingCount}</div>
            </div>
            
            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm">
              <div className="flex items-center gap-2 text-brand-500 mb-2">
                <ClipboardList className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-surface-500">In Progress</span>
              </div>
              <div className="text-2xl font-black text-surface-900">{inProgressCount}</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm">
              <div className="flex items-center gap-2 text-green-500 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider text-surface-500">Submitted</span>
              </div>
              <div className="text-2xl font-black text-surface-900">{submittedCount}</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-surface-200 shadow-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">Avg Score</div>
              <div className="text-2xl font-black text-surface-900">{avgScore}</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-surface-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-surface-200 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                {["All", "Pending", "In Progress", "Submitted", "Grant Applications", "Direct Pitches"].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      filter === f 
                        ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                        : 'bg-white text-surface-600 border border-surface-200 hover:bg-surface-50'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Applicant / ID</th>
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Assigned</th>
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-xs font-bold text-surface-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {filteredAssignments.map((assignment) => {
                    const evalData = evaluations.find(e => e.reviewerId === assignment.reviewerId && e.applicationId === assignment.applicationId);
                    
                    const handleRowClick = () => {
                      if (assignment.ownerType === "grant") {
                        // Assuming grantId is embedded in applicationId structure for mock or we just use a generic route
                        // Our mock app ID is APP-2026-0042 which belongs to grant g1
                        router.push(`/grants/g1/applications/${assignment.applicationId}`);
                      } else {
                        router.push(`/direct-pitches/${assignment.applicationId}`);
                      }
                    };

                    return (
                      <tr key={assignment.id} className="hover:bg-surface-50 transition-colors group cursor-pointer" onClick={handleRowClick}>
                        <td className="px-6 py-4">
                          <div className="font-bold text-surface-900">{assignment.applicationId}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="neutral">
                            {assignment.ownerType === "grant" ? "Grant Application" : "Direct Pitch"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-surface-600">{new Date(assignment.assignedAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={
                            assignment.status === "Pending" ? "warning" :
                            assignment.status === "In Progress" ? "info" : "success"
                          }>
                            {assignment.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {evalData && evalData.status === "Submitted" ? (
                            <span className="font-bold text-brand-600">{evalData.totalScore} / 100</span>
                          ) : (
                            <span className="text-sm text-surface-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-brand-600 hover:text-brand-700 p-2 rounded-lg hover:bg-brand-50 transition-colors flex items-center">
                            <span className="text-sm font-semibold mr-1">{assignment.status === "Submitted" ? "View" : "Review"}</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  
                  {filteredAssignments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-surface-500">
                        No reviews match your current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AppLayout>
  );
}
