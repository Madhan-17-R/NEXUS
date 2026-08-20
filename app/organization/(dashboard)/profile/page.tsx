"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, MapPin, Globe, Calendar, Users, CheckCircle } from "lucide-react";
import { profileService, CompanyProfile } from "@/services/organization/firebase/profile";

export default function CompanyProfilePage() {
  const [activeTab, setActiveTab] = useState("About");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const tabs = ["About", "Posts", "Recruitments", "Projects", "Followers"];

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      {/* Cover Banner */}
      <div className="h-48 w-full bg-gradient-to-r from-slate-800 to-brand-navy rounded-t-2xl relative">
        <div className="absolute inset-0 bg-black/20 rounded-t-2xl"></div>
      </div>

      {/* Profile Header */}
      <div className="card rounded-t-none -mt-2 p-6 md:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 mb-6">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-md p-2 flex items-center justify-center">
              <div className="w-full h-full bg-brand-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-4xl">{profile.name.charAt(0)}</span>
              </div>
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-brand-foreground">{profile.name}</h1>
                <CheckCircle className="w-5 h-5 text-brand-primary" />
              </div>
              <p className="text-sm font-medium text-brand-foreground/70 mt-1">{profile.headline}</p>
            </div>
          </div>
          <div className="flex gap-3 pb-2">
            <button className="px-5 py-2 bg-brand-primary text-white font-medium rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm text-sm">
              Follow
            </button>
            <Link href="/organization/profile/setup" className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-brand-border text-brand-foreground font-medium rounded-lg hover:bg-gray-100 transition-colors text-sm">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Info tags */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-brand-foreground/70 mb-6">
          <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {profile.location}</div>
          <div className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> {profile.website}</div>
          <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Founded {profile.founded}</div>
          <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {profile.employees}</div>
        </div>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {profile.techStack.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-brand-mint text-brand-primary border border-brand-primary/20 text-xs font-bold rounded-full">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 flex border-b border-brand-border overflow-x-auto hide-scrollbar">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${
              activeTab === tab 
                ? "text-brand-primary" 
                : "text-brand-foreground/60 hover:text-brand-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "About" && (
          <div className="card p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-brand-foreground mb-3">About Us</h3>
              <p className="text-brand-foreground/80 leading-relaxed text-sm whitespace-pre-wrap">
                {profile.about}
              </p>
            </div>
            
            <div className="pt-6 border-t border-brand-border">
              <h3 className="text-lg font-bold text-brand-foreground mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-brand-foreground/50 font-bold uppercase tracking-wider mb-1">Email</p>
                  <p className="text-sm font-medium text-brand-foreground">{profile.email}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-brand-foreground/50 font-bold uppercase tracking-wider mb-1">HQ</p>
                  <p className="text-sm font-medium text-brand-foreground">{profile.hq}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === "Posts" && (
          <div className="card p-12 text-center">
            <p className="text-brand-foreground/60">No posts published yet.</p>
          </div>
        )}
        
        {activeTab === "Recruitments" && (
          <div className="card p-8 text-center mt-6">
            <p className="text-brand-foreground/60">View all recruitments in the Recruitments tab.</p>
          </div>
        )}
      </div>
    </div>
  );
}
