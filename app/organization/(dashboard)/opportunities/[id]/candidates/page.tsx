"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Filter, MoreVertical, CheckCircle, XCircle } from "lucide-react";

export default function ManageCandidatesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const id = resolvedParams.id;

  const candidates = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Frontend Developer",
      avatar: "AR",
      match: "95%",
      applied: "2 days ago",
      status: "Under Review"
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      role: "React Specialist",
      avatar: "SJ",
      match: "88%",
      applied: "3 days ago",
      status: "New"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20">
      <Link href="/organization/opportunities" className="inline-flex items-center gap-2 text-sm text-brand-foreground/70 hover:text-brand-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Recruitments
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-foreground">Manage Candidates</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Review and manage applicants for this recruitment.</p>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="p-4 border-b border-brand-border bg-gray-50 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search candidates..." className="w-full pl-9 pr-3 py-2 border border-brand-border rounded-lg text-sm focus:outline-none focus:border-brand-primary" />
          </div>
          <button className="px-4 py-2 border border-brand-border rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
        
        <div className="divide-y divide-brand-border">
          {candidates.map(candidate => (
            <div key={candidate.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-lg">
                  {candidate.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-brand-foreground">{candidate.name}</h3>
                  <p className="text-sm text-brand-foreground/70">{candidate.role} • Applied {candidate.applied}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xs text-brand-foreground/50 font-bold uppercase tracking-wider mb-1">Match</p>
                  <p className="text-brand-primary font-bold">{candidate.match}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Accept">
                    <CheckCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                    <XCircle className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-brand-foreground rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
