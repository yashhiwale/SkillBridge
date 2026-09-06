// frontend/src/app/assessment/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import {
  BrainCircuit,
  Play,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Assessment Demo (Showing 3 out of 80)
───────────────────────────────────────────────────────────── */
const TOTAL_QUESTIONS = 80;

const DEMO_QUESTIONS = [
  {
    id: 1,
    category: 'System Design',
    text: 'Which of the following database scaling techniques involves partitioning data across multiple independent databases?',
    options: ['Vertical Scaling', 'Replication', 'Sharding', 'Caching'],
  },
  {
    id: 2,
    category: 'React.js Architecture',
    text: 'What is the primary benefit of React Server Components (RSC) introduced in Next.js App Router?',
    options: [
      'They allow you to use useState on the server.',
      'They reduce the client-side JavaScript bundle size.',
      'They replace the need for REST APIs completely.',
      'They automatically manage global state like Redux.'
    ],
  },
  {
    id: 3,
    category: 'Soft Skills / Scenario',
    text: 'You discover a critical bug in production right before a major client demo. What is your immediate next step?',
    options: [
      'Quietly try to fix it before the demo starts without telling anyone.',
      'Cancel the demo immediately.',
      'Inform stakeholders of the risk, assess the fix time, and decide whether to rollback or apply a hotfix.',
      'Blame the QA team for missing it during testing.'
    ],
  }
];

export default function AssessmentPage() {
  const { user } = useAuth();
  
  // States: 'intro' | 'quiz' | 'analyzing' | 'completed'
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'analyzing' | 'completed'>('intro');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Auto-transition from analyzing to completed
  useEffect(() => {
    if (phase === 'analyzing') {
      const timer = setTimeout(() => setPhase('completed'), 2500);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleStart = () => setPhase('quiz');

  const handleNext = () => {
    if (currentQIndex < DEMO_QUESTIONS.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Finished demo questions
      setPhase('analyzing');
    }
  };

  const displayName = user?.name || 'Candidate';

  return (
    <div className="mx-auto max-w-4xl py-12">
      
      {/* ── Phase 1: Intro Screen ──────────────────────────────── */}
      {phase === 'intro' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <BrainCircuit className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Comprehensive Skill Diagnostic</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Welcome, <span className="font-semibold text-indigo-600">{displayName}</span>. This diagnostic maps your technical and behavioral competencies against industry standards.
          </p>
          
          <div className="mx-auto mt-10 grid max-w-lg gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <Clock className="h-6 w-6 text-indigo-500" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Duration</p>
                <p className="font-semibold text-slate-900">45-60 Mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left">
              <AlertCircle className="h-6 w-6 text-indigo-500" />
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Questions</p>
                <p className="font-semibold text-slate-900">{TOTAL_QUESTIONS} Multiple Choice</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-600/35"
          >
            <Play className="h-5 w-5 fill-current" />
            Start Assessment
          </button>
        </div>
      )}

      {/* ── Phase 2: Quiz UI ──────────────────────────────────── */}
      {phase === 'quiz' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          
          {/* Progress Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Question {currentQIndex + 1} <span className="text-slate-300">of {TOTAL_QUESTIONS}</span>
              </span>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
                {DEMO_QUESTIONS[currentQIndex].category}
              </span>
            </div>
            {/* Fake progress bar scaling to 80 */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div 
                className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                style={{ width: `${((currentQIndex + 1) / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-right text-[10px] text-slate-400">Note: Demo skips to analysis after 3 questions.</p>
          </div>

          {/* Question Text */}
          <h2 className="mb-8 text-xl font-bold leading-relaxed text-slate-900 sm:text-2xl">
            {DEMO_QUESTIONS[currentQIndex].text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {DEMO_QUESTIONS[currentQIndex].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedOption(option)}
                className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition-all sm:text-base ${
                  selectedOption === option
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    selectedOption === option ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 bg-slate-100 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  {option}
                </div>
              </button>
            ))}
          </div>

          {/* Footer Controls */}
          <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
            <button 
              className="text-sm font-semibold text-slate-400 hover:text-slate-600"
              onClick={() => alert("Save for later functionality goes live with API.")}
            >
              Save & Exit
            </button>
            <button
              onClick={handleNext}
              disabled={!selectedOption}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
                !selectedOption
                  ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                  : 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700'
              }`}
            >
              {currentQIndex === DEMO_QUESTIONS.length - 1 ? 'Submit Assessment' : 'Next Question'}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Phase 3: Analyzing Screen ─────────────────────────── */}
      {phase === 'analyzing' && (
        <div className="flex min-h-[50vh] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Loader2 className="mb-6 h-12 w-12 animate-spin text-indigo-600" />
          <h2 className="text-2xl font-bold text-slate-900">Computing Skill Tiers...</h2>
          <p className="mt-2 text-slate-500">Evaluating 80 responses using the SkillBridge inference engine.</p>
        </div>
      )}

      {/* ── Phase 4: Completed Screen ─────────────────────────── */}
      {phase === 'completed' && (
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Diagnostic Complete!</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
            Great job! Your responses have been processed and your <span className="font-semibold text-slate-900">Verified Skill Passport</span> has been updated with Tier 2 (Assessed) badges.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/skills" className="w-full sm:w-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 hover:shadow-lg">
                <ShieldCheck className="h-4 w-4" />
                View Skill Passport
              </button>
            </Link>
            <Link href="/career" className="w-full sm:w-auto">
              <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                <Compass className="h-4 w-4" />
                See Gap Analysis
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}