// frontend/src/app/career/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Compass,
  Cpu,
  Clock,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   Mock Data for AI Gap Analysis Demo
───────────────────────────────────────────────────────────── */
const TARGET_ROLE = "Senior Frontend Engineer";
const MATCH_SCORE = 78;

const GAP_ANALYSIS = [
  {
    skill: 'React.js & Next.js',
    currentTier: 5,
    requiredTier: 4,
    status: 'surpassed',
    gap: 0,
  },
  {
    skill: 'TypeScript Architecture',
    currentTier: 2,
    requiredTier: 4,
    status: 'gap',
    gap: 2,
  },
  {
    skill: 'System Design',
    currentTier: 1,
    requiredTier: 3,
    status: 'gap',
    gap: 2,
  },
  {
    skill: 'CI/CD & DevOps',
    currentTier: 3,
    requiredTier: 3,
    status: 'met',
    gap: 0,
  },
];

const AI_ROADMAP = [
  {
    step: 1,
    title: 'Master Advanced TypeScript',
    duration: '2 Weeks',
    type: 'Learning',
    description: 'Complete the recommended module on TS Generics and Utility Types to bridge the Level 2 to Level 4 gap.',
    icon: <BookOpen className="h-5 w-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    step: 2,
    title: 'Build a Micro-Frontend Dashboard',
    duration: '3 Weeks',
    type: 'Project Evidence',
    description: 'Create a project using Next.js and Tailwind to serve as evidence for your System Design requirement.',
    icon: <Cpu className="h-5 w-5" />,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
  },
  {
    step: 3,
    title: 'Request Faculty Verification',
    duration: '1 Week',
    type: 'Endorsement',
    description: 'Submit your Micro-Frontend architecture to Prof. Sharma for a Tier 4 Faculty-Verified badge.',
    icon: <CheckCircle2 className="h-5 w-5" />,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
  },
];

export default function CareerRoadmapPage() {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Fake AI Processing Delay for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnalyzing(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const displayName = user?.name || 'Alex Learner';

  if (isAnalyzing) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center p-8 text-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50 shadow-inner">
          <Sparkles className="absolute h-10 w-10 animate-pulse text-indigo-500" />
          <svg className="absolute inset-0 h-full w-full animate-[spin_3s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#e0e7ff" strokeWidth="4" />
            <circle cx="50" cy="50" r="48" fill="none" stroke="#6366f1" strokeWidth="4" strokeDasharray="150" strokeDashoffset="50" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">AI is analyzing your Skill Passport...</h2>
        <p className="mt-2 max-w-md text-slate-500">
          Comparing {displayName}&apos;s verified competencies against real-time industry requirements for {TARGET_ROLE}.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-8">
      
      {/* ── Header Section ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Compass className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Career Gap Analysis</h1>
          </div>
          <p className="text-lg text-slate-600">
            Personalized action roadmap for <span className="font-semibold text-indigo-600">{TARGET_ROLE}</span>
          </p>
        </div>
        
        {/* Match Score Card */}
        <div className="flex items-center gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-5 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">Role Match</span>
            <span className="text-sm text-slate-500">Based on passport tiers</span>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md shadow-indigo-200/50">
            <span className="text-xl font-bold text-indigo-700">{MATCH_SCORE}%</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* ── Left Column: Gap Analysis ──────────────────────────────── */}
        <div className="lg:col-span-7">
          <div className="mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Competency Mapping</h2>
          </div>
          
          <div className="space-y-4">
            {GAP_ANALYSIS.map((item) => (
              <div key={item.skill} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900">{item.skill}</h3>
                  {item.status === 'surpassed' && <Badge variant="success" size="sm">Surpassed</Badge>}
                  {item.status === 'met' && <Badge variant="industry" size="sm">Requirement Met</Badge>}
                  {item.status === 'gap' && <Badge variant="student" size="sm">Tier Gap: {item.gap}</Badge>}
                </div>
                
                {/* Visual Gap Bar */}
                <div className="relative h-2.5 w-full rounded-full bg-slate-100">
                  {/* Required Target Marker */}
                  <div 
                    className="absolute top-1/2 -mt-2 h-4 w-1 rounded-full bg-slate-800" 
                    style={{ left: `${(item.requiredTier / 5) * 100}%` }}
                    title={`Required: Tier ${item.requiredTier}`}
                  />
                  {/* Current Level Fill */}
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out ${
                      item.status === 'gap' ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${(item.currentTier / 5) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  <span>T1 (Self)</span>
                  <span>T5 (Industry)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Column: AI Roadmap ──────────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-bold text-slate-900">Action Roadmap</h2>
          </div>
          
          <div className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="absolute bottom-10 left-10 top-10 w-0.5 bg-slate-100" />
            
            <div className="space-y-8">
              {AI_ROADMAP.map((step) => (
                <div key={step.step} className="relative flex gap-5">
                  <div className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${step.bgColor} ${step.color} shadow-sm ring-4 ring-white`}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Step {step.step}</span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        <Clock className="h-3 w-3" /> {step.duration}
                      </span>
                    </div>
                    <h3 className="mt-1 font-bold text-slate-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                    <button className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                      Start {step.type} <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 border border-slate-100">
              <div className="flex items-start gap-2">
                <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                <p>Completing this roadmap will increase your <strong>Role Match to 95%</strong>, unlocking direct interview invites.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}