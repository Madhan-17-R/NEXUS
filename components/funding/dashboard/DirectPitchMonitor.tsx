"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { directPitchesApi } from "@/lib/funding/firebase/directPitchesApi";
import { DirectPitch, DirectPitchSettings } from "@/types/funding/directPitches";
import { Avatar } from "@/components/funding/ui/Avatar";
import { Sparkles, ArrowRight, ShieldCheck, Play, Square } from "lucide-react";
import { cn } from "@/lib/funding/utils";
import { Badge } from "@/components/funding/ui/Badge";

export function DirectPitchMonitor() {
  const router = useRouter();
  const [settings, setSettings] = useState<DirectPitchSettings | null>(null);
  const [pitches, setPitches] = useState<DirectPitch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      directPitchesApi.getSettings("org_1"),
      directPitchesApi.getPitches("org_1")
    ]).then(([s, p]) => {
      setSettings(s);
      setPitches(p.slice(0, 3)); // show top 3 on dashboard
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-surface-200 p-8 shadow-sm mb-8 flex justify-center">
        <div className="w-6 h-6 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-sm mb-8">
      {/* Header & Intake Toggle */}
      <div className="px-6 py-5 border-b border-surface-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-surface-900 font-heading flex items-center gap-2">
              Direct Pitch Intake
              <span className="text-xs font-semibold px-2.5 py-0.5 bg-surface-200 text-surface-700 rounded-full">
                {pitches.length} Recent
              </span>
            </h3>
            <p className="text-xs text-surface-500 mt-0.5">Monitor unsolicited idea submissions from innovators</p>
          </div>
        </div>

        {/* Portal Status Controls */}
        <div className="flex items-center gap-3">
          {settings?.isAcceptingPitches ? (
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Accepting Pitches
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-bold text-surface-600 bg-surface-100 px-3 py-1.5 rounded-lg border border-surface-200">
              <span className="w-2 h-2 rounded-full bg-surface-400" />
              Intake Disabled
            </div>
          )}
          
          <button
            onClick={() => router.push("/funding/direct-pitches")}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-smooth shadow-sm flex items-center gap-1.5"
          >
            Manage Intake <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Direct Pitch Cards matching Phase 5 */}
      <div className="divide-y divide-surface-100">
        {pitches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-surface-500 text-sm">No direct pitches received yet.</div>
          </div>
        ) : (
          pitches.map((pitch) => (
            <div key={pitch.id} className="p-6 hover:bg-surface-50/50 transition-smooth group flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* Left: Innovator & Idea */}
              <div className="flex items-start gap-4">
                <img src={pitch.applicantSnapshot.avatar} alt="avatar" className="w-12 h-12 rounded-full border-2 border-white shadow-sm ring-1 ring-surface-200" />
                <div>
                  <h4 
                    onClick={() => router.push(`/direct-pitches/${pitch.id}`)}
                    className="text-base font-bold text-surface-900 group-hover:text-brand-600 transition-colors cursor-pointer mb-1"
                  >
                    {pitch.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-surface-500 font-medium">
                    <span className="font-bold text-surface-700 flex items-center gap-1">
                      {pitch.applicantSnapshot.fullName}
                      {pitch.applicantSnapshot.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
                    </span>
                    <span className="text-surface-300">•</span>
                    <span>{pitch.domain}</span>
                    <span className="text-surface-300">•</span>
                    <span>₹{pitch.fundingRequested.toLocaleString("en-IN")}</span>
                    <span className="text-surface-300">•</span>
                    <span>{new Date(pitch.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Right: Status & Action */}
              <div className="flex items-center gap-4 shrink-0">
                <Badge variant={pitch.status === "New" ? "neutral" : pitch.status === "More Information Required" ? "warning" : "info"}>
                  {pitch.status}
                </Badge>
                
                <button
                  onClick={() => router.push(`/direct-pitches/${pitch.id}`)}
                  className="p-2 bg-white border border-surface-200 text-surface-600 rounded-lg hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-smooth"
                  title="View Pitch"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="bg-surface-50 p-3 text-center border-t border-surface-200">
        <button
          onClick={() => router.push("/funding/direct-pitches")}
          className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
        >
          View All Pitches
        </button>
      </div>
    </div>
  );
}
