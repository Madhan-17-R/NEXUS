'use client';

import Image from "next/image";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, ArrowLeft, Check, AlertCircle, Zap,
} from 'lucide-react';
import { validateEmail, validatePassword, cn } from '@/lib/utils';

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const update = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!validateEmail(form.email)) newErrors.email = 'Invalid email address';
    const pwdValidation = validatePassword(form.password);
    if (!form.password) newErrors.password = 'Password is required';
    else if (!pwdValidation.valid) newErrors.password = pwdValidation.message;
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!agreed) newErrors.agreed = 'You must accept the terms';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    router.push('/innovator/profile-setup');
  };

  const passwordStrength = form.password.length >= 8 && /[A-Z]/.test(form.password) && /[0-9]/.test(form.password) ? 'strong' :
    form.password.length >= 6 ? 'medium' : form.password.length > 0 ? 'weak' : null;

  return (
    <div className="w-full max-w-md animate-fade-in relative">
      <Link href="/" className="absolute -top-12 left-0 text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
      {/* Logo */}
      <div className="flex items-center gap-2 justify-center mb-8">
        <Image src="/skillforge-logo.png" alt="SkillForge Logo" width={180} height={50} className="object-contain" priority />
      </div>

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
        <h1 className="text-2xl font-extrabold text-white mb-1">Create your account</h1>
        <p className="text-sm text-slate-400 mb-6">Join the SkillForge innovation ecosystem</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={form.fullName}
                onChange={update('fullName')}
                placeholder="Alex Rivera"
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                  errors.fullName ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                )}
              />
            </div>
            {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Email *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="alex@mit.edu"
                className={cn(
                  'w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                  errors.email ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                )}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={update('password')}
                placeholder="••••••••"
                className={cn(
                  'w-full pl-10 pr-10 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                  errors.password ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                )}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex gap-1 flex-1">
                  {['weak', 'medium', 'strong'].map((level) => (
                    <div
                      key={level}
                      className={cn(
                        'h-1 flex-1 rounded-full transition-all',
                        passwordStrength === 'strong' ? 'bg-emerald-500' :
                        passwordStrength === 'medium' && level !== 'strong' ? 'bg-amber-500' :
                        passwordStrength === 'weak' && level === 'weak' ? 'bg-red-500' :
                        'bg-white/10'
                      )}
                    />
                  ))}
                </div>
                <span className={cn('text-[11px] font-bold', passwordStrength === 'strong' ? 'text-emerald-400' : passwordStrength === 'medium' ? 'text-amber-400' : 'text-red-400')}>
                  {passwordStrength}
                </span>
              </div>
            )}
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Re-enter Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                placeholder="••••••••"
                className={cn(
                  'w-full pl-10 pr-10 py-2.5 text-sm bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 font-medium',
                  errors.confirmPassword ? 'border-red-500' : 'border-white/20 focus:border-white/40'
                )}
              />
              {form.confirmPassword && form.password === form.confirmPassword && (
                <Check className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400" />
              )}
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed(!agreed)}
              className={cn(
                'w-4 h-4 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all',
                agreed ? 'bg-emerald-500 border-emerald-500' : 'border-white/30 bg-transparent'
              )}
              aria-checked={agreed}
              role="checkbox"
            >
              {agreed && <Check className="w-3 h-3 text-white" />}
            </button>
            <span className="text-xs text-slate-400">
              I agree to SkillForge's{' '}
              <span className="text-emerald-400 hover:underline cursor-pointer font-bold">Terms of Service</span>
              {' '}and{' '}
              <span className="text-emerald-400 hover:underline cursor-pointer font-bold">Privacy Policy</span>
            </span>
          </label>
          {errors.agreed && <p className="text-xs text-red-400 -mt-2">{errors.agreed}</p>}

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
              <><ArrowRight className="w-4 h-4" /> Create Account</>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account?{' '}
          <Link href="/innovator/login" className="text-emerald-400 font-bold hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
