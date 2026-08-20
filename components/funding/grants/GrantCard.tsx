"use client";

import React from "react";
import { FullGrant, GrantStatus } from "@/types/funding";
import { Badge } from "@/components/funding/ui/Badge";
import { Button } from "@/components/funding/ui/Button";
import {
  DollarSign, Calendar, Users, CheckCircle, Clock,
  Copy, Archive, XCircle, MoreHorizontal, Zap,
  Eye, Pencil, ArrowRight, AlertCircle, Building2
} from "lucide-react";
import { cn } from "@/lib/funding/utils";
import { useGrants } from "@/context/funding/GrantsContext";

const statusConfig: Record<GrantStatus, {
  label: string;
  badge: "success" | "warning" | "neutral" | "danger" | "info" | "purple";
  dot: boolean;
}> = {
  active: { label: "Intake Active", badge: "success", dot: true },
  draft: { label: "Draft", badge: "neutral", dot: false },
  closed: { label: "Closed", badge: "danger", dot: false },
  in_review: { label: "In Review", badge: "warning", dot: true },
  closing_soon: { label: "Closing Soon", badge: "warning", dot: true },
};

const domainColors: Record<string, string> = {
  "Climate & CleanTech": "bg-emerald-100 text-emerald-700",
  "HealthTech & BioAI": "bg-rose-100 text-rose-700",
  "Robotics & Hardware": "bg-sky-100 text-sky-700",
  "Web3 & Security": "bg-purple-100 text-purple-700",
  "AgriTech & Food": "bg-amber-100 text-amber-700",
  "AI & Machine Learning": "bg-indigo-100 text-indigo-700",
  "Education": "bg-teal-100 text-teal-700",
  "FinTech": "bg-cyan-100 text-cyan-700",
  "Social Innovation": "bg-pink-100 text-pink-700",
};

function formatCurrency(amount: number, currency: string) {
  if (currency === "INR") return `₹${(amount / 100000).toFixed(0)}L`;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

interface GrantCardProps {
  grant: FullGrant;
  onView: (grant: FullGrant) => void;
}

export function GrantCard({ grant, onView }: GrantCardProps) {
  const { closeGrant, duplicateGrant } = useGrants();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const cfg = statusConfig[grant.status] ?? statusConfig.draft;
  const utilisationPct = grant.totalPool > 0
    ? Math.round((grant.disbursed / grant.totalPool) * 100)
    : 0;
  const domainColor = domainColors[grant.domain] ?? "bg-surface-100 text-surface-700";

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <article className="bg-white rounded-2xl border border-surface-200 shadow-sm hover:shadow-md hover:border-surface-300 transition-all duration-200 p-5 flex flex-col gap-4 group">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", domainColor)}>
              {grant.domain}
            </span>
            <span className="text-[11px] font-semibold text-surface-500 bg-surface-100 px-2 py-0.5 rounded-full border border-surface-200">
              {grant.programType}
            </span>
          </div>
          <h3 className="text-sm font-bold text-surface-900 group-hover:text-brand-600 transition-colors leading-snug">
            {grant.title}
          </h3>
          <p className="text-xs text-surface-500 mt-0.5 line-clamp-2">{grant.shortDescription}</p>
        </div>

        {/* Actions menu */}
        <div ref={menuRef} className="relative shrink-0">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-700 hover:bg-surface-100 transition-smooth"
            aria-label="More actions"
            id={`grant-menu-${grant.id}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-xl border border-surface-200 shadow-xl py-1 text-sm">
              <button onClick={() => { onView(grant); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-surface-700 hover:bg-surface-50 text-left transition-smooth">
                <Eye className="w-4 h-4 text-surface-400" /> View Details
              </button>
              <button onClick={() => { onView(grant); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-surface-700 hover:bg-surface-50 text-left transition-smooth">
                <Pencil className="w-4 h-4 text-surface-400" /> Edit Grant
              </button>
              <button onClick={() => { duplicateGrant(grant); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-surface-700 hover:bg-surface-50 text-left transition-smooth">
                <Copy className="w-4 h-4 text-surface-400" /> Duplicate
              </button>
              {grant.status !== "closed" && (
                <button onClick={() => { closeGrant(grant); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 text-left transition-smooth">
                  <XCircle className="w-4 h-4" /> Close Grant
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Eligibility bullets */}
      {grant.eligibilityBullets.length > 0 && (
        <ul className="space-y-1">
          {grant.eligibilityBullets.slice(0, 2).map((b, i) => (
            <li key={i} className="flex items-start gap-2 text-[11px] text-surface-600">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span className="line-clamp-1">{b}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">Funding Pool</span>
          <span className="text-sm font-bold text-surface-900">
            {formatCurrency(grant.totalPool, grant.currency)}
          </span>
          <span className="text-[10px] text-surface-500">
            {grant.minAward >= 1000
              ? `${formatCurrency(grant.minAward, grant.currency)}–${formatCurrency(grant.maxAward, grant.currency)}`
              : "Range TBD"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">Applications</span>
          <span className="text-sm font-bold text-surface-900">{grant.applicationCount}</span>
          <span className="text-[10px] text-surface-500">{grant.pendingReview} pending review</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">Deadline</span>
          <span className="text-sm font-bold text-surface-900">{grant.timeline.deadline || "TBD"}</span>
          <span className={cn(
            "text-[10px] font-medium",
            grant.daysLeft <= 7 ? "text-rose-500" : grant.daysLeft <= 14 ? "text-amber-600" : "text-surface-500"
          )}>
            {grant.daysLeft > 0 ? `${grant.daysLeft}d remaining` : "Closed"}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-surface-400 font-medium uppercase tracking-wider">Disbursed</span>
          <span className="text-sm font-bold text-surface-900">{utilisationPct}%</span>
          <span className="text-[10px] text-surface-500">
            {formatCurrency(grant.disbursed, grant.currency)} of pool
          </span>
        </div>
      </div>

      {/* Utilisation bar */}
      {grant.disbursed > 0 && (
        <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${utilisationPct}%` }}
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {grant.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-[10px] font-medium text-surface-500 bg-surface-50 border border-surface-200 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
        {grant.tags.length > 4 && (
          <span className="text-[10px] text-surface-400">+{grant.tags.length - 4} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-surface-100">
        <div className="flex items-center gap-2">
          <Badge variant={cfg.badge} size="sm" dot={cfg.dot}>{cfg.label}</Badge>
          {grant.verified && (
            <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
              <Building2 className="w-3 h-3" /> Verified
            </span>
          )}
          {grant.applicationForm.status === "not_configured" && grant.status === "draft" && (
            <span className="flex items-center gap-1 text-[10px] text-amber-600 font-medium">
              <AlertCircle className="w-3 h-3" /> Form needed
            </span>
          )}
        </div>
        <Button
          variant="primary"
          size="xs"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          onClick={() => onView(grant)}
          id={`manage-grant-${grant.id}`}
        >
          Manage Grant
        </Button>
      </div>
    </article>
  );
}
