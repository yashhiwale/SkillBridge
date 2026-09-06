// frontend/src/app/opportunities/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  Target,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  Handshake,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Opportunities Demo
───────────────────────────────────────────────────────────── */
const OPPORTUNITIES = [
  {
    id: 'opp-1',
    title: 'Frontend Engineer (React/Next.js)',
    company: 'TechNova Solutions',
    type: 'Full-time',
    location: 'Remote',
    matchScore: 95,
    status: 'high-match', // 90+
    requirements: [
      { skill: 'React.js & Next.js', tier: 4, met: true },
      { skill: 'TypeScript', tier: 3, met: true },
      { skill: 'Tailwind CSS', tier: 3, met: true },
    ],
    description: 'Looking for a skilled frontend developer to lead our new dashboard initiative. Your verified GitHub evidence perfectly matches our needs.',
  },
  {
    id: 'opp-2',
    title: 'Full Stack Developer Intern',
    company: 'DataFlow Inc.',
    type: 'Internship',
    location: 'Pune, India',
    matchScore: 78,
    status: 'partial-match', // 70-89
    requirements: [
      { skill: 'React.js', tier: 3, met: true },
      { skill: 'Python/Django', tier: 3, met: true },
      { skill: 'PostgreSQL', tier: 3, met: false }, // Missing tier
    ],
    description: 'Join our backend team to build scalable APIs. You meet the core requirements, but we need more verified database experience.',
  },
  {
    id: 'opp-3',
    title: 'UI/UX Design Contract',
    company: 'Creative Studio',
    type: 'Freelance',
    location: 'Remote',
    matchScore: 45,
    status: 'low-match', // <70
    requirements: [
      { skill: 'Figma', tier: 4, met: false },
      { skill: 'User Research', tier: 3, met: false },
      { skill: 'Client Presentation', tier: 3, met: true },
    ],
    description: 'Short-term project to redesign an e-commerce platform. Heavy emphasis on verified Figma prototypes.',
  }
];

export default function OpportunitiesPage() {
  const { user } = useAuth();
  // Store application status per job ID: 'idle' | 'applying' | 'applied'
  const [applyState, setApplyState] = useState<Record<string, string>>({});

  const handleApply = (id: string) => {
    setApplyState((prev) => ({ ...prev, [id]: 'applying' }));
    // Simulate network request
    setTimeout(() => {
      setApplyState((prev) => ({ ...prev, [id]: 'applied' }));
    }, 1500);
  };

  const displayName = user?.name || 'Alex Learner';

  return (
    <div className="mx-auto max-w-5xl py-8">
      
      {/* ── Header Section ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Handshake className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Opportunities Hub</h1>
          </div>
          <p className="text-lg text-slate-600">
            AI-matched jobs and projects based on <span className="font-semibold text-indigo-600">{displayName}&apos;s</span> Verified Passport.
          </p>
        </div>
        
        {/* Filter / Sort Mock */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500">Sorted by:</span>
          <div className="flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Sparkles className="h-4 w-4" />
            Highest Match Score
          </div>
        </div>
      </div>

      {/* ── Job Listings ──────────────────────────────── */}
      <div className="space-y-6">
        {OPPORTUNITIES.map((job) => {
          const isApplying = applyState[job.id] === 'applying';
          const isApplied = applyState[job.id] === 'applied';

          return (
            <div 
              key={job.id} 
              className={`relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                job.status === 'high-match' ? 'border-emerald-200 ring-1 ring-emerald-50' : 'border-slate-200'
              }`}
            >
              {/* Highlight bar for high matches */}
              {job.status === 'high-match' && (
                <div className="absolute left-0 top-0 h-full w-1.5 bg-emerald-500" />
              )}

              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                
                {/* Left: Job Info */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
                    {job.status === 'high-match' && (
                      <Badge variant="success" size="sm" dot>Top Match</Badge>
                    )}
                  </div>
                  
                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4 text-slate-400" /> {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-slate-400" /> {job.type}
                    </span>
                  </div>

                  <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                    {job.description}
                  </p>

                  {/* Requirements Badges */}
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                      Passport Verification Check
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {job.requirements.map((req, idx) => (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                            req.met 
                              ? 'border-emerald-200 bg-emerald-50 text-emerald-700' 
                              : 'border-amber-200 bg-amber-50 text-amber-700'
                          }`}
                        >
                          {req.met ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                          {req.skill} (Tier {req.tier})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Match Score & CTA */}
                <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-50 p-5 md:w-48 md:shrink-0">
                  <div className="text-center">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">AI Match</p>
                    <div className="mt-1 flex items-center justify-center gap-1">
                      <Target className={`h-5 w-5 ${job.matchScore >= 80 ? 'text-emerald-500' : job.matchScore >= 60 ? 'text-amber-500' : 'text-rose-500'}`} />
                      <span className="text-3xl font-bold text-slate-900">{job.matchScore}%</span>
                    </div>
                  </div>

                  {isApplied ? (
                    <div className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-100 px-4 py-2.5 text-sm font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => handleApply(job.id)}
                      disabled={isApplying || job.matchScore < 50}
                      className={`group flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        job.matchScore < 50
                          ? 'cursor-not-allowed bg-slate-200 text-slate-400'
                          : 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-lg'
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : job.matchScore < 50 ? (
                        'Match Too Low'
                      ) : (
                        <>
                          1-Click Apply
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  )}
                  
                  {job.status === 'partial-match' && !isApplied && (
                    <p className="text-center text-[10px] text-slate-500">
                      Missing 1 requirement. Application might be flagged.
                    </p>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}