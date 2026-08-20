'use client';

import React, { useState } from 'react';
import { User, Bell, Lock, Palette, ChevronRight, Check, Moon, Sun } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Button, Input, Avatar } from '@/components/innovator/ui';
import { cn } from '@/lib/utils';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const { currentUser, showToast } = useApp();
  const [activeSection, setActiveSection] = useState('profile');

  // Top-level states to comply with React Rules of Hooks
  const [notifSettings, setNotifSettings] = useState({
    collabRequests: true,
    messages: true,
    applicationUpdates: true,
    grantMatches: true,
    newConnections: false,
    weeklyDigest: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showSkills: true,
    allowCollabRequests: true,
    showInExplore: true,
  });

  const toggleNotif = (key: keyof typeof notifSettings) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings nav */}
        <div className="md:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-2 shadow-sm">
            {settingsSections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all',
                  activeSection === id ? 'bg-[#DCF2E4] text-[#0F172A]' : 'text-slate-600 hover:bg-slate-50'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
                <ChevronRight className={cn('w-3.5 h-3.5 ml-auto text-slate-400 transition-transform', activeSection === id && 'rotate-90')} />
              </button>
            ))}
          </div>
        </div>

        {/* Settings content */}
        <div className="md:col-span-3">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
              <h2 className="text-base font-extrabold text-[#0F172A]">Profile Settings</h2>

              <div className="flex items-center gap-4">
                <Avatar src={currentUser.avatar} name={currentUser.name} size="lg" />
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-[11px] text-slate-400 mt-1">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={currentUser.name} />
                <Input label="Email" defaultValue={currentUser.email} type="email" />
              </div>
              <Input label="Location" placeholder="e.g. Cambridge, MA" />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Passionate about building autonomous systems and embedded hardware."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 resize-none focus:outline-none focus:border-slate-400 focus:bg-white"
                />
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={() => showToast('✅ Profile settings saved!')}>Save Changes</Button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-[#0F172A]">Notification Preferences</h2>
              <p className="text-xs text-slate-500">Choose which notifications you'd like to receive.</p>

              {[
                { key: 'collabRequests', label: 'Collaboration Requests', desc: 'When someone sends you a collaboration request' },
                { key: 'messages', label: 'New Messages', desc: 'When you receive a new message in active chats' },
                { key: 'applicationUpdates', label: 'Application Updates', desc: 'Status changes on your job/grant applications' },
                { key: 'grantMatches', label: 'Grant Matches', desc: 'When new grants matching your skills are posted' },
                { key: 'newConnections', label: 'New Connections', desc: 'When someone connects with you' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'A weekly summary of activity on SkillForge' },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                  <button
                    onClick={() => toggleNotif(key as keyof typeof notifSettings)}
                    className={cn(
                      'w-10 h-6 rounded-full transition-all relative',
                      notifSettings[key as keyof typeof notifSettings] ? 'bg-emerald-500' : 'bg-slate-200'
                    )}
                    role="switch"
                    aria-checked={notifSettings[key as keyof typeof notifSettings]}
                  >
                    <span className={cn(
                      'absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all',
                      notifSettings[key as keyof typeof notifSettings] ? 'left-5' : 'left-1'
                    )} />
                  </button>
                </div>
              ))}

              <Button variant="primary" size="sm" onClick={() => showToast('✅ Notification preferences saved!')}>Save Preferences</Button>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-[#0F172A]">Privacy Settings</h2>

              {[
                { key: 'profileVisibility', label: 'Profile Visibility', desc: 'Make your profile visible to all SkillForge members' },
                { key: 'showSkills', label: 'Show Skills', desc: 'Display your skills on your public profile' },
                { key: 'allowCollabRequests', label: 'Allow Collaboration Requests', desc: 'Let other innovators send you collaboration requests' },
                { key: 'showInExplore', label: 'Show in Explore', desc: 'Appear in the Explore page for other users to discover' },
              ].map(({ key, label, desc }) => {
                const isChecked = privacySettings[key as keyof typeof privacySettings];
                return (
                  <div key={key} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div>
                      <p className="text-xs font-bold text-slate-800">{label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                    <button
                      onClick={() => togglePrivacy(key as keyof typeof privacySettings)}
                      className={cn('w-10 h-6 rounded-full transition-all relative', isChecked ? 'bg-emerald-500' : 'bg-slate-200')}
                      role="switch"
                      aria-checked={isChecked}
                    >
                      <span className={cn('absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all', isChecked ? 'left-5' : 'left-1')} />
                    </button>
                  </div>
                );
              })}

              <Button variant="primary" size="sm" onClick={() => showToast('✅ Privacy settings saved!')}>Save Settings</Button>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
              <h2 className="text-base font-extrabold text-[#0F172A]">Appearance</h2>
              <p className="text-xs text-slate-500">Customize how SkillForge looks for you.</p>

              <div>
                <h3 className="text-xs font-bold text-slate-700 mb-3">Theme</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-slate-200' },
                    { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-slate-900 border-slate-700' },
                  ].map(({ id, label, icon: Icon, preview }) => (
                    <button
                      key={id}
                      className={cn('border-2 rounded-2xl p-4 flex flex-col items-center gap-2 transition-all', id === 'light' ? 'border-[#0F172A] bg-emerald-50' : 'border-slate-200 hover:border-slate-300')}
                      onClick={() => showToast('🌙 Theme setting coming soon!')}
                    >
                      <div className={cn('w-12 h-8 rounded-lg border', preview)} />
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Icon className="w-3.5 h-3.5" /> {label}
                      </div>
                      {id === 'light' && <Check className="w-4 h-4 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

