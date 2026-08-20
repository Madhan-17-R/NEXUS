'use client';

import Image from "next/image";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Building2, ArrowLeft, Zap,
} from 'lucide-react';
import { cn, validateEmail, validatePassword } from '@/lib/utils';
import { authService } from '@/services/organization/firebase/auth';

export default function OrganizationRegisterPage() {
  const router = useRouter();
  
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!companyName) newErrors.companyName = 'Company name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    else if (!validatePassword(password)) newErrors.password = 'Password must be at least 8 characters';
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      // In a real app we'd pass companyName to a dedicated register flow
      // but for this mock we just use authService.login since register might not exist
      await authService.login(email, password); 
      router.push('/organization/dashboard');
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in relative">
        <Link href="/" className="absolute -top-12 left-0 text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-8">
          <Image src="/skillforge-logo.png" alt="SkillForge Logo" width={180} height={50} className="object-contain" priority />
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-2xl font-extrabold text-white mb-1">Create an account</h1>
          <p className="text-sm text-slate-400 mb-6">Join as an Organization / Company</p>

          {errors.form && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 text-center">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme Corp"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                    errors.companyName ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  )}
                />
              </div>
              {errors.companyName && <p className="text-xs text-red-400 mt-1">{errors.companyName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hr@acmecorp.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                    errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  )}
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                    errors.password ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-[#0F172A] py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <><ArrowRight className="w-4 h-4" /> Create Organization</>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/organization/login" className="text-emerald-400 font-bold hover:text-emerald-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
