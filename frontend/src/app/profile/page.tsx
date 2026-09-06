// frontend/src/app/profile/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  User,
  Github,
  Award,
  CheckCircle2,
  FolderGit2,
  Clock,
  ExternalLink,
  Plus,
  RefreshCw,
  FileCode2
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Evidence Hub Demo
───────────────────────────────────────────────────────────── */
const REPOSITORIES = [
  {
    id: 1,
    name: 'e-commerce-microservices',
    language: 'TypeScript',
    linkedSkill: 'React.js & Next.js',
    status: 'verified', // Faculty or Industry verified
    updated: '2 days ago',
    commits: 142,
  },
  {
    id: 2,
    name: 'python-data-pipeline',
    language: 'Python',
    linkedSkill: 'Python & Django',
    status: 'pending', // Waiting for verification
    updated: '1 week ago',
    commits: 38,
  },
];

const CERTIFICATIONS = [
  {
    id: 1,
    title: 'Advanced React Patterns',
    issuer: 'Frontend Masters',
    date: 'Aug 2026',
    linkedSkill: 'React.js & Next.js',
    verified: true,
  },
  {
    id: 2,
    title: 'AWS Certified Developer',
    issuer: 'Amazon Web Services',
    date: 'Jul 2026',
    linkedSkill: 'Cloud Deployment',
    verified: true,
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const [synced, setSynced] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSynced(true);
      // Reset after 3 seconds for demo replayability
      setTimeout(() => setSynced(false), 3000);
    }, 1500);
  };

  const displayName = user?.name || 'Alex Learner';
  const displayEmail = user?.email || 'alex@example.com';
  
  // Fixed TS Error by casting to string
  const roleStr = user?.role as string;
  const roleLabel = roleStr === 'industry' ? 'Employer' : roleStr === 'faculty' ? 'Educator' : 'Student Candidate';

  return (
    <div className="mx-auto max-w-5xl py-8">
      
      {/* ── Profile Header ──────────────────────────────── */}
      <div className="mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-violet-600 sm:h-40" />
        <div className="px-6 pb-8 sm:px-10">
          <div className="relative flex justify-between sm:flex-row flex-col sm:items-end">
            <div className="flex items-end gap-5">
              <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 text-slate-400 shadow-md sm:-mt-16 sm:h-32 sm:w-32">
                <User className="h-12 w-12 sm:h-16 sm:w-16" />
              </div>
              <div className="mb-2 sm:mb-4">
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{displayName}</h1>
                <p className="font-medium text-slate-500">{displayEmail}</p>
              </div>
            </div>
            <div className="mt-4 sm:mb-4 sm:mt-0">
              <Badge variant="student" size="md" dot>{roleLabel}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Evidence Hub Section ──────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Project & Evidence Hub</h2>
          <p className="text-sm text-slate-500">Connect repositories and certificates to boost your Skill Passport tiers.</p>
        </div>
        <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
          <Plus className="h-4 w-4" /> Add Evidence
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* ── Repositories ──────────────────────────────── */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Github className="h-5 w-5" />
              <h3 className="font-bold">Linked Repositories</h3>
            </div>
            <button 
              onClick={handleSync}
              disabled={isSyncing || synced}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                synced 
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {isSyncing ? (
                <><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Syncing...</>
              ) : synced ? (
                <><CheckCircle2 className="h-3.5 w-3.5" /> Synced</>
              ) : (
                <><RefreshCw className="h-3.5 w-3.5" /> Sync GitHub</>
              )}
            </button>
          </div>

          <div className="space-y-4">
            {REPOSITORIES.map((repo) => (
              <div key={repo.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="h-5 w-5 text-indigo-500" />
                    <span className="font-semibold text-slate-900">{repo.name}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 hover:text-indigo-600 cursor-pointer" />
                </div>
                
                <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-blue-500" /> {repo.language}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileCode2 className="h-3.5 w-3.5" /> {repo.commits} commits
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {repo.updated}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-3">
                  <span className="text-xs font-medium text-slate-500">
                    Linked to: <span className="font-semibold text-slate-700">{repo.linkedSkill}</span>
                  </span>
                  {repo.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      <Clock className="h-3.5 w-3.5" /> Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Certifications ──────────────────────────────── */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900">
              <Award className="h-5 w-5" />
              <h3 className="font-bold">Certifications & Credentials</h3>
            </div>
          </div>

          <div className="space-y-4">
            {CERTIFICATIONS.map((cert) => (
              <div key={cert.id} className="flex gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Award className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{cert.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-500">{cert.issuer} • Issued {cert.date}</p>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">
                      Linked to: <span className="font-semibold text-slate-700">{cert.linkedSkill}</span>
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
            <Plus className="h-4 w-4" /> Upload Certificate
          </button>
        </div>

      </div>
    </div>
  );
}