// frontend/src/app/skills/page.tsx

'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  ShieldCheck,
  FileCode2,
  Database,
  Layout,
  Terminal,
  MessagesSquare,
  Presentation,
  CheckCircle2,
  Lock,
  ExternalLink,
  Award,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Hackathon Demo
───────────────────────────────────────────────────────────── */
const VERIFICATION_LEVELS = [
  { level: 1, label: 'Self-Declared', color: 'bg-slate-400', text: 'text-slate-700' },
  { level: 2, label: 'Assessed', color: 'bg-blue-400', text: 'text-blue-700' },
  { level: 3, label: 'Project-Verified', color: 'bg-violet-400', text: 'text-violet-700' },
  { level: 4, label: 'Faculty-Verified', color: 'bg-amber-400', text: 'text-amber-700' },
  { level: 5, label: 'Industry-Verified', color: 'bg-emerald-400', text: 'text-emerald-700' },
];

const PASSPORT_SKILLS = [
  {
    category: 'Core Technical',
    skills: [
      {
        name: 'React.js & Next.js',
        icon: <Layout className="h-5 w-5" />,
        tier: 5,
        evidence: '3 Industry Projects, 1 Internship feedback',
        endorsedBy: 'TechCorp Lead Engineer',
      },
      {
        name: 'Python & Django',
        icon: <FileCode2 className="h-5 w-5" />,
        tier: 4,
        evidence: 'Advanced Web Dev Coursework',
        endorsedBy: 'Dr. Sharma (CS Dept)',
      },
      {
        name: 'PostgreSQL',
        icon: <Database className="h-5 w-5" />,
        tier: 3,
        evidence: 'E-commerce DB Schema (GitHub repo)',
        endorsedBy: 'Automated Project Hub',
      },
    ],
  },
  {
    category: 'Tools & Platforms',
    skills: [
      {
        name: 'Git & GitHub',
        icon: <Terminal className="h-5 w-5" />,
        tier: 5,
        evidence: '50+ Commits, CI/CD Pipeline Setup',
        endorsedBy: 'Open Source Maintainer',
      },
      {
        name: 'Docker',
        icon: <Terminal className="h-5 w-5" />,
        tier: 2,
        evidence: 'Passed Level 2 SkillBridge Assessment',
        endorsedBy: 'Platform Assessment',
      },
    ],
  },
  {
    category: 'Soft Skills',
    skills: [
      {
        name: 'Technical Communication',
        icon: <MessagesSquare className="h-5 w-5" />,
        tier: 4,
        evidence: 'Capstone Project Presentation',
        endorsedBy: 'Prof. Verma',
      },
      {
        name: 'Client Presentation',
        icon: <Presentation className="h-5 w-5" />,
        tier: 1,
        evidence: 'Added to profile on onboarding',
        endorsedBy: 'Self-Claimed',
      },
    ],
  },
];

export default function SkillPassportPage() {
  const { user } = useAuth();
  
  // Default to a generic name if no user is logged in
  const displayName = user?.name || 'Alex Learner';
  const displayRole = user?.role === 'student' ? 'Computer Science Student' : 'SkillBridge User';

  return (
    <div className="mx-auto max-w-5xl py-8">
      
      {/* ── Header Section ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verified Skill Passport</h1>
          </div>
          <p className="text-lg text-slate-600">
            The portable, evidence-backed competency record for <span className="font-semibold text-indigo-600">{displayName}</span>.
          </p>
        </div>
        
        {/* Quick Stats for Demo */}
        <div className="flex gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Total Skills</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">7</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Industry Verified</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">2</p>
          </div>
        </div>
      </div>

      {/* ── Skills Mapping ──────────────────────────────── */}
      <div className="space-y-10">
        {PASSPORT_SKILLS.map((group) => (
          <div key={group.category}>
            <h2 className="mb-4 text-lg font-bold text-slate-900">{group.category}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              
              {group.skills.map((skill) => {
                const currentTier = VERIFICATION_LEVELS.find((v) => v.level === skill.tier)!;
                
                return (
                  <div 
                    key={skill.name} 
                    className="relative flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 ${currentTier.text}`}>
                          {skill.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{skill.name}</h3>
                          <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-slate-100 ${currentTier.text}`}>
                            {currentTier.label}
                          </span>
                        </div>
                      </div>
                      
                      {skill.tier === 5 && (
                        <Award className="h-6 w-6 text-emerald-500" aria-label="Top Tier Achieved" />
                      )}
                    </div>

                    {/* Progression Track */}
                    <div className="mb-6">
                      <div className="flex justify-between">
                        {VERIFICATION_LEVELS.map((level, idx) => {
                          const isAchieved = level.level <= skill.tier;
                          const isCurrent = level.level === skill.tier;
                          
                          return (
                            <div key={level.level} className="relative flex flex-col items-center">
                              {/* Connecting Line */}
                              {idx !== 0 && (
                                <div 
                                  className={`absolute right-[50%] top-2.5 -z-10 h-1 w-[calc(100%-1.25rem)] -translate-y-1/2 rounded-full ${
                                    isAchieved ? currentTier.color : 'bg-slate-100'
                                  }`} 
                                />
                              )}
                              
                              {/* Dot */}
                              <div 
                                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                                  isAchieved 
                                    ? `border-transparent ${currentTier.color} text-white` 
                                    : 'border-slate-200 bg-white text-slate-300'
                                } ${isCurrent ? 'ring-4 ring-slate-100' : ''}`}
                                title={level.label}
                              >
                                {isAchieved ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-2 flex justify-between px-1">
                        <span className="text-[10px] font-semibold text-slate-400">Claimed</span>
                        <span className="text-[10px] font-semibold text-emerald-500">Industry</span>
                      </div>
                    </div>

                    {/* Evidence Footer */}
                    <div className="mt-auto rounded-xl bg-slate-50 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700">Evidence:</span>
                        <span className="flex items-center gap-1 text-xs text-indigo-600 hover:underline cursor-pointer">
                          View details <ExternalLink className="h-3 w-3" />
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{skill.evidence}</p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        By: {skill.endorsedBy}
                      </p>
                    </div>

                  </div>
                );
              })}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}