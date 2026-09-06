// frontend/src/app/employer/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Briefcase,
  Search,
  Users,
  Target,
  ShieldCheck,
  CheckCircle2,
  Star,
  Building2,
  ArrowRight
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Employer / Industry Dashboard
───────────────────────────────────────────────────────────── */
const ACTIVE_JOBS = [
  { id: 'job-1', title: 'Frontend Engineer (React/Next.js)', candidates: 24, highMatches: 5 },
  { id: 'job-2', title: 'Data Scientist Intern', candidates: 45, highMatches: 12 },
];

const TALENT_POOL = [
  {
    id: 'c-1',
    name: 'Alex Learner',
    university: 'Pune Institute of Technology',
    matchScore: 95,
    status: 'high-match',
    skills: [
      { name: 'React.js', tier: 5, label: 'Industry-Verified' },
      { name: 'TypeScript', tier: 4, label: 'Faculty-Verified' },
    ],
    evidence: '3 Industry Projects, 50+ Commits',
  },
  {
    id: 'c-2',
    name: 'Priya Patel',
    university: 'National College of Engineering',
    matchScore: 88,
    status: 'partial-match',
    skills: [
      { name: 'React.js', tier: 3, label: 'Project-Verified' },
      { name: 'UI/UX Design', tier: 4, label: 'Faculty-Verified' },
    ],
    evidence: 'E-commerce Redesign Case Study',
  },
  {
    id: 'c-3',
    name: 'Rahul Sharma',
    university: 'Global Tech University',
    matchScore: 92,
    status: 'high-match',
    skills: [
      { name: 'Node.js', tier: 5, label: 'Industry-Verified' },
      { name: 'MongoDB', tier: 4, label: 'Faculty-Verified' },
    ],
    evidence: 'Scalable API Architecture Repo',
  }
];

export default function EmployerDashboardPage() {
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  const handleShortlist = (id: string) => {
    if (!shortlisted.includes(id)) {
      setShortlisted([...shortlisted, id]);
    }
  };

  const displayName = user?.name || 'Recruiter';

  return (
    <div className="mx-auto max-w-6xl py-8">
      
      {/* ── Header ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Industry Partner Hub</h1>
          </div>
          <p className="text-lg text-slate-600">
            Welcome, <span className="font-semibold text-indigo-600">{displayName}</span>. Source verified talent based on actual capabilities, not just keywords.
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Active Posts</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">2</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Verified Matches</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">17</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* ── Left Column: Active Jobs ──────────────────────────────── */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">Your Postings</h2>
              </div>
            </div>

            <div className="space-y-4">
              {ACTIVE_JOBS.map((job) => (
                <div key={job.id} className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50">
                  <h3 className="font-bold text-slate-900">{job.title}</h3>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Users className="h-4 w-4" /> {job.candidates} Applicants
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                      <Target className="h-4 w-4" /> {job.highMatches} Top Matches
                    </span>
                  </div>
                </div>
              ))}
              
              <button className="mt-2 w-full rounded-xl border-2 border-dashed border-slate-200 py-3 text-sm font-semibold text-slate-500 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600">
                + Post New Opportunity
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column: AI Talent Discovery ──────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Search className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-bold text-slate-900">AI Talent Discovery</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
                <ShieldCheck className="h-4 w-4 text-indigo-500" /> Filter: Tier 4+ Skills
              </div>
            </div>

            <div className="space-y-4">
              {TALENT_POOL.map((candidate) => {
                const isShortlisted = shortlisted.includes(candidate.id);
                
                return (
                  <div key={candidate.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-900">{candidate.name}</h3>
                        <Badge variant={candidate.status === 'high-match' ? 'success' : 'industry'} size="xs">
                          {candidate.matchScore}% Match
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{candidate.university}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {candidate.skills.map((skill, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                            {skill.tier === 5 ? <Star className="h-3.5 w-3.5 text-emerald-500" /> : <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
                            {skill.name} (T{skill.tier})
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        <span className="font-semibold text-slate-700">Evidence:</span> {candidate.evidence}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                      {isShortlisted ? (
                        <div className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-6 py-2.5 text-sm font-bold text-emerald-700">
                          <CheckCircle2 className="h-4 w-4" /> Shortlisted
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleShortlist(candidate.id)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800"
                        >
                          Shortlist Candidate <ArrowRight className="h-4 w-4" />
                        </button>
                      )}
                      <button className="text-xs font-semibold text-indigo-600 hover:underline sm:text-right">
                        View Full Passport
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}