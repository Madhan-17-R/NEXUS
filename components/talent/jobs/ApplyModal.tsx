'use client';

import { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Briefcase,
  MapPin,
  DollarSign,
} from 'lucide-react';
import { JobPost } from '@/types/talent';
import { submitApplication } from '@/lib/talent/firebase/api';
import { useAuth } from '@/context/talent/AuthContext';

interface ApplyModalProps {
  job: JobPost;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

type Step = 'form' | 'submitting' | 'success';

export default function ApplyModal({ job, onClose, onSuccess }: ApplyModalProps) {
  const { user, refreshAppliedJobs } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [pitch, setPitch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const salaryText = job.salaryMin
    ? `$${(job.salaryMin / 1000).toFixed(0)}k – $${(job.salaryMax! / 1000).toFixed(0)}k / ${job.salaryUnit}`
    : null;

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf') || file.name.endsWith('.docx'))) {
      setResumeFile(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!resumeFile) {
      setError('Please upload your resume to continue.');
      return;
    }

    setStep('submitting');
    setError('');

    try {
      await submitApplication(job.id, user.uid, {
        resumeFileName: resumeFile.name,
        portfolioUrl: portfolioUrl || undefined,
        pitch: pitch || undefined,
      });
      refreshAppliedJobs();
      setStep('success');
      setTimeout(() => onSuccess(job.id), 1800);
    } catch (err) {
      setStep('form');
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
                {salaryText && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <DollarSign className="w-3.5 h-3.5" />
                    {salaryText}
                  </span>
                )}
              </div>
            </div>
            <button
              id="apply-modal-close"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-9 h-9 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
            <p className="text-slate-500 text-sm max-w-xs">
              Your application to <strong>{job.company}</strong> has been received. We&apos;ll notify you of any updates.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Resume Dropzone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Resume / CV <span className="text-red-500">*</span>
              </label>
              <div
                id="resume-dropzone"
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                  ${isDragging
                    ? 'border-emerald-400 bg-emerald-50 scale-[1.01]'
                    : resumeFile
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30'
                  }`}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setResumeFile(f);
                  }}
                />
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-slate-800">{resumeFile.name}</p>
                      <p className="text-xs text-slate-500">{(resumeFile.size / 1024).toFixed(0)} KB · Click to change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Upload className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">Drop your resume here</p>
                    <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX · Max 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Portfolio URL */}
            <div>
              <label htmlFor="portfolio-url" className="block text-sm font-semibold text-slate-700 mb-2">
                Portfolio / GitHub URL <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="portfolio-url"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
                             placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Pitch */}
            <div>
              <label htmlFor="pitch-textarea" className="block text-sm font-semibold text-slate-700 mb-2">
                Short Pitch <span className="text-slate-400 font-normal">(optional · max 500 chars)</span>
              </label>
              <textarea
                id="pitch-textarea"
                value={pitch}
                onChange={(e) => setPitch(e.target.value.slice(0, 500))}
                rows={4}
                placeholder="Tell them why you&apos;re the perfect fit — be specific, concise, and authentic."
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400
                           placeholder:text-slate-400 transition-all"
              />
              <p className="text-right text-xs text-slate-400 mt-1">{pitch.length}/500</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="apply-submit-btn"
                type="submit"
                disabled={step === 'submitting'}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#0F172A] text-white text-sm font-semibold
                           hover:bg-slate-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {step === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
