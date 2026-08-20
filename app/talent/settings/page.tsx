'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings as SettingsIcon,
  Bell,
  User,
  LogOut,
  Check,
  Shield,
} from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import { useAuth } from '@/context/talent/AuthContext';
import clsx from 'clsx';

export default function SettingsPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();

  // Preference Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [appStatusAlerts, setAppStatusAlerts] = useState(true);
  const [collabAlerts, setCollabAlerts] = useState(true);
  const [profilePublic, setProfilePublic] = useState(true);
  const [showPortfolio, setShowPortfolio] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  function handleSavePreferences() {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/talent/auth/login');
  }

  if (authLoading) return null;
  if (!user) return null;

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-emerald-600" />
            Account Settings & Preferences
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your Job Seeker account security, notification alerts, and candidate privacy settings
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-xl animate-fade-in shadow-xs">
            <Check className="w-4 h-4 text-emerald-600" />
            Preferences updated successfully!
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" />
            Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Primary Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-medium cursor-not-allowed text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Account Role</label>
              <div className="px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl flex items-center justify-between text-sm">
                <span>Job Seeker</span>
                <span className="text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-md">Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-600" />
            Notification Preferences
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Application Status Alerts</p>
                <p className="text-xs text-slate-500">Receive instant updates when a recruiter updates your status</p>
              </div>
              <button
                onClick={() => setAppStatusAlerts((v) => !v)}
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
                  appStatusAlerts ? 'bg-emerald-600' : 'bg-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 bg-white rounded-full transition-transform',
                    appStatusAlerts ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Innovator Collaboration Invitations</p>
                <p className="text-xs text-slate-500">Notifications when student innovators reach out to collaborate</p>
              </div>
              <button
                onClick={() => setCollabAlerts((v) => !v)}
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
                  collabAlerts ? 'bg-emerald-600' : 'bg-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 bg-white rounded-full transition-transform',
                    collabAlerts ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Email Digest & Match Recommendations</p>
                <p className="text-xs text-slate-500">Weekly email summaries of top matching robotics & tech roles</p>
              </div>
              <button
                onClick={() => setEmailAlerts((v) => !v)}
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
                  emailAlerts ? 'bg-emerald-600' : 'bg-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 bg-white rounded-full transition-transform',
                    emailAlerts ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Candidate Privacy & Security */}
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            Candidate Privacy
          </h3>

          <div className="space-y-3 divide-y divide-slate-100 text-xs sm:text-sm">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Visible to Verified Employers</p>
                <p className="text-xs text-slate-500">Allow recruiters to discover your candidate profile in search</p>
              </div>
              <button
                onClick={() => setProfilePublic((v) => !v)}
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
                  profilePublic ? 'bg-emerald-600' : 'bg-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 bg-white rounded-full transition-transform',
                    profilePublic ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Display Portfolio & GitHub Links</p>
                <p className="text-xs text-slate-500">Show links on your public candidate profile card</p>
              </div>
              <button
                onClick={() => setShowPortfolio((v) => !v)}
                className={clsx(
                  'w-11 h-6 rounded-full transition-colors relative p-0.5 flex-shrink-0',
                  showPortfolio ? 'bg-emerald-600' : 'bg-slate-300'
                )}
              >
                <div
                  className={clsx(
                    'w-5 h-5 bg-white rounded-full transition-transform',
                    showPortfolio ? 'translate-x-5' : 'translate-x-0'
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Save & Sign Out Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={handleSavePreferences}
            className="flex-1 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-xs"
          >
            Save Preferences
          </button>

          <button
            onClick={handleSignOut}
            className="py-3 px-6 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </AppLayout>
  );
}