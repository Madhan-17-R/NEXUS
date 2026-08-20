"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Users, Eye, Rss, Briefcase, Plus, ArrowRight } from "lucide-react";
import { opportunityService, Opportunity } from "@/services/organization/firebase/opportunities";
import { postService } from "@/services/organization/firebase/posts";

export default function CompanyDashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [postCount, setPostCount] = useState(32); // Using static for now, you can hook this up to a postService if needed

  useEffect(() => {
    const fetchData = async () => {
      const opps = await opportunityService.getOpportunities();
      setOpportunities(opps);
      
      const posts = await postService.getPosts();
      setPostCount(posts.length);
    };
    fetchData();
  }, []);

  const activeOpps = opportunities.filter(o => o.status === 'Active');
  const recentOpps = activeOpps.slice(0, 3);

  const kpis = [
    { label: "Total Posts", value: postCount.toString(), icon: Rss, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Active Recruitments", value: activeOpps.length.toString(), icon: Briefcase, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Followers", value: "1,245", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Profile Views", value: "4,830", icon: Eye, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">Dashboard</h1>
          <p className="text-brand-foreground/70 text-sm mt-1">Overview of your company's performance and active opportunities.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/organization/opportunities/create" className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-border text-brand-foreground rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm">
            <Plus className="w-4 h-4" />
            New Recruitment
          </Link>
          <Link href="/organization/posts/create" className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors text-sm shadow-sm">
            <Plus className="w-4 h-4" />
            Create Post
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="card p-5 flex items-start gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-brand-foreground/60">{kpi.label}</p>
              <p className="text-2xl font-bold text-brand-foreground mt-1">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Active Opportunities */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-foreground">Active Recruitments</h2>
              <Link href="/organization/opportunities" className="text-sm text-brand-primary font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentOpps.length > 0 ? recentOpps.map((job) => {
                // Calculate rough days left based on deadline
                const deadlineDate = new Date(job.deadline);
                const today = new Date();
                const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                return (
                  <Link href={`/company/opportunities/${job.id}`} key={job.id} className="flex items-center justify-between p-3 border border-brand-border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div>
                      <p className="font-bold text-brand-foreground text-sm">{job.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-medium px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md">
                          {job.type}
                        </span>
                        <span className="text-xs text-brand-foreground/60">
                          {Math.floor(Math.random() * 50)} applicants
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                        {diffDays} days left
                      </span>
                    </div>
                  </Link>
                );
              }) : (
                <div className="p-4 text-center text-brand-foreground/50 text-sm">
                  No active opportunities found.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Recent Notifications */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-brand-foreground">Recent Activity</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: "New application", desc: "Alex Rivera applied for Frontend Developer", time: "2h ago" },
                { title: "Post liked", desc: "Your recent post reached 500 likes", time: "5h ago" },
                { title: "New follower", desc: "Tech Innovations Inc. started following you", time: "1d ago" }
              ].map((notif, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-primary shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-brand-foreground">{notif.title}</p>
                    <p className="text-xs text-brand-foreground/70 mt-0.5">{notif.desc}</p>
                    <p className="text-xs text-brand-foreground/40 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/organization/notifications" className="block text-center text-sm font-medium text-brand-primary mt-4 pt-4 border-t border-brand-border hover:underline">
              View all notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
