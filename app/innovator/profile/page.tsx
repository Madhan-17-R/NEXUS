'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit2, MapPin, Globe, Users, FolderKanban, Award, Send, Link2, Code2 } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { mockInnovators } from '@/data/innovator/mockUsers';
import { mockProjects } from '@/data/innovator/mockProjects';
import { Avatar, Button, Badge, SkillBadge } from '@/components/innovator/ui';

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, pitches, sendCollaborationRequest, showToast } = useApp();
  const profile = mockInnovators[0]; // Current user's full profile
  const [connectionStates, setConnectionStates] = useState<Record<string, 'none' | 'pending' | 'connected'>>({});

  const myProjects = mockProjects.filter((p) => p.ownerId === currentUser.id);

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      {/* Profile header card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        {/* Cover */}
        <div className="h-28 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500" />

        <div className="px-6 pb-6">
          {/* Avatar + actions */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="relative">
              <Avatar src={profile.avatar} name={profile.name} size="xl" className="border-4 border-white shadow-md" />
              <Link 
                href="/innovator/settings"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0F172A] text-white flex items-center justify-center shadow-md hover:bg-slate-800"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex gap-2">
              <Link 
                href="/innovator/settings"
                className="inline-flex items-center justify-center gap-1.5 font-extrabold transition-all px-3.5 py-2 text-xs rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 bg-white"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Name + role */}
          <div className="mb-4">
            <h1 className="text-xl font-extrabold text-[#0F172A]">{profile.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="emerald">{profile.professionalStatus}</Badge>
              <Badge variant="slate">{profile.role}</Badge>
            </div>
            {profile.location && (
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {profile.location}
              </p>
            )}
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="text-sm text-slate-600 leading-relaxed mb-4">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex gap-6 py-4 border-y border-slate-100 mb-4">
            <div className="text-center">
              <p className="text-lg font-extrabold text-[#0F172A]">{profile.connectionCount}</p>
              <p className="text-[11px] text-slate-500 font-medium">Connections</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-[#0F172A]">{profile.collaborationCount}</p>
              <p className="text-[11px] text-slate-500 font-medium">Collaborations</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-[#0F172A]">{myProjects.length}</p>
              <p className="text-[11px] text-slate-500 font-medium">Projects</p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-3">
            {profile.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline">
                <Link2 className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:underline">
                <Code2 className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {profile.portfolio && (
              <a href={profile.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline">
                <Globe className="w-3.5 h-3.5" /> Portfolio
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Education / Experience */}
      {profile.education && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">Education</h2>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-lg shrink-0">🎓</div>
            <div>
              <h3 className="text-sm font-extrabold text-[#0F172A]">{profile.education.institution}</h3>
              <p className="text-xs text-slate-600 font-medium">{profile.education.course}</p>
              <p className="text-xs text-slate-400 mt-0.5">{profile.education.fieldOfStudy} • {profile.education.yearOfStudy}</p>
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">Skills</h2>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
        </div>
      </div>

      {/* Domains */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">Domains & Interests</h2>
        <div className="flex flex-wrap gap-2">
          {profile.domains.map((d, i) => (
            <span key={i} className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">{d}</span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4">Projects</h2>
        <div className="space-y-3">
          {myProjects.map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <FolderKanban className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0F172A] truncate">{p.name}</p>
                <p className="text-[11px] text-slate-400 font-medium">{p.status} • {p.domain}</p>
              </div>
              <Badge variant={p.status === 'Active' ? 'emerald' : p.status === 'Completed' ? 'slate' : p.status === 'Planning' ? 'blue' : 'amber'}>
                {p.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* My Pitches */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center justify-between">
          <span>My Pitches & Proposal Submissions</span>
          <Link href="/innovator/funding-organizations" className="text-emerald-700 font-bold hover:underline normal-case text-[11px]">
            Explore Organizations →
          </Link>
        </h2>
        <div className="space-y-3">
          {pitches.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No pitches submitted yet.</p>
          ) : (
            pitches.map((pitch) => {
              const isDirect = pitch.pitchType === 'Direct Pitch' || pitch.grantId === null;
              return (
                <div key={pitch.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#0F172A]">{pitch.ideaTitle}</span>
                    <Badge variant={isDirect ? 'emerald' : 'blue'}>
                      {isDirect ? 'Direct Pitch' : 'Grant Application'}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Organization: <strong className="text-slate-700">{pitch.organizationName || 'Funding Organization'}</strong>
                    {pitch.grantTitle && <span> • Grant: {pitch.grantTitle}</span>}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                    <span>Status: <strong className="text-emerald-700">{pitch.status}</strong></span>
                    <span>Submitted: {pitch.createdAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Other innovators - discover */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          Discover Other Innovators
        </h2>
        <div className="space-y-3">
          {mockInnovators.slice(1, 4).map((u) => (
            <div key={u.id} className="flex items-center gap-3">
              <Avatar src={u.avatar} name={u.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#0F172A] truncate">{u.name}</p>
                <p className="text-[11px] text-slate-400">{u.professionalStatus}</p>
              </div>
              <div className="flex gap-1.5">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => showToast(`🔗 Connection request sent to ${u.name}!`)}
                >
                  Connect
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  leftIcon={<Send className="w-3 h-3" />}
                  onClick={() => {
                    sendCollaborationRequest({
                      fromUserId: currentUser.id,
                      fromUserName: currentUser.name,
                      fromUserAvatar: currentUser.avatar,
                      fromUserRole: currentUser.role,
                      toUserId: u.id,
                      toUserName: u.name,
                      projectTitle: 'Collaboration Opportunity',
                      reason: 'I would like to collaborate with you on an exciting project.',
                      skills: [],
                    });
                  }}
                >
                  Collaborate
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

