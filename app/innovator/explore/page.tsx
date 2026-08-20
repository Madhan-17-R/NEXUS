'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Users, Briefcase, DollarSign, Globe, Zap, GraduationCap, Building2 } from 'lucide-react';
import { mockInnovators } from '@/data/innovator/mockUsers';
import { mockGrants, mockCollaborations } from '@/data/innovator/mockPosts';
import { Avatar, Button, SkillBadge, Badge, EmptyState } from '@/components/innovator/ui';
import { useApp } from '@/context/innovator/AppContext';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type ExploreCategory = 'all' | 'people' | 'grants' | 'collaborations';

const categories = [
  { id: 'all', label: 'All', icon: Zap },
  { id: 'people', label: 'People', icon: Users },
  { id: 'grants', label: 'Grants', icon: DollarSign },
  { id: 'collaborations', label: 'Collaborations', icon: Globe },
];

const popularSkills = ['ROS2', 'Python', 'Machine Learning', 'React', 'Blockchain', 'AI/ML', 'IoT', 'C++', 'TIG Welding', 'NLP', 'Firebase', 'PCB Design'];
const popularDomains = ['Robotics', 'AI', 'FinTech', 'Healthcare', 'IoT', 'Sustainability', 'Blockchain', 'Education'];

export default function ExplorePage() {
  const { showToast } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ExploreCategory>('all');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredPeople = useMemo(() => {
    return mockInnovators.filter((u) => {
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.bio?.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q)) ||
        u.domains.some((d) => d.toLowerCase().includes(q));
      const matchesSkill = !selectedSkill || u.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase());
      const matchesDomain = !selectedDomain || u.domains.some((d) => d.toLowerCase() === selectedDomain.toLowerCase());
      return matchesQuery && matchesSkill && matchesDomain;
    });
  }, [query, selectedSkill, selectedDomain]);



  const filteredGrants = useMemo(() => {
    const q = query.toLowerCase();
    return mockGrants.filter(
      (g) => !q || g.grantTitle.toLowerCase().includes(q) || g.orgName.toLowerCase().includes(q) || g.focusAreas.some((f) => f.toLowerCase().includes(q))
    );
  }, [query]);

  const showPeople = category === 'all' || category === 'people';
  const showGrants = category === 'all' || category === 'grants';
  const showCollaborations = category === 'all' || category === 'collaborations';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Explore</h1>
        <p className="text-xs text-slate-500 mt-0.5">Discover innovators, opportunities, grants, and collaborations</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search people, skills, companies, grants..."
          className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-400 shadow-sm"
        />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {categories.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setCategory(id as ExploreCategory)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0',
              category === id
                ? 'bg-[#0F172A] text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ml-auto',
            showFilters
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-800'
          )}
        >
          <Filter className="w-3.5 h-3.5" />
          Filters
          {(selectedSkill || selectedDomain) && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>
          )}
        </button>
      </div>

      {/* Horizontal Expandable Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 mb-3 uppercase tracking-wider">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkill(selectedSkill === skill ? null : skill)}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-xs font-bold transition-all',
                    selectedSkill === skill
                      ? 'bg-[#0F172A] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  )}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-700 mb-3 uppercase tracking-wider">Domains</h3>
            <div className="flex flex-wrap gap-1.5">
              {popularDomains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(selectedDomain === domain ? null : domain)}
                  className={cn(
                    'px-2 py-0.5 rounded-md text-xs font-bold transition-all',
                    selectedDomain === domain
                      ? 'bg-emerald-700 text-white'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  )}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>

          {(selectedSkill || selectedDomain || query) && (
            <div className="md:col-span-2 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => { setSelectedSkill(null); setSelectedDomain(null); setQuery(''); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results */}
      <div className="space-y-6">
          {/* People */}
          {showPeople && filteredPeople.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Innovators ({filteredPeople.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredPeople.map((user) => (
                  <InnovatorCard key={user.id} user={user} showToast={showToast} />
                ))}
              </div>
            </section>
          )}



          {/* Grants */}
          {showGrants && filteredGrants.length > 0 && (
            <section>
              <h2 className="text-sm font-extrabold text-slate-700 mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-600" />
                Grants ({filteredGrants.length})
              </h2>
              <div className="space-y-3">
                {filteredGrants.map((grant) => (
                  <div key={grant.id} className="bg-white border border-amber-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-lg">
                          {grant.orgLogo}
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#0F172A]">{grant.grantTitle}</h4>
                          <p className="text-xs text-slate-500 font-semibold">{grant.orgName} • Deadline: {grant.deadline}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-300">
                        {grant.fundingAmount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty state */}
          {filteredPeople.length === 0 && filteredGrants.length === 0 && (
            <EmptyState
              icon="🔍"
              title="No results found"
              description="Try different keywords, skills, or domains to discover more."
            />
          )}
        </div>
    </div>
  );
}

function InnovatorCard({ user, showToast }: { user: typeof mockInnovators[0]; showToast: (m: string) => void }) {
  // Use the passed showToast
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start gap-3">
        <Link href={`/profile/${user.id}`}>
          <Avatar src={user.avatar} name={user.name} size="md" className="cursor-pointer hover:opacity-90" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${user.id}`} className="text-sm font-extrabold text-[#0F172A] hover:underline truncate">
              {user.name}
            </Link>
            <Badge variant={user.role === 'Student Innovator' ? 'emerald' : user.role === 'Working Professional' ? 'blue' : 'violet'}>
              {user.professionalStatus}
            </Badge>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
            {user.education?.institution || user.workExperience?.organization || user.location}
          </p>
          {user.bio && <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2">{user.bio}</p>}
          <div className="flex flex-wrap gap-1 mt-2">
            {user.skills.slice(0, 3).map((s: string) => (
              <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">#{s}</span>
            ))}
            {user.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">+{user.skills.length - 3}</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="xs" className="flex-1" onClick={() => showToast(`Connection request sent to ${user.name}!`)}>Connect</Button>
        <Button variant="primary" size="xs" className="flex-1" onClick={() => showToast(`Collaboration request sent to ${user.name}!`)}>Collaborate</Button>
      </div>
    </div>
  );
}

