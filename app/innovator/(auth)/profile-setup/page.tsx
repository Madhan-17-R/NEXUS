'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Zap, ArrowRight, ArrowLeft, Check, User, GraduationCap, Briefcase,
  Code2, Sparkles, CheckCircle2, Globe, Link2
} from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Button, Input, Textarea, SkillBadge, Badge } from '@/components/innovator/ui';
import { cn } from '@/lib/utils';
import type { ProfessionalStatus, UserRole } from '@/types/innovator';

const roles: { role: UserRole; title: string; desc: string; icon: any }[] = [
  {
    role: 'Student Innovator',
    title: 'Student Innovator',
    desc: 'Enrolled in university or college, building hardware or software projects and seeking grants or collaborations.',
    icon: GraduationCap,
  },
  {
    role: 'Working Professional',
    title: 'Working Professional',
    desc: 'Industry professional or engineer looking to mentor, collaborate on side projects, or share technical expertise.',
    icon: Briefcase,
  },
  {
    role: 'Independent Innovator',
    title: 'Independent Innovator',
    desc: 'Entrepreneur, freelancer, or researcher building independent tech solutions or startups.',
    icon: User,
  },
];

const presetSkills = [
  'ROS2', 'Python', 'C++', 'Embedded C', 'LIDAR', 'Computer Vision', 'PCB Design',
  'SolidWorks', 'TensorFlow', 'PyTorch', 'React', 'Node.js', 'Solidity', 'Arduino',
  'TIG Welding', 'CNC Machining', 'MQTT', 'AWS', 'NLP'
];

const presetDomains = [
  'Robotics', 'AI & Machine Learning', 'IoT & Hardware', 'FinTech & Blockchain',
  'Healthcare & BioTech', 'Clean Energy & Sustainability', 'Agriculture Tech', 'Cybersecurity'
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const { login, showToast } = useApp();
  const [step, setStep] = useState(1);

  // Form State
  const [role, setRole] = useState<UserRole>('Student Innovator');
  const [professionalStatus, setProfessionalStatus] = useState<ProfessionalStatus>('Student');
  const [location, setLocation] = useState('Cambridge, MA');

  // Education / Work
  const [institution, setInstitution] = useState('MIT Innovation Lab');
  const [course, setCourse] = useState('B.Tech Robotics Engineering');
  const [fieldOfStudy, setFieldOfStudy] = useState('Autonomous Systems');
  const [yearOfStudy, setYearOfStudy] = useState('3rd Year');

  const [organization, setOrganization] = useState('');
  const [designation, setDesignation] = useState('');
  const [yearsExp, setYearsExp] = useState('');

  // Skills & Domains
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['ROS2', 'Python', 'C++', 'Computer Vision']);
  const [customSkill, setCustomSkill] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>(['Robotics', 'IoT', 'AI']);

  // Links & Bio
  const [bio, setBio] = useState('Passionate about building autonomous systems and embedded hardware.');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const toggleDomain = (domain: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domain) ? prev.filter((d) => d !== domain) : [...prev, domain]
    );
  };

  const handleFinish = async () => {
    login({
      role,
      profileComplete: true,
    });
    showToast('🎉 Profile setup complete! Welcome to SkillForge.');
    router.push('/innovator/feed');
  };

  return (
    <div className="w-full max-w-2xl animate-fade-in my-8">
      {/* Header */}
      <div className="flex items-center gap-2 justify-center mb-6">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <span className="font-extrabold text-2xl text-white tracking-tight">SkillForge</span>
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 text-xs font-extrabold text-slate-300">
            <span>STEP {step} OF 4</span>
            <span className="text-emerald-400">
              {step === 1 && 'Role & Status'}
              {step === 2 && 'Education & Work'}
              {step === 3 && 'Skills & Focus'}
              {step === 4 && 'Bio & Socials'}
            </span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden flex gap-1 p-0.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-full flex-1 rounded-full transition-all duration-300',
                  i <= step ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-transparent'
                )}
              />
            ))}
          </div>
        </div>

        {/* ── STEP 1: ROLE & STATUS ── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Select Your Innovator Role</h2>
              <p className="text-xs text-slate-400 mt-1">Choose how you plan to engage on SkillForge</p>
            </div>

            <div className="space-y-3">
              {roles.map(({ role: r, title, desc, icon: Icon }) => (
                <div
                  key={r}
                  onClick={() => {
                    setRole(r);
                    setProfessionalStatus(
                      r === 'Student Innovator' ? 'Student' : r === 'Working Professional' ? 'Working Professional' : 'Independent Innovator'
                    );
                  }}
                  className={cn(
                    'p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4',
                    role === r
                      ? 'border-emerald-400 bg-emerald-500/10 shadow-lg'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}
                >
                  <div className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5',
                    role === r ? 'bg-emerald-500 text-white' : 'bg-white/10 text-slate-400'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-white">{title}</h3>
                      {role === r && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Cambridge, MA or Remote"
                className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: EDUCATION / EXPERIENCE ── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {role === 'Student Innovator' ? 'Academic Information' : 'Professional Background'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Help others understand your background</p>
            </div>

            {role === 'Student Innovator' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Institution / University *</label>
                  <input
                    type="text"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. MIT Innovation Lab"
                    className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Course / Degree *</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g. B.Tech Robotics Engineering"
                    className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Field of Study</label>
                    <input
                      type="text"
                      value={fieldOfStudy}
                      onChange={(e) => setFieldOfStudy(e.target.value)}
                      placeholder="e.g. Autonomous Systems"
                      className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Year of Study</label>
                    <select
                      value={yearOfStudy}
                      onChange={(e) => setYearOfStudy(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm bg-slate-800 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Current Company / Organization</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Quantum Power Systems"
                    className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Designation / Role</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Senior Systems Engineer"
                    className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">Years of Experience</label>
                  <input
                    type="text"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    placeholder="e.g. 5+ years"
                    className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 3: SKILLS & DOMAINS ── */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Skills & Primary Domains</h2>
              <p className="text-xs text-slate-400 mt-1">Select topics you specialize in or want to collaborate on</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Technical Skills (Click to toggle)</label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
                {presetSkills.map((skill) => {
                  const selected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                        selected
                          ? 'bg-emerald-500 text-white shadow-md scale-105'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      )}
                    >
                      {selected ? '✓ ' : '+ '}#{skill}
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill */}
              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                  placeholder="Add custom skill..."
                  className="flex-1 px-3.5 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2">Focus Domains</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {presetDomains.map((domain) => {
                  const selected = selectedDomains.includes(domain);
                  return (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => toggleDomain(domain)}
                      className={cn(
                        'p-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between',
                        selected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                      )}
                    >
                      <span>{domain}</span>
                      {selected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: BIO & SOCIAL LINKS ── */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-extrabold text-white">Bio & Web Links</h2>
              <p className="text-xs text-slate-400 mt-1">Complete your innovator showcase profile</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Short Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell potential collaborators or funders about what you build and what drives you..."
                className="w-full px-4 py-3 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 resize-none focus:outline-none focus:border-emerald-400 font-medium"
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">GitHub Profile URL</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Portfolio / Website URL</label>
                <input
                  type="text"
                  value={portfolio}
                  onChange={(e) => setPortfolio(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full px-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:opacity-95 text-[#0F172A] rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all"
            >
              Complete Setup <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
