'use client';

import React, { useState } from 'react';
import { Plus, FolderKanban, CheckSquare, Users, Zap, Clock, TrendingUp, ChevronRight, ChevronDown } from 'lucide-react';
import { mockProjects } from '@/data/innovator/mockProjects';
import { Button, Badge, Avatar, EmptyState, Tabs } from '@/components/innovator/ui';
import { getProjectStatusColor, cn } from '@/lib/utils';
import type { Project, Task } from '@/types/innovator';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectTab, setProjectTab] = useState('overview');

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        activeTab={projectTab}
        onTabChange={setProjectTab}
        onBack={() => { setSelectedProject(null); setProjectTab('overview'); }}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">My Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your innovation projects and team</p>
        </div>
        <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
          New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total', value: mockProjects.length, icon: FolderKanban, color: 'text-blue-600' },
          { label: 'Active', value: mockProjects.filter((p) => p.status === 'Active').length, icon: Zap, color: 'text-emerald-600' },
          { label: 'Planning', value: mockProjects.filter((p) => p.status === 'Planning').length, icon: Clock, color: 'text-amber-600' },
          { label: 'Completed', value: mockProjects.filter((p) => p.status === 'Completed').length, icon: CheckSquare, color: 'text-violet-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <Icon className={cn('w-4 h-4 mb-2', color)} />
            <p className="text-2xl font-extrabold text-[#0F172A]">{value}</p>
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={() => setSelectedProject(project)} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <div
      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 pr-3">
          <h3 className="font-extrabold text-sm text-[#0F172A] leading-tight">{project.name}</h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">{project.domain}</p>
        </div>
        <span className={cn('px-2.5 py-1 rounded-lg text-xs font-bold border shrink-0', getProjectStatusColor(project.status))}>
          {project.status}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">{project.description}</p>

      {/* Progress */}
      {project.progress !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
            <span>Progress</span>
            <span className="text-[#0F172A]">{project.progress}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {project.skills.slice(0, 3).map((s, i) => (
          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">#{s}</span>
        ))}
        {project.skills.length > 3 && (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">+{project.skills.length - 3}</span>
        )}
      </div>

      {/* Team */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex -space-x-2">
          {project.teamMembers.slice(0, 3).map((member, i) => (
            <Avatar key={i} src={member.avatar} name={member.name} size="xs" className="border-2 border-white" />
          ))}
          {project.teamMembers.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[9px] font-bold text-slate-600">
              +{project.teamMembers.length - 3}
            </div>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
}

const projectDetailTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'team', label: 'Team' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'updates', label: 'Updates' },
];

function ProjectDetail({
  project,
  activeTab,
  onTabChange,
  onBack,
}: {
  project: Project;
  activeTab: string;
  onTabChange: (t: string) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-700 font-bold text-sm flex items-center gap-1">
          ← Back
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-[#0F172A] leading-tight">{project.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn('px-2 py-0.5 rounded-lg text-xs font-bold border', getProjectStatusColor(project.status))}>{project.status}</span>
            <span className="text-xs text-slate-500">{project.domain}</span>
          </div>
        </div>
      </div>

      <Tabs tabs={projectDetailTabs} activeTab={activeTab} onChange={onTabChange} variant="underline" />

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-700 leading-relaxed">{project.description}</p>
          </div>
          {project.progress !== undefined && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Progress</h3>
                <span className="text-lg font-extrabold text-[#0F172A]">{project.progress}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" style={{ width: `${project.progress}%` }} />
              </div>
            </div>
          )}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((s, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">#{s}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-3">
          {project.teamMembers.map((member, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center gap-4">
              <Avatar src={member.avatar} name={member.name} size="md" />
              <div>
                <h4 className="text-sm font-extrabold text-[#0F172A]">{member.name}</h4>
                <p className="text-xs text-slate-500 font-medium">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-2">
          {(project.tasks || []).map((task) => (
            <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-3">
              <div
                className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0',
                  task.status === 'done' ? 'bg-emerald-500 border-emerald-500' : task.status === 'in-progress' ? 'border-amber-500' : 'border-slate-300'
                )}
              >
                {task.status === 'done' && <span className="text-white text-[10px] font-black">✓</span>}
              </div>
              <span className={cn('text-sm font-semibold flex-1', task.status === 'done' && 'line-through text-slate-400')}>{task.title}</span>
              <Badge
                variant={task.status === 'done' ? 'emerald' : task.status === 'in-progress' ? 'amber' : 'slate'}
              >
                {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'updates' && (
        <div className="space-y-3">
          {(project.updates || []).map((update) => (
            <div key={update.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-600">{update.author}</span>
                <span className="text-[11px] text-slate-400 ml-auto">{update.createdAt}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{update.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

