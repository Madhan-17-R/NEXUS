"use client";

import { useState, useEffect } from "react";
import { User, Bell, Shield, Key, Eye, LogOut, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/organization/firebase/auth";
import { profileService, CompanyProfile } from "@/services/organization/firebase/profile";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("Account");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Mock states for other tabs
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [profileVisible, setProfileVisible] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const data = await profileService.getProfile();
      setProfile(data);
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    router.push("/organization/login");
  };

  const handleSaveAccount = async () => {
    if (profile) {
      setIsSaving(true);
      await profileService.updateProfile({ name: profile.name });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const tabs = [
    { id: "Account", icon: User },
    { id: "Notifications", icon: Bell },
    { id: "Privacy", icon: Eye },
    { id: "Security", icon: Shield },
    { id: "API & Integrations", icon: Key }
  ];

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-brand-foreground">Settings</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Manage your account preferences and company settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="card p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-brand-mint text-brand-primary"
                      : "text-brand-foreground hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? "text-brand-primary" : "text-gray-400"}`} />
                  {tab.id}
                </button>
              ))}
            </nav>
            
            <div className="mt-6 pt-6 border-t border-brand-border px-2">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="card p-6 md:p-8 min-h-[500px]">
            <h2 className="text-lg font-bold text-brand-foreground border-b border-brand-border pb-4 mb-6">
              {activeTab} Settings
            </h2>
            
            {activeTab === "Account" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Company Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="block w-full max-w-md px-3 py-2.5 border border-brand-border rounded-lg shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-foreground mb-1.5">Account Email</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    disabled 
                    className="block w-full max-w-md px-3 py-2.5 border border-brand-border rounded-lg shadow-sm bg-gray-50 text-gray-500 sm:text-sm cursor-not-allowed" 
                  />
                  <p className="text-xs text-brand-foreground/50 mt-1">Contact support to change your account email.</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    onClick={handleSaveAccount}
                    disabled={isSaving}
                    className="px-5 py-2.5 bg-brand-navy text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm flex items-center gap-2"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                    {saveSuccess && <Check className="w-4 h-4 text-green-400" />}
                  </button>
                </div>

                <div className="pt-8 mt-8 border-t border-brand-border">
                  <h3 className="text-sm font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-brand-foreground/70 mb-4">Once you delete your company account, there is no going back. Please be certain.</p>
                  <button className="px-4 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium rounded-lg transition-colors text-sm">
                    Delete Account
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <h4 className="text-sm font-medium text-brand-foreground">Email Notifications</h4>
                    <p className="text-xs text-brand-foreground/70">Receive daily summaries and alerts</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotifs(!emailNotifs)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${emailNotifs ? 'bg-brand-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${emailNotifs ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
                
                <div className="flex items-center justify-between max-w-md pt-4 border-t border-brand-border">
                  <div>
                    <h4 className="text-sm font-medium text-brand-foreground">Push Notifications</h4>
                    <p className="text-xs text-brand-foreground/70">Immediate alerts in the browser</p>
                  </div>
                  <button 
                    onClick={() => setPushNotifs(!pushNotifs)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${pushNotifs ? 'bg-brand-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${pushNotifs ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Privacy" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <h4 className="text-sm font-medium text-brand-foreground">Public Profile Visibility</h4>
                    <p className="text-xs text-brand-foreground/70">Allow candidates to see your company profile</p>
                  </div>
                  <button 
                    onClick={() => setProfileVisible(!profileVisible)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${profileVisible ? 'bg-brand-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${profileVisible ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between max-w-md">
                  <div>
                    <h4 className="text-sm font-medium text-brand-foreground">Two-Factor Authentication</h4>
                    <p className="text-xs text-brand-foreground/70">Add an extra layer of security to your account</p>
                  </div>
                  <button 
                    onClick={() => setTwoFactor(!twoFactor)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${twoFactor ? 'bg-brand-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${twoFactor ? 'left-[22px]' : 'left-0.5'}`}></div>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "API & Integrations" && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-brand-foreground mb-2">API Keys</h4>
                  <p className="text-xs text-brand-foreground/70 mb-4">Generate API keys for your automated workflows or ATS integrations.</p>
                  <button className="px-4 py-2 bg-gray-100 border border-brand-border text-brand-foreground font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    Generate New Key
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
