'use client';

import Image from "next/image";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Menu, X, ChevronDown } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/contact', label: 'Contact' },
];

const roleLinks = [
  { href: '/innovator/login', label: 'Innovator', color: 'text-emerald-600', bg: 'hover:bg-emerald-50' },
  { href: '/talent/auth/login', label: 'Job Seeker', color: 'text-blue-600', bg: 'hover:bg-blue-50' },
  { href: '/organization/login', label: 'Organization / Company', color: 'text-violet-600', bg: 'hover:bg-violet-50' },
  { href: '/funding/login', label: 'Funding Organization', color: 'text-amber-600', bg: 'hover:bg-amber-50' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginDropdown, setLoginDropdown] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image src="/skillforge-logo.png" alt="SkillForge Logo" width={140} height={40} className="object-contain" priority />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  scrolled
                    ? 'text-slate-600 hover:text-[#0F172A] hover:bg-slate-100'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Login Dropdown */}
            <div className="relative">
              <button
                id="navbar-login-btn"
                onClick={() => setLoginDropdown((p) => !p)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  scrolled
                    ? 'text-[#0F172A] hover:bg-slate-100 border border-slate-200'
                    : 'text-white border border-white/30 hover:bg-white/10'
                }`}
              >
                Login
                <ChevronDown className={`w-4 h-4 transition-transform ${loginDropdown ? 'rotate-180' : ''}`} />
              </button>

              {loginDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLoginDropdown(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl z-50 py-2 animate-fade-in">
                    <p className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Login As
                    </p>
                    {roleLinks.map((r) => (
                      <Link
                        key={r.href}
                        href={r.href}
                        onClick={() => setLoginDropdown(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold ${r.color} ${r.bg} transition-colors`}
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Mobile menu button */}
          <button
            className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              scrolled ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-4 px-4 shadow-lg animate-fade-in">
          <nav className="space-y-1 mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <p className="px-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Login As</p>
            {roleLinks.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${r.color} ${r.bg} transition-colors`}
              >
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
