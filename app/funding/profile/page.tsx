"use client";

import React from "react";
import { AppLayout } from "@/components/funding/layout/AppLayout";
import { useFundingOrg } from "@/context/funding/FundingOrgContext";
import { useAlert } from "@/context/funding/AlertContext";
import { Avatar } from "@/components/funding/ui/Avatar";
import { Button } from "@/components/funding/ui/Button";
import { Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { org } = useFundingOrg();
  const { showInfo } = useAlert();

  const user = org?.currentUser || {
    name: "Dr. Rachel Vance",
    role: "Funding Organization",
    avatar: "",
    initials: "RV"
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
        <h1 className="text-2xl font-black text-surface-900 tracking-tight mb-6">User Profile</h1>

        <div className="bg-white rounded-2xl border border-surface-200 shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-brand-600 to-brand-800"></div>
          <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
              <div className="p-1 bg-white rounded-full">
                <Avatar
                  src={user.avatar}
                  name={user.name}
                  size="xl"
                  className="w-24 h-24 text-3xl"
                />
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => showInfo("Profile Editing", "Profile editing functionality will be available in a future update.")}
              >
                Edit Profile
              </Button>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-surface-900 font-heading">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-700">{user.role}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2">Contact Information</h3>
                <div className="flex items-center gap-3 text-sm text-surface-600">
                  <Mail className="w-4 h-4 text-surface-400" />
                  <span>rachel.vance@skillforge.org</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-surface-600">
                  <Phone className="w-4 h-4 text-surface-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-surface-600">
                  <MapPin className="w-4 h-4 text-surface-400" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-surface-900 uppercase tracking-wider mb-2">Organization</h3>
                <div className="flex items-center gap-3 text-sm text-surface-600">
                  <Building2 className="w-4 h-4 text-surface-400" />
                  <span className="font-semibold text-surface-900">{org?.name || "SkillForge Funding"}</span>
                </div>
                <div className="p-3 bg-surface-50 rounded-xl border border-surface-100 text-xs text-surface-600 leading-relaxed mt-2">
                  Account is currently active and in good standing. Member since January 2026.
                  Administrative privileges are fully enabled.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
