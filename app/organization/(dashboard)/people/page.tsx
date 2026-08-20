"use client";

import { Search, Filter, MapPin, Briefcase, Award, ExternalLink, Bookmark } from "lucide-react";

export default function PeopleDiscoveryPage() {
  const talents = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Frontend Developer",
      type: "Skilled Worker",
      avatar: "SJ",
      experience: "3 Years",
      location: "Remote (US)",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      about: "Passionate UI engineer with experience building scalable design systems and accessible web applications.",
      availability: "Open to Full-time"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "AI Researcher",
      type: "Student Innovator",
      avatar: "MC",
      experience: "Fresher",
      location: "San Jose, CA",
      skills: ["Python", "PyTorch", "Computer Vision", "C++"],
      about: "Master's student focusing on computer vision in robotics. Looking for internships or collaborative research projects.",
      availability: "Open to Internship"
    },
    {
      id: 3,
      name: "Priya Patel",
      role: "UX Designer",
      type: "Skilled Worker",
      avatar: "PP",
      experience: "5+ Years",
      location: "London, UK (Remote)",
      skills: ["Figma", "User Research", "Prototyping", "Wireframing"],
      about: "Senior product designer specializing in complex enterprise software and developer tools.",
      availability: "Freelance / Contract"
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-brand-foreground">Talent Discovery</h1>
        <p className="text-brand-foreground/70 text-sm mt-1">Find the perfect Student Innovators or Skilled Workers for your opportunities.</p>
      </div>

      {/* Advanced Search & Filters */}
      <div className="card p-5">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-brand-border rounded-xl bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-colors"
              placeholder="Search by name, skill, technology, or role..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <select className="block w-full pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white">
              <option>Any Role</option>
              <option>Frontend Developer</option>
              <option>AI/ML Engineer</option>
              <option>UX Designer</option>
              <option>Robotics Engineer</option>
            </select>
            <select className="block w-full pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white">
              <option>Any Experience</option>
              <option>Fresher</option>
              <option>0-2 Years</option>
              <option>2-5 Years</option>
              <option>5+ Years</option>
            </select>
            <select className="block w-full pl-3 pr-8 py-2 text-sm border border-brand-border focus:outline-none focus:ring-brand-primary focus:border-brand-primary rounded-lg bg-white">
              <option>User Type</option>
              <option>Student Innovator</option>
              <option>Skilled Worker</option>
            </select>
            <button className="flex items-center justify-center gap-2 py-2 border border-brand-border rounded-lg text-gray-600 hover:text-brand-primary hover:bg-gray-50 transition-colors text-sm font-medium">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {talents.map(talent => (
          <div key={talent.id} className="card p-0 flex flex-col hover:border-brand-primary/30 transition-colors group">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center text-white font-bold text-lg">
                    {talent.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-foreground group-hover:text-brand-primary transition-colors cursor-pointer">
                      {talent.name}
                    </h3>
                    <p className="text-xs font-medium text-brand-primary bg-brand-mint inline-block px-2 py-0.5 rounded-full mt-1">
                      {talent.type}
                    </p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-brand-primary transition-colors">
                  <Bookmark className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="font-medium text-brand-foreground text-sm">{talent.role}</p>
                <div className="flex flex-col gap-1.5 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-brand-foreground/70">
                    <Briefcase className="w-3.5 h-3.5" /> {talent.experience}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-brand-foreground/70">
                    <MapPin className="w-3.5 h-3.5" /> {talent.location}
                  </span>
                </div>
              </div>

              <p className="text-sm text-brand-foreground/80 line-clamp-2 mb-4">
                "{talent.about}"
              </p>

              <div className="flex flex-wrap gap-1.5">
                {talent.skills.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-xs text-brand-foreground/70 rounded-md">
                    {skill}
                  </span>
                ))}
                {talent.skills.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 text-xs text-brand-foreground/70 rounded-md">
                    +{talent.skills.length - 3}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-4 border-t border-brand-border bg-gray-50 flex items-center justify-between mt-auto rounded-b-xl">
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-100/50 px-2 py-1 rounded-md">
                <Award className="w-3.5 h-3.5" /> {talent.availability}
              </div>
              <button className="text-sm font-bold text-brand-primary hover:text-brand-primary-hover flex items-center gap-1">
                View Profile <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
