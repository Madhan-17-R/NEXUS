'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus, Send, Sparkles, ShieldCheck, ThumbsUp, MessageSquare, CheckCircle2, Lock,
  MapPin, Clock, DollarSign, Users, Zap, ArrowRight, Bookmark, ExternalLink,
  Briefcase, GraduationCap, Building2, Globe
} from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Button, SkillBadge, Badge, Tabs, EmptyState, Avatar, Modal, Textarea, Card } from '@/components/innovator/ui';
import { mockFeedPosts, mockJobs, mockInternships, mockGrants, mockCollaborations, mockIdeas } from '@/data/innovator/mockPosts';
import type { FeedPost, JobPost, InternshipPost, GrantPost, CollaborationPost, IdeaPost } from '@/types/innovator';
import { cn } from '@/lib/utils';

type FeedTab = 'all' | 'grant' | 'collaboration' | 'idea';

const feedTabs = [
  { id: 'all', label: 'All Posts' },
  { id: 'grant', label: 'Grants' },
  { id: 'collaboration', label: 'Collaborations' },
  { id: 'idea', label: 'Ideas' },
];

export default function FeedPage() {
  const { currentUser, isLoggedIn, applyToPost, applications, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<FeedTab>('all');
  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);
  const [pitchModal, setPitchModal] = useState<GrantPost | null>(null);
  const [collabreqModal, setCollabreqModal] = useState<CollaborationPost | null>(null);

  const appliedPostIds = new Set(applications.map((a) => a.postId));

  const filteredPosts = useMemo(() => {
    if (activeTab === 'all') return posts;
    return posts.filter((p) => p.postType === activeTab);
  }, [activeTab, posts]);

  const handleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id && p.postType === 'idea'
          ? { ...p, likes: (p as IdeaPost).isLiked ? (p as IdeaPost).likes - 1 : (p as IdeaPost).likes + 1, isLiked: !(p as IdeaPost).isLiked }
          : p
      )
    );
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Main Feed</h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            {isLoggedIn ? `Logged in as ${currentUser.role}` : 'Viewing public feed — log in to interact'}
          </p>
        </div>

        {/* Tab filters — top right */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Posts' },
            { id: 'grant', label: 'Funding Orgs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FeedTab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                activeTab === tab.id ? 'bg-white text-[#0F172A] shadow-sm' : 'text-slate-600 hover:text-slate-800'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile filter tabs */}
      <div className="sm:hidden overflow-x-auto -mx-1">
        <div className="flex gap-1.5 px-1 pb-1 min-w-max">
          {feedTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FeedTab)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap',
                activeTab === tab.id
                  ? 'bg-[#0F172A] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post Creator */}
      {isLoggedIn ? (
        <PostCreatorBar currentUser={currentUser} showToast={showToast} />
      ) : (
        <div className="bg-slate-100 border border-slate-200 p-4 rounded-2xl flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Log in to interact with posts, apply to opportunities, or pitch ideas.</span>
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <EmptyState icon="📭" title="No posts yet" description="Try changing the filter or check back later." />
        ) : (
          filteredPosts.map((post) => {

            if (post.postType === 'grant') {
              return (
                <GrantCard
                  key={post.id}
                  post={post as GrantPost}
                  isLoggedIn={isLoggedIn}
                  isApplied={appliedPostIds.has(post.id)}
                  onApply={() =>
                    applyToPost(
                      post.id, 'grant',
                      (post as GrantPost).grantTitle,
                      (post as GrantPost).orgName,
                      (post as GrantPost).domain,
                      (post as GrantPost).fundingAmount,
                      (post as GrantPost).orgLogo
                    )
                  }
                  onPitch={() => setPitchModal(post as GrantPost)}
                />
              );
            }
            if (post.postType === 'collaboration') {
              return (
                <CollaborationCard
                  key={post.id}
                  post={post as CollaborationPost}
                  isLoggedIn={isLoggedIn}
                  onCollaborate={() => setCollabreqModal(post as CollaborationPost)}
                />
              );
            }
            if (post.postType === 'idea') {
              return (
                <IdeaCard
                  key={post.id}
                  post={post as IdeaPost}
                  onLike={() => handleLike(post.id)}
                  onCollaborate={() => showToast('📤 Collaboration inquiry sent!')}
                />
              );
            }
            return null;
          })
        )}
      </div>

      {/* Pitch Modal */}
      {pitchModal && (
        <PitchModal grant={pitchModal} onClose={() => setPitchModal(null)} showToast={showToast} />
      )}

      {/* Collaborate Request Modal */}
      {collabreqModal && (
        <CollaborateRequestModal
          post={collabreqModal}
          currentUser={currentUser}
          onClose={() => setCollabreqModal(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// ─── POST CREATOR BAR ─────────────────────────────────────────

function PostCreatorBar({ currentUser, showToast }: { currentUser: { avatar: string; name: string; role: string }; showToast: (m: string) => void }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1">
        <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
        <div>
          <p className="text-xs font-bold text-[#0F172A]">Share an Innovation</p>
          <p className="text-[11px] text-slate-400">Share your idea, showcase your project, find collaborators, or ask the SkillForge community for feedback.</p>
        </div>
      </div>
      <Button
        variant="primary"
        size="sm"
        leftIcon={<Plus className="w-4 h-4" />}
        onClick={() => showToast('📝 Post form coming soon!')}
      >
        + Create Post
      </Button>
    </div>
  );
}

// ─── JOB CARD ─────────────────────────────────────────────────

function JobCard({
  post,
  isLoggedIn,
  isApplied,
  onApply,
}: {
  post: JobPost;
  isLoggedIn: boolean;
  isApplied: boolean;
  onApply: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-xl shadow-sm shrink-0">
            {post.companyLogo || '🏢'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-base text-[#0F172A] leading-tight">{post.jobTitle}</h3>
              <Badge variant="blue">Company Job</Badge>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {post.companyName}
              {post.location && (
                <span className="text-slate-400"> • <MapPin className="w-3 h-3 inline" /> {post.location}</span>
              )}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 inline-block">
            {post.salary}
          </span>
          <p className="text-[10px] text-slate-400 font-medium mt-1.5">{post.timestamp}</p>
        </div>
      </div>

      {/* Role Details */}
      <div className="my-4 bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
        <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider mb-2.5">Role Details</h4>
        <ul className="space-y-2">
          {post.roleDetails.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.skillsRequired.map((skill, idx) => (
          <SkillBadge key={idx} skill={skill} />
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          {post.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
          {post.isVerified ? 'Verified Employer Listing' : `${post.applicantCount} applicants`}
        </span>

        {!isLoggedIn ? (
          <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3.5 h-3.5" />} disabled>
            Login to Apply
          </Button>
        ) : isApplied ? (
          <Button variant="emerald" size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} disabled>
            Application Submitted
          </Button>
        ) : (
          <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={onApply}>
            Apply Now
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── INTERNSHIP CARD ──────────────────────────────────────────

function InternshipCard({
  post,
  isLoggedIn,
  isApplied,
  onApply,
}: {
  post: InternshipPost;
  isLoggedIn: boolean;
  isApplied: boolean;
  onApply: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center text-xl shadow-sm shrink-0">
            {post.companyLogo || '🏢'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-base text-[#0F172A]">{post.internshipTitle}</h3>
              <Badge variant="violet">Internship</Badge>
              {post.isRemote && <Badge variant="emerald">Remote</Badge>}
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {post.companyName} • {post.domain}
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          {post.stipend && (
            <span className="text-xs font-extrabold text-violet-800 bg-violet-50 px-2.5 py-1 rounded-xl border border-violet-200 inline-block">
              {post.stipend}
            </span>
          )}
          <p className="text-[10px] text-slate-400 font-medium mt-1.5">{post.timestamp}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4 text-xs space-y-1.5">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Duration: {post.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{post.location}</span>
        </div>
        {post.deadline && (
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Deadline: {post.deadline}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.skillsRequired.map((skill, idx) => (
          <SkillBadge key={idx} skill={skill} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">
          {post.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline mr-1" />}
          Verified Internship Listing
        </span>
        {!isLoggedIn ? (
          <Button variant="secondary" size="sm" leftIcon={<Lock className="w-3.5 h-3.5" />} disabled>Login to Apply</Button>
        ) : isApplied ? (
          <Button variant="emerald" size="sm" leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />} disabled>Applied</Button>
        ) : (
          <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={onApply}>Apply Now</Button>
        )}
      </div>
    </div>
  );
}

// ─── GRANT CARD ───────────────────────────────────────────────

function GrantCard({
  post,
  isLoggedIn,
  isApplied,
  onApply,
  onPitch,
}: {
  post: GrantPost;
  isLoggedIn: boolean;
  isApplied: boolean;
  onApply: () => void;
  onPitch: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-8 -mt-8 pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-4 relative">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-xl shadow-sm shrink-0">
            {post.orgLogo || '🌐'}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-extrabold text-base text-[#0F172A]">{post.grantTitle}</h3>
              <Badge variant="amber">Funding Program</Badge>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{post.orgName}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300 inline-block shadow-sm">
            {post.fundingAmount}
          </span>
        </div>
      </div>

      <div className="my-3 space-y-2">
        <p className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          {post.eligibility}
        </p>
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Grant Criteria</h4>
          <ul className="space-y-1.5">
            {post.criteria.map((c, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.focusAreas.map((tag, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">
          {post.pitchesCount} pitches received • Deadline: {post.deadline}
        </span>
        <div className="flex items-center gap-2">
          {isLoggedIn && !isApplied && (
            <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500" />} onClick={onPitch}>
              Pitch Idea
            </Button>
          )}
          {!isLoggedIn ? (
            <Button variant="secondary" size="sm" disabled leftIcon={<Lock className="w-3.5 h-3.5" />}>Login to Apply</Button>
          ) : isApplied ? (
            <Button variant="emerald" size="sm" disabled leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>Applied</Button>
          ) : (
            <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} onClick={onApply}>Apply for Grant</Button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── COLLABORATION CARD ───────────────────────────────────────

function CollaborationCard({
  post,
  isLoggedIn,
  onCollaborate,
}: {
  post: CollaborationPost;
  isLoggedIn: boolean;
  onCollaborate: () => void;
}) {
  const [sent, setSent] = useState(false);

  const handleCollaborate = () => {
    onCollaborate();
    setSent(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={post.authorAvatar} name={post.authorName} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#0F172A]">{post.authorName}</h4>
              <Badge variant="violet">Collaboration</Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium">{post.authorRole} • {post.timestamp}</p>
          </div>
        </div>
        {post.isOpen && <Badge variant="emerald">Open</Badge>}
      </div>

      <h3 className="font-extrabold text-base text-[#0F172A] mb-2">{post.projectTitle}</h3>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{post.description}</p>

      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-4 text-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-600">Domain: {post.domain}</span>
        </div>
        {post.teamSize && (
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-600">Looking for {post.teamSize} collaborator{post.teamSize > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.skillsNeeded.map((skill, idx) => (
          <SkillBadge key={idx} skill={skill} />
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-[11px] text-slate-400 font-medium">Posted by an Innovator</span>
        {!isLoggedIn ? (
          <Button variant="secondary" size="sm" disabled leftIcon={<Lock className="w-3.5 h-3.5" />}>Login to Collaborate</Button>
        ) : sent ? (
          <Button variant="emerald" size="sm" disabled leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}>Request Sent</Button>
        ) : (
          <Button variant="primary" size="sm" leftIcon={<Users className="w-3.5 h-3.5" />} onClick={handleCollaborate}>
            Collaborate
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── IDEA CARD ────────────────────────────────────────────────

function IdeaCard({
  post,
  onLike,
  onCollaborate,
}: {
  post: IdeaPost;
  onLike: () => void;
  onCollaborate: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar src={post.authorAvatar} name={post.authorName} size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#0F172A]">{post.authorName}</h4>
              <Badge variant="emerald">Student Innovation</Badge>
            </div>
            <p className="text-xs text-slate-400">{post.authorInstitution} • {post.timestamp}</p>
          </div>
        </div>
        {post.fundingNeeded && (
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
            {post.fundingNeeded}
          </span>
        )}
      </div>

      <h3 className="font-extrabold text-base text-[#0F172A] mb-1.5">{post.title}</h3>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{post.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {post.tags.map((tag, idx) => (
          <span key={idx} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <button
          onClick={onLike}
          className={cn(
            'flex items-center gap-1.5 text-xs font-bold transition-colors',
            post.isLiked ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
          )}
        >
          <ThumbsUp className={cn('w-4 h-4', post.isLiked && 'fill-blue-600')} />
          {post.likes} Likes
        </button>
        <button
          onClick={onCollaborate}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Inquire / Collaborate
        </button>
      </div>
    </div>
  );
}

// ─── PITCH MODAL ──────────────────────────────────────────────

function PitchModal({
  grant,
  onClose,
  showToast,
}: {
  grant: GrantPost;
  onClose: () => void;
  showToast: (m: string) => void;
}) {
  const [pitch, setPitch] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitch.trim()) return;
    onClose();
    showToast(`📩 Pitch submitted to ${grant.orgName}!`);
  };

  return (
    <Modal isOpen title={`Submit Pitch to ${grant.orgName}`} onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
          <p className="font-bold text-amber-900">{grant.grantTitle}</p>
          <p className="text-amber-800 mt-0.5">{grant.fundingAmount} • Deadline: {grant.deadline}</p>
        </div>
        <Textarea
          label="Executive Summary / Pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          rows={4}
          placeholder="Summarize your innovation prototype, technical roadmap, and grant allocation plan..."
          required
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" size="sm" leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-300" />} type="submit">
            Submit Pitch Deck
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── COLLABORATE REQUEST MODAL ────────────────────────────────

function CollaborateRequestModal({
  post,
  currentUser,
  onClose,
  showToast,
}: {
  post: CollaborationPost;
  currentUser: { id: string; name: string; avatar: string; role: string };
  onClose: () => void;
  showToast: (m: string) => void;
}) {
  const [reason, setReason] = useState('');
  const [skills, setSkills] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      showToast(`📤 Collaboration request sent to ${post.authorName}!`);
    }, 800);
  };

  return (
    <Modal isOpen title="Send Collaboration Request" onClose={onClose} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-violet-50 border border-violet-200 p-3 rounded-xl text-xs">
          <p className="font-bold text-violet-900">{post.projectTitle}</p>
          <p className="text-violet-700 mt-0.5">by {post.authorName} • {post.domain}</p>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Reason for Collaboration *</label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={2}
            placeholder="Why do you want to collaborate on this project?"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Relevant Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. ROS2, Python, Computer Vision"
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
        </div>

        <Textarea
          label="Optional Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          placeholder="Any personal message to include..."
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" size="sm" leftIcon={<Send className="w-3.5 h-3.5" />} type="submit" isLoading={submitted}>
            Send Collaboration Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}

