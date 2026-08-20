'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';

const stats = [
  { value: '10,000+', label: 'Innovators' },
  { value: '500+', label: 'Organizations' },
  { value: '₹50Cr+', label: 'Funding Facilitated' },
  { value: '200+', label: 'Successful Pitches' },
];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen hero-gradient flex flex-col items-center justify-center px-4 pt-16 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-blue-500/8 rounded-full blur-3xl animate-float delay-300" />
      <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-violet-500/8 rounded-full blur-3xl animate-float delay-500" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-white/80 tracking-wide">One Platform. Four Powerful Portals.</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6 animate-fade-in-up delay-100">
          Connecting{' '}
          <span className="gradient-text">Ideas,</span>
          <br />
          Talent, Organizations
          <br />
          <span className="text-white/90">&amp; Funding.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in-up delay-200">
          An integrated digital platform that connects innovators, talented individuals, organizations
          and funding bodies to transform ideas into meaningful opportunities and real-world impact.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
          <Link
            href="#roles"
            id="hero-get-started-btn"
            className="group flex items-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-sm font-extrabold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            id="hero-explore-btn"
            className="flex items-center gap-2 px-7 py-3.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-2xl text-sm font-bold transition-all backdrop-blur-sm"
          >
            Explore the Platform
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-up delay-400">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs text-white/50 font-semibold mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-white/30" />
      </div>
    </section>
  );
}
