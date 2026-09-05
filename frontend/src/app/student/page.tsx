'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowUpRight,
  Brain,
  Briefcase,
  ClipboardCheck,
  FolderGit2,
  Map,
  RefreshCw,
  Route,
  ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StateView } from '@/components/ui/StateView';
import type { UIState } from '@/types/common';
import { ROLE_LABELS } from '@/types/roles';

const IS_DEV = process.env.NODE_ENV !== 'production';
const RESOLVE_DELAY_MS = 600;
const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';

/** Local placeholder loader: loading → empty after a short delay (no backend yet). */
function usePanelState() {
  const [state, setState] = useState<UIState>('loading');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const load = useCallback(() => {
    clear();
    setState('loading');
    // TODO(api): replace with api.get(...) from lib/api.ts
    timerRef.current = setTimeout(() => setState('empty'), RESOLVE_DELAY_MS);
  }, []);

  const simulateError = useCallback(() => {
    clear();
    setState('error');
  }, []);

  useEffect(() => {
    load();
    return clear;
  }, [load]);

  return { state, retry: load, simulateError };
}

const MODULES = [
  {
    id: 'profiling',
    step: '01',
    title: 'Career Profiling & Profile',
    description: 'Answer 20 questions to anchor your profile, interests, and target roles.',
    href: '/assessment',
    icon: Brain,
  },
  {
    id: 'assessments',
    step: '02',
    title: 'Skill Assessments',
    description: 'Validate technical and soft skills to move entries to the Assessed tier.',
    href: '/assessment',
    icon: ClipboardCheck,
  },
  {
    id: 'career',
    step: '03',
    title: 'Gap Analysis & Roadmap',
    description: 'See what a target role expects and follow milestones that close each gap.',
    href: '/career',
    icon: Map,
  },
  {
    id: 'evidence',
    step: '04',
    title: 'Project & Evidence Hub',
    description: 'Link GitHub repositories, live demos, and certificates to your skills.',
    href: '/profile',
    icon: FolderGit2,
  },
  {
    id: 'passport',
    step: '05',
    title: 'Verified Skill Passport',
    description: 'Your portable record of skills, from Self-Declared to Industry-Verified.',
    href: '/skills',
    icon: ShieldCheck,
  },
  {
    id: 'opportunities',
    step: '06',
    title: 'Opportunities & Feedback',
    description: 'Apply with your passport and receive direct, skill-level industry feedback.',
    href: '/opportunities',
    icon: Briefcase,
  },
] as const;

export default function StudentPage() {
  const journey = usePanelState();

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Student
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Student Workspace
          </h1>
          <p className="max-w-2xl text-slate-600">
            Your home for the SkillBridge journey — profile, assess, close gaps, gather evidence,
            and carry a Verified Skill Passport into industry.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Journey panel */}
      <Card padding="lg" bordered>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Route className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Your journey</h2>
              <p className="text-sm text-slate-500">
                Current stage, next milestone, and pending verifications.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {IS_DEV && (
              <Button
                variant="ghost"
                size="xs"
                leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                onClick={journey.simulateError}
                ariaLabel="Simulate error state for journey"
              >
                Simulate error
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
              onClick={journey.retry}
              ariaLabel="Retry loading journey"
            >
              Retry
            </Button>
          </div>
        </div>

        <StateView
          state={journey.state}
          title={
            journey.state === 'error'
              ? 'Journey unavailable'
              : journey.state === 'loading'
                ? 'Loading your journey'
                : 'Your journey hasn’t started yet'
          }
          description={
            journey.state === 'error'
              ? 'We could not load your progress. Retry to try again.'
              : journey.state === 'loading'
                ? 'Fetching your current stage and pending verifications.'
                : 'Begin with the 20-Question Career Profiling — every later module builds on it.'
          }
          action={{ label: 'Retry', onClick: journey.retry }}
        />
      </Card>

      {/* Module grid */}
      <section aria-labelledby="modules-heading" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Workspace
          </p>
          <h2 id="modules-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            Six modules, one verified journey
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.id}
                href={module.href}
                className={`group block rounded-2xl ${FOCUS_RING}`}
              >
                <Card padding="lg" bordered hoverable>
                  <div className="flex h-full flex-col">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Module {module.step}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">{module.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {module.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                      <span className="text-slate-500">
                        Status: <span className="font-semibold text-slate-900">—</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                        Open
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}