'use client';

import React, { useState } from 'react';
import { Check, X, MessageSquare, UserMinus, Users, Send, Clock, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/innovator/AppContext';
import { Avatar, Button, Tabs, EmptyState, SkillBadge, Modal, Badge } from '@/components/innovator/ui';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'incoming', label: 'Incoming Requests' },
  { id: 'sent', label: 'Sent Requests' },
  { id: 'active', label: 'Active Collaborations' },
  { id: 'connections', label: 'Connections' },
];

export default function CollaboratePage() {
  const {
    incomingRequests,
    sentRequests,
    activeCollaborations,
    connections,
    acceptCollaborationRequest,
    declineCollaborationRequest,
    endCollaboration,
  } = useApp();
  const [activeTab, setActiveTab] = useState('incoming');
  const [endConfirmId, setEndConfirmId] = useState<string | null>(null);

  const tabsWithCounts = tabs.map((t) => ({
    ...t,
    count:
      t.id === 'incoming'
        ? incomingRequests.filter((r) => r.status === 'pending').length
        : t.id === 'sent'
        ? sentRequests.length
        : t.id === 'active'
        ? activeCollaborations.filter((c) => c.status === 'active').length
        : connections.length,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Collaborate</h1>
        <p className="text-xs text-slate-500 mt-0.5">Manage your collaboration requests, active projects, and network</p>
      </div>

      <Tabs tabs={tabsWithCounts} activeTab={activeTab} onChange={setActiveTab} variant="underline" />

      <div className="space-y-4">
        {/* ── INCOMING REQUESTS ── */}
        {activeTab === 'incoming' && (
          <>
            {incomingRequests.filter((r) => r.status === 'pending').length === 0 ? (
              <EmptyState icon="📥" title="No incoming requests" description="When other innovators request to collaborate with you, they'll appear here." />
            ) : (
              incomingRequests
                .filter((r) => r.status === 'pending')
                .map((req) => (
                  <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                      <Avatar src={req.fromUserAvatar} name={req.fromUserName} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-extrabold text-sm text-[#0F172A]">{req.fromUserName}</h3>
                          <Badge variant="slate">{req.fromUserRole}</Badge>
                        </div>
                        <p className="text-xs text-violet-700 font-bold mt-0.5">Project: {req.projectTitle}</p>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">{req.reason}</p>
                        {req.message && (
                          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mt-2 text-xs text-slate-600 italic">
                            "{req.message}"
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {req.skills.map((s, i) => <SkillBadge key={i} skill={s} />)}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(req.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="emerald"
                        size="sm"
                        leftIcon={<Check className="w-3.5 h-3.5" />}
                        onClick={() => acceptCollaborationRequest(req.id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        onClick={() => declineCollaborationRequest(req.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))
            )}
            {/* Accepted/declined */}
            {incomingRequests
              .filter((r) => r.status !== 'pending')
              .map((req) => (
                <div key={req.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 opacity-70">
                  <div className="flex items-center gap-3">
                    <Avatar src={req.fromUserAvatar} name={req.fromUserName} size="sm" />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-700">{req.fromUserName} — {req.projectTitle}</p>
                    </div>
                    <Badge variant={req.status === 'accepted' ? 'emerald' : 'red'}>
                      {req.status === 'accepted' ? 'Accepted' : 'Declined'}
                    </Badge>
                  </div>
                </div>
              ))}
          </>
        )}

        {/* ── SENT REQUESTS ── */}
        {activeTab === 'sent' && (
          <>
            {sentRequests.length === 0 ? (
              <EmptyState icon="📤" title="No sent requests" description="Use the Collaborate button on profiles or posts to send requests." />
            ) : (
              sentRequests.map((req) => (
                <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 justify-between flex-wrap">
                        <div>
                          <h3 className="font-extrabold text-sm text-[#0F172A]">To: {req.toUserName}</h3>
                          <p className="text-xs text-violet-700 font-bold mt-0.5">{req.projectTitle}</p>
                        </div>
                        <Badge variant={req.status === 'pending' ? 'amber' : req.status === 'accepted' ? 'emerald' : 'red'}>
                          {req.status === 'pending' ? 'Pending' : req.status === 'accepted' ? 'Accepted' : 'Declined'}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">{req.reason}</p>
                      <p className="text-[11px] text-slate-400 mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Sent {new Date(req.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {/* ── ACTIVE COLLABORATIONS ── */}
        {activeTab === 'active' && (
          <>
            {activeCollaborations.filter((c) => c.status === 'active').length === 0 ? (
              <EmptyState icon="🤝" title="No active collaborations" description="Accept incoming requests or get your request accepted to start collaborating." />
            ) : (
              activeCollaborations
                .filter((c) => c.status === 'active')
                .map((collab) => {
                  const partner = collab.participant1.userId === 'u1' ? collab.participant2 : collab.participant1;
                  return (
                    <div key={collab.id} className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        <Avatar src={partner.avatar} name={partner.name} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-extrabold text-sm text-[#0F172A]">{partner.name}</h3>
                            <Badge variant="emerald">Active</Badge>
                          </div>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5">{partner.role}</p>
                          <p className="text-xs text-violet-700 font-bold mt-1">{collab.projectTitle}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            <CheckCircle2 className="w-3 h-3 inline mr-1 text-emerald-500" />
                            Collaboration started {collab.startedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link href="/chat" className="flex-1">
                          <Button variant="primary" size="sm" leftIcon={<MessageSquare className="w-3.5 h-3.5" />} className="w-full">
                            Open Chat
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<UserMinus className="w-3.5 h-3.5" />}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => setEndConfirmId(collab.id)}
                        >
                          End Collaboration
                        </Button>
                      </div>
                    </div>
                  );
                })
            )}
            {/* Ended collaborations */}
            {activeCollaborations
              .filter((c) => c.status === 'ended')
              .map((collab) => {
                const partner = collab.participant1.userId === 'u1' ? collab.participant2 : collab.participant1;
                return (
                  <div key={collab.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 opacity-60">
                    <div className="flex items-center gap-3">
                      <Avatar src={partner.avatar} name={partner.name} size="sm" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-600">{partner.name} — {collab.projectTitle}</p>
                      </div>
                      <Badge variant="slate">Ended</Badge>
                    </div>
                  </div>
                );
              })}
          </>
        )}

        {/* ── CONNECTIONS ── */}
        {activeTab === 'connections' && (
          <>
            {connections.length === 0 ? (
              <EmptyState icon="🔗" title="No connections yet" description="Use the Connect button on profiles to build your professional network." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {connections.map((conn) => (
                  <div key={conn.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar src={conn.avatar} name={conn.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-extrabold text-[#0F172A] truncate">{conn.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{conn.role}</p>
                        {conn.mutualConnections && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{conn.mutualConnections} mutual connections</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="xs" className="flex-1" leftIcon={<MessageSquare className="w-3 h-3" />}>Message</Button>
                      <Button variant="secondary" size="xs" className="flex-1">View Profile</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* End Collaboration Confirmation Modal */}
      <Modal
        isOpen={!!endConfirmId}
        onClose={() => setEndConfirmId(null)}
        title="End this Collaboration?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Ending this collaboration will <strong>disable the collaboration chat</strong>. Both collaborators will lose access to the shared chat history.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-semibold">
            ⚠️ This action cannot be undone. The chat will be permanently deactivated.
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => setEndConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              className="flex-1"
              leftIcon={<UserMinus className="w-3.5 h-3.5" />}
              onClick={() => {
                if (endConfirmId) endCollaboration(endConfirmId);
                setEndConfirmId(null);
              }}
            >
              End Collaboration
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

