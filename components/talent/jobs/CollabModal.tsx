'use client';

import { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Users,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { JobPost } from '@/types/talent';
import { submitApplication } from '@/lib/talent/firebase/api';
import { useAuth } from '@/context/talent/AuthContext';

interface CollabModalProps {
  job: JobPost;
  onClose: () => void;
  onSuccess: (jobId: string) => void;
}

type Step = 'form' | 'submitting' | 'success';

export default function CollabModal({ job, onClose, onSuccess }: CollabModalProps) {
  const { user, refreshAppliedJobs } = useAuth();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioUrl, setPortfolioUrl] = useState(user?.portfolioUrl || '');
  const [pitch, setPitch] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!pitch.trim()) {
      setError('Please provide a short pitch describing how you can contribute to this collaboration.');
      return;
    }

    setStep('submitting');
    setError('');

    try {
      await submitApplication(job.id, user.uid, {
        type: 'collaboration',
        resumeFileName: resumeFile ? resumeFile.name : user.resumeFileName,
        portfolioUrl: portfolioUrl || undefined,
        pitch: pitch || undefined,
      });
      refreshAppliedJobs();
      setStep('success');
      setTimeout(() => onSuccess(job.id), 1600);
    } catch (err) {
      setStep('form');
      setError(err instanceof Error ? err.message : 'Something went wrong submitting your proposal.');
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in border border-slate-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 via-white to-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                Innovator Collaboration Proposal
              </span>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">{job.title}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  {job.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location}
                </span>
              </div>
            </div>
            <button
              id="collab-modal-close"
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        {step === 'success' ? (
          <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in-up">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-9 h-9 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-1.5">Proposal Submitted!</h3>
            <p className="text-slate-600 text-sm max-w-sm">
              Your proposal to join <strong>{job.company}</strong> has been delivered. The team lead will review your skills and get in touch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Pitch / Contribution */}
            <div>
              <label htmlFor="collab-pitch" className="block text-sm font-bold text-slate-800 mb-1.5">
                How would you like to contribute? <span className="text-red-500">*</span>
              </label>
              <textarea
                id="collab-pitch"
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                required
                rows={4}
                placeholder="Describe your relevant skills, past robotics/software projects, and what role you'd like to play in this innovation initiative..."
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl resize-none
                           focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                           placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Portfolio / GitHub Link */}
            <div>
              <label htmlFor="collab-portfolio" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Portfolio or GitHub URL <span className="text-slate-400 font-normal">(recommended)</span>
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  id="collab-portfolio"
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://github.com/alexrivera-robotics"
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
                             placeholder:text-slate-400 transition-all"
                />
              </div>
            </div>

            {/* Optional Resume Attachment */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Resume / CV <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <div className="w-9 h-9 bg-emerald-100 text-emerald-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {resumeFile ? resumeFile.name : user?.resumeFileName || 'Alex_Rivera_Robotics_Resume_2026.pdf'}
                  </p>
                  <p className="text-[11px] text-slate-500">Default profile resume selected</p>
                </div>
                <label htmlFor="collab-resume-file" className="cursor-pointer text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                  Change
                </label>
                <input
                  id="collab-resume-file"
                  type="file"
                  accept=".pdf,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setResumeFile(f);
                  }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                id="collab-submit-btn"
                type="submit"
                disabled={step === 'submitting'}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold
                           transition-all hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {step === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting Proposal…
                  </>
                ) : (
                  'Send Collaboration Proposal'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}