'use client';

import { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Mail,
  Link as Github,
  Globe,
  FileText,
  Edit3,
  Check,
  X,
  Briefcase,
  Loader2,
} from 'lucide-react';
import AppLayout from '@/components/talent/layout/AppLayout';
import { useAuth } from '@/context/talent/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [displayName, setDisplayName] = useState(user?.displayName || 'Alex Rivera');
  const [title, setTitle] = useState(user?.title || 'Robotics & Embedded Software Engineer');
  const [location, setLocation] = useState(user?.location || 'Boston, MA (Open to Remote)');
  const [bio, setBio] = useState(
    user?.bio ||
      'Passionate robotics software engineer with 3+ years experience building autonomous systems, sensor fusion pipelines, and hardware drivers.'
  );
  const [skillsInput, setSkillsInput] = useState(
    user?.skills ? user.skills.join(', ') : 'ROS2, C++, Python, LIDAR, Embedded C, React, TypeScript'
  );
  const [githubUrl, setGithubUrl] = useState(user?.githubUrl || 'https://github.com/alexrivera-robotics');
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || 'https://alexrivera.dev');

  function handleOpenEdit() {
    if (user) {
      setDisplayName(user.displayName);
      setTitle(user.title || 'Robotics & Embedded Software Engineer');
      setLocation(user.location || 'Boston, MA');
      setBio(user.bio || '');
      setSkillsInput(user.skills ? user.skills.join(', ') : 'ROS2, C++, Python, LIDAR');
      setGithubUrl(user.githubUrl || '');
      setPortfolioUrl(user.portfolioUrl || '');
    }
    setIsEditing(true);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await updateProfile({
      displayName,
      title,
      location,
      bio,
      skills,
      githubUrl,
      portfolioUrl,
    });

    setSaving(false);
    setIsEditing(false);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AppLayout containerClassName="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full space-y-6">
        {/* Main Profile Header Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl shadow-xs p-6 relative overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 absolute top-0 left-0 right-0" />

          <div className="relative pt-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-2xl sm:text-3xl flex items-center justify-center border-4 border-white shadow-md">
                {user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">{user.displayName}</h1>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Job Seeker
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-600 mt-0.5">
                  {user.title || 'Robotics & Embedded Software Engineer'}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {user.location || 'Boston, MA (Open to Remote)'}
                </p>
              </div>
            </div>

            <button
              id="edit-profile-btn"
              onClick={handleOpenEdit}
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Edit3 className="w-4 h-4 text-emerald-400" />
              Edit Candidate Profile
            </button>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: About & Skills & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Bio */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                About / Professional Bio
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {user.bio ||
                  'Passionate robotics software engineer with 3+ years experience building autonomous systems, sensor fusion pipelines, and hardware drivers.'}
              </p>
            </div>

            {/* Skills Chips */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Verified Skills & Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {(user.skills && user.skills.length > 0
                  ? user.skills
                  : ['ROS2', 'C++', 'Python', 'LIDAR', 'Embedded C', 'React', 'TypeScript']
                ).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlighted Experience Timeline */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                Key Experience Highlights
              </h3>

              <div className="space-y-4">
                <div className="border-l-2 border-emerald-500 pl-4 py-0.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900">Robotics Software Intern</h4>
                    <span className="text-xs text-slate-400 font-medium">2024 - Present</span>
                  </div>
                  <p className="text-xs text-emerald-700 font-medium">Apex Robotics Labs</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Developed real-time ROS2 nodes for LIDAR sensor fusion and indoor path planning on autonomous mobile robots.
                  </p>
                </div>

                <div className="border-l-2 border-slate-300 pl-4 py-0.5">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-bold text-slate-900">Full-Stack Developer Contributor</h4>
                    <span className="text-xs text-slate-400 font-medium">2023 - 2024</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Open-Source DeepTech Initiative</p>
                  <p className="text-xs text-slate-600 mt-1">
                    Built React & Next.js dashboard interfaces for real-time telemetry monitoring.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Links & Resume */}
          <div className="space-y-6">
            {/* Contact & Links */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Contact & Portfolio
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-2.5 text-slate-700">
                  <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="truncate font-medium">{user.email}</span>
                </div>

                {user.githubUrl && (
                  <a
                    href={user.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-slate-700 hover:text-emerald-700 transition-colors"
                  >
                    <Github className="w-4 h-4 text-slate-700 flex-shrink-0" />
                    <span className="truncate font-medium">{user.githubUrl}</span>
                  </a>
                )}

                {user.portfolioUrl && (
                  <a
                    href={user.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-emerald-700 font-semibold hover:text-emerald-900 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{user.portfolioUrl}</span>
                  </a>
                )}
              </div>
            </div>

            {/* Active Resume Summary */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Attached Candidate Resume
              </h3>

              <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-600 text-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {user.resumeFileName || 'Alex_Rivera_Robotics_Resume_2026.pdf'}
                  </p>
                  <span className="text-[10px] text-emerald-800 font-semibold">
                    PDF Document · Ready for Quick Apply
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-emerald-600" />
                Edit Candidate Profile
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Professional Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">About / Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}