"use client";

import { BarChart, LineChart, PieChart, Activity, Users, Eye, MousePointerClick, TrendingUp } from "lucide-react";

export default function AnalyticsPage() {
  const metrics = [
    { label: "Profile Views", value: "4,830", trend: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Post Engagement", value: "1,245", trend: "+5%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Followers Gained", value: "324", trend: "+18%", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
    { label: "Opportunity Clicks", value: "892", trend: "-2%", icon: MousePointerClick, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-brand-foreground">Analytics</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Track your company's reach, engagement, and recruitment performance.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <select className="pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="card p-5">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2.5 rounded-xl ${metric.bg}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                metric.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {metric.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-brand-foreground/60 mt-3">{metric.label}</p>
            <p className="text-2xl font-bold text-brand-foreground mt-0.5">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placeholder Chart 1 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-brand-foreground">Profile & Opportunity Views</h3>
            <button className="text-gray-400 hover:text-brand-foreground transition-colors">
              <LineChart className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-brand-primary/50 mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-foreground/50">Chart Visualization Area</p>
              <p className="text-xs text-brand-foreground/40 mt-1">Ready for Recharts integration</p>
            </div>
          </div>
        </div>

        {/* Placeholder Chart 2 */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-brand-foreground">Engagement Breakdown</h3>
            <button className="text-gray-400 hover:text-brand-foreground transition-colors">
              <PieChart className="w-5 h-5" />
            </button>
          </div>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-xl bg-gray-50">
            <div className="text-center">
              <BarChart className="w-8 h-8 text-brand-primary/50 mx-auto mb-2" />
              <p className="text-sm font-medium text-brand-foreground/50">Chart Visualization Area</p>
              <p className="text-xs text-brand-foreground/40 mt-1">Ready for Recharts integration</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-brand-foreground mb-4">Top Performing Posts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-brand-foreground/50 uppercase bg-gray-50 border-b border-brand-border">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Post Title</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Views</th>
                <th className="px-4 py-3">Likes</th>
                <th className="px-4 py-3 rounded-tr-lg">Engagement Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-brand-border hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-brand-foreground">Excited to announce our new robotic arm...</td>
                <td className="px-4 py-4"><span className="px-2 py-1 bg-brand-mint text-brand-primary text-xs rounded-md">Project Update</span></td>
                <td className="px-4 py-4">4,200</td>
                <td className="px-4 py-4">342</td>
                <td className="px-4 py-4 text-emerald-600 font-medium">8.1%</td>
              </tr>
              <tr className="border-b border-brand-border hover:bg-gray-50">
                <td className="px-4 py-4 font-medium text-brand-foreground">We are hiring! Join our autonomous systems team...</td>
                <td className="px-4 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md">Recruitment Post</span></td>
                <td className="px-4 py-4">3,800</td>
                <td className="px-4 py-4">156</td>
                <td className="px-4 py-4 text-emerald-600 font-medium">4.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
