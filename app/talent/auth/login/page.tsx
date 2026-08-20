'use client';

import Image from "next/image";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, ArrowLeft, Zap,
} from 'lucide-react';
import { cn, validateEmail } from '@/lib/utils';
import { useAuth } from '@/context/talent/AuthContext';

type LoginTab = 'email' | 'otp';

export default function TalentLoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [tab, setTab] = useState<LoginTab>('email');

  // Email+Password state
  const [email, setEmail] = useState('alex@skillforge.io');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [otpEmail, setOtpEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpVerifying, setOtpVerifying] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    try {
      await signIn(email, password);
      router.push('/talent/');
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Sign in failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(otpEmail)) {
      setErrors({ otpEmail: 'Invalid email address' });
      return;
    }
    setErrors({});
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setOtpSent(true);
  };

  const handleOtpInput = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      document.getElementById(`otp-${idx + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpVerifying(true);
    await new Promise((r) => setTimeout(r, 1000));
    router.push('/talent/');
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
          <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-slate-400 mb-6">Sign in to your Talent account</p>

          {/* Tab selector */}
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
            {[
              { id: 'email', label: 'Password' },
              { id: 'otp', label: 'Email OTP' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id as LoginTab)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-xs font-bold transition-all',
                  tab === id ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-400 hover:text-white'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {errors.form && (
            <div className="p-3 mb-4 rounded-xl bg-red-500/10 text-red-400 text-sm font-medium border border-red-500/20 text-center">
              {errors.form}
            </div>
          )}

          {/* Email + Password */}
          {tab === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@skillforge.io"
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

              <div className="flex justify-end">
                <button type="button" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-[#0F172A] py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all shadow-sm disabled:opacity-70"
              >
                {isLoading ? (
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <><ArrowRight className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>
          )}

          {/* OTP Flow */}
          {tab === 'otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                      <input
                        type="email"
                        value={otpEmail}
                        onChange={(e) => setOtpEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-white/15 focus:border-white/40 font-medium"
                      />
                    </div>
                    {errors.otpEmail && <p className="text-xs text-red-400 mt-1">{errors.otpEmail}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-500 text-white py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all disabled:opacity-70"
                  >
                    {isLoading ? 'Sending...' : <><Mail className="w-4 h-4" /> Send OTP</>}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-5">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-sm text-slate-300 font-medium">OTP sent to <span className="text-white font-bold">{otpEmail}</span></p>
                    <p className="text-xs text-slate-500 mt-1">Enter the 6-digit code below</p>
                  </div>
                  <div className="flex gap-2 justify-center">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        className="w-11 h-12 text-center text-lg font-extrabold bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-emerald-500 focus:bg-white/15"
                      />
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={otpVerifying || otp.some((d) => !d)}
                    className="w-full bg-white text-[#0F172A] py-3 rounded-xl text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-slate-100 transition-all disabled:opacity-70"
                  >
                    {otpVerifying ? 'Verifying...' : <><Check className="w-4 h-4" /> Verify OTP</>}
                  </button>
                  <button type="button" className="w-full text-xs text-slate-400 hover:text-slate-300" onClick={() => setOtpSent(false)}>
                    ← Change email
                  </button>
                </form>
              )}
            </div>
          )}

          <p className="text-center text-xs text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link href="/talent/auth/register" className="text-emerald-400 font-bold hover:text-emerald-300">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
