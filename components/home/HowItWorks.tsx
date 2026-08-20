'use client';

import React from 'react';
import { UserCircle, Search, Handshake, Rocket } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: UserCircle,
    title: 'Choose Your Role',
    description:
      'Select whether you are an Innovator, Student/Talent, Organization, or Funding Organization to access your dedicated portal.',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
  },
  {
    number: '02',
    icon: Search,
    title: 'Build Your Profile',
    description:
      'Create a compelling profile showcasing your ideas, skills, projects, or organizational capabilities to attract the right connections.',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-100',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Connect & Collaborate',
    description:
      'Discover relevant opportunities, connect with the right people, and build meaningful collaborations across the ecosystem.',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Grow & Impact',
    description:
      'Turn your ideas into reality. Secure funding, launch projects, find talent, and create meaningful real-world impact.',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
            Your journey on SkillForge
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Four simple steps to start transforming ideas into impact.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-slate-200 to-transparent z-0" />
                )}

                <div className={`relative bg-white border ${step.border} rounded-2xl p-6 text-center`}>
                  {/* Step number */}
                  <span className="text-[10px] font-black text-slate-300 tracking-widest">{step.number}</span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center mx-auto mt-2 mb-4`}>
                    <Icon className={`w-7 h-7 ${step.color}`} />
                  </div>

                  <h3 className="text-base font-extrabold text-[#0F172A] mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
