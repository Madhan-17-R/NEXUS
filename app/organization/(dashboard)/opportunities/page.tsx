"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Copy, Trash2, Eye, Users } from "lucide-react";
import { opportunityService, Opportunity } from "@/services/organization/firebase/opportunities";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [typeFilter, setTypeFilter] = useState("All Types");

  const filteredOpportunities = opportunities.filter(opp => {
    const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          opp.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          opp.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || opp.status === statusFilter;
    const matchesType = typeFilter === "All Types" || opp.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    try {
      const data = await opportunityService.getOpportunities();
      setOpportunities(data);
    } catch (error) {
      console.error("Failed to load opportunities:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recruitment?")) return;
    await opportunityService.deleteOpportunity(id);
    await fetchOpportunities();
  };

  const handleDuplicate = async (id: string) => {
    await opportunityService.duplicateOpportunity(id);
    await fetchOpportunities();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">Recruitments</h1>
          <p className="text-brand-foreground/70 text-sm mt-1">Manage your active recruitment posts and internships.</p>
        </div>
        <Link 
          href="/organization/opportunities/create" 
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Recruitment
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-brand-border rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-primary sm:text-sm transition-colors"
              placeholder="Search recruitments..."
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white"
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Draft</option>
              <option>Closing Soon</option>
              <option>Closed</option>
            </select>
            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="block w-full pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white"
            >
              <option>All Types</option>
              <option>Full-time</option>
              <option>Internship</option>
              <option>Freelance</option>
            </select>
            <button className="p-2 border border-brand-border rounded-lg text-gray-500 hover:text-brand-primary hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-6">
        {filteredOpportunities.length === 0 && !isLoading ? (
          <div className="text-center p-8 text-brand-foreground/50 border border-dashed border-gray-200 rounded-2xl">
            No opportunities found matching your criteria.
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
          <div key={opp.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative group">
            {/* Action buttons show on hover */}
            <div className="absolute top-5 right-5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2 z-10">
               <Link href={`/company/opportunities/${opp.id}/edit`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                 <Edit2 className="w-4 h-4" />
               </Link>
               <button onClick={() => handleDuplicate(opp.id)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Duplicate">
                 <Copy className="w-4 h-4" />
               </button>
               <button onClick={() => handleDelete(opp.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3 pr-24">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg font-bold shrink-0">
                  🤖
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{opp.title}</h3>
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase">
                      {opp.type === "Internship" ? "Intern" : "Job"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">Apex Robotics Inc. • {opp.location} ({opp.workMode})</p>
                </div>
              </div>
              
              <div className="text-right group-hover:opacity-0 transition-opacity shrink-0">
                <span className="inline-block bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-bold mb-1">
                  {opp.salary}
                </span>
                <p className="text-[10px] text-gray-400">2 hours ago</p>
              </div>
            </div>

            <div className="bg-slate-50/70 border border-slate-100 rounded-lg p-3 mb-4">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Role Details</h4>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span>Design and build solutions related to {opp.project}.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span>Collaborate with cross-functional teams to hit target: {opp.target}.</span>
                </li>
                <li className="flex items-start gap-2 text-xs text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                  <span>Participate in daily agile sprints and field prototype testing.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {opp.skills.map(skill => (
                <span key={skill} className="bg-slate-50 border border-slate-100 text-slate-600 font-medium px-2 py-1 rounded-md text-[11px]">
                  #{skill}
                </span>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">Verified Employer Listing</span>
              <div className="flex gap-2">
                <Link 
                  href={`/company/opportunities/${opp.id}`}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> View Role
                </Link>
                <Link 
                  href={`/company/opportunities/${opp.id}/candidates`}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-md font-medium text-xs transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" /> Candidates
                </Link>
              </div>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}
