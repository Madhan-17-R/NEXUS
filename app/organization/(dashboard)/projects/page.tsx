"use client";

import Link from "next/link";
import { Plus, FolderKanban, Users, Calendar, ArrowRight } from "lucide-react";

export default function ProjectsPage() {
  const projects = [
    {
      id: "PRJ-001",
      name: "Control Interface v2.0",
      description: "Next-generation web-based control panel for autonomous robotic arms. Includes real-time 3D visualization and telemetry.",
      industry: "Robotics",
      technologies: ["React", "Three.js", "WebSocket"],
      status: "Development",
      teamSize: 12,
      startDate: "2026-01-15",
      activeOpportunities: 2
    },
    {
      id: "PRJ-002",
      name: "Autonomous Navigation Model",
      description: "Machine learning model designed for LiDAR-based dynamic pathfinding in unpredictable industrial environments.",
      industry: "AI/ML",
      technologies: ["Python", "TensorFlow", "ROS2"],
      status: "Research",
      teamSize: 5,
      startDate: "2026-05-10",
      activeOpportunities: 1
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-foreground">Projects</h1>
          <p className="text-brand-foreground/70 text-sm mt-1">Showcase your ongoing initiatives and connect them to recruitment.</p>
        </div>
        <Link 
          href="/organization/projects/create" 
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary-hover transition-colors text-sm shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="card p-0 overflow-hidden flex flex-col hover:border-brand-primary/30 transition-colors">
            <div className="h-32 bg-slate-800 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  project.status === 'Development' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                  'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                }`}>
                  {project.status}
                </span>
                <span className="text-white/80 text-xs font-medium">
                  Started {project.startDate}
                </span>
              </div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-brand-foreground mb-2">{project.name}</h3>
              <p className="text-sm text-brand-foreground/70 mb-4 flex-1">{project.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-2 py-1 bg-gray-50 border border-brand-border text-xs text-brand-foreground/60 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between border-t border-brand-border pt-4 mt-auto">
                <div className="flex items-center gap-4 text-xs text-brand-foreground/60">
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {project.teamSize} Members</span>
                </div>
                {project.activeOpportunities > 0 && (
                  <Link href={`/company/opportunities?project=${project.id}`} className="text-xs font-medium text-brand-primary flex items-center gap-1 hover:underline">
                    {project.activeOpportunities} Active Roles <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
