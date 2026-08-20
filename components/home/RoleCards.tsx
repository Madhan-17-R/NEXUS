'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, GraduationCap, Building2, DollarSign, ArrowRight } from 'lucide-react';

const roles = [
  {
    id: 'innovator',
    title: 'Innovator',
    description:
      'Showcase your ideas, projects and innovations, connect with organizations and explore funding opportunities.',
    icon: Lightbulb,
    loginHref: '/innovator/login',
    registerHref: '/innovator/register',
    ctaLabel: 'Continue as Innovator',
    cardClass: 'role-card-innovator',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    accentColor: 'from-emerald-500/20',
    borderHover: 'hover:border-emerald-300',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700',
    badge: 'Innovate',
    badgeBg: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'talent',
    title: 'Job Seeker',
    description:
      'Showcase your skills, discover relevant opportunities and connect with organizations looking for talented individuals.',
    icon: GraduationCap,
    loginHref: '/talent/auth/login',
    registerHref: '/talent/auth/register',
    ctaLabel: 'Continue as Job Seeker',
    cardClass: 'role-card-talent',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    accentColor: 'from-blue-500/20',
    borderHover: 'hover:border-blue-300',
    btnClass: 'bg-blue-600 hover:bg-blue-700',
    badge: 'Discover',
    badgeBg: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'organization',
    title: 'Organization / Company',
    description:
      'Discover talented individuals and innovative projects, collaborate and build meaningful partnerships.',
    icon: Building2,
    loginHref: '/organization/login',
    registerHref: '/organization/register',
    ctaLabel: 'Continue as Organization',
    cardClass: 'role-card-org',
    iconBg: 'bg-violet-100',
    iconColor: 'text-violet-700',
    accentColor: 'from-violet-500/20',
    borderHover: 'hover:border-violet-300',
    btnClass: 'bg-violet-600 hover:bg-violet-700',
    badge: 'Hire & Partner',
    badgeBg: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'funding',
    title: 'Funding Organization',
    description:
      'Discover promising innovations, review funding applications and support high-potential projects and startups.',
    icon: DollarSign,
    loginHref: '/funding/login',
    registerHref: '/funding/register',
    ctaLabel: 'Enter Funding Portal',
    cardClass: 'role-card-funding',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    accentColor: 'from-amber-500/20',
    borderHover: 'hover:border-amber-300',
    btnClass: 'bg-amber-600 hover:bg-amber-700',
    badge: 'Fund & Grow',
    badgeBg: 'bg-amber-100 text-amber-700',
  },
];

export default function RoleCards() {
  return (
    <section id="roles" className="py-24 px-4 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest rounded-full mb-4">
            Choose Your Role
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] mb-4">
            Who are you on SkillForge?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Select your role to access your dedicated portal and connect with the right people.
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                id={`role-card-${role.id}`}
                className={`group relative bg-white border border-slate-200 rounded-3xl p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${role.cardClass} ${role.borderHover} cursor-pointer animate-fade-in-up`}
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both', opacity: 0 }}
              >
                {/* Top gradient accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-3xl bg-gradient-to-r ${role.accentColor} to-transparent`} />

                {/* Badge */}
                <span className={`self-start text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full mb-4 ${role.badgeBg}`}>
                  {role.badge}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl ${role.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${role.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-extrabold text-[#0F172A] mb-2">{role.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{role.description}</p>

                {/* CTA Button */}
                <Link
                  href={role.loginHref}
                  id={`role-${role.id}-btn`}
                  className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${role.btnClass} shadow-sm`}
                >
                  {role.ctaLabel}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Register link */}
                <Link
                  href={role.registerHref}
                  className="mt-2 text-center text-xs text-slate-400 hover:text-slate-600 font-semibold transition-colors"
                >
                  New? Create account →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
