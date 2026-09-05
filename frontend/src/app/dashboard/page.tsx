'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  ClipboardCheck,
  Map,
  RefreshCw,
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

const OVERVIEW_TILES = [
  {
    id: 'passport',
    label: 'Passport entries',
    hint: 'Skills with a verification tier',
    icon: ShieldCheck,
    href: '/skills',
  },
  {
    id: 'assessments',
    label: 'Assessments completed',
    hint: 'Technical and soft skill',
    icon: ClipboardCheck,
    href: '/assessment',
  },
  {
    id: 'milestones',
    label: 'Roadmap milestones',
    hint: 'Open actions on your roadmap',
    icon: Map,
    href: '/career',
  },
  {
    id: 'opportunities',
    label: 'Matched opportunities',
    hint: 'Postings referencing your skills',
    icon: Briefcase,
    href: '/opportunities',
  },
] as const;

const NEXT_STEPS = [
  {
    id: 'profiling',
    title: 'Complete the 20-Question Career Profiling',
    description: 'Anchors your profile and unlocks target-role gap analysis.',
    href: '/assessment',
    cta: 'Start profiling',
  },
  {
    id: 'assess',
    title: 'Take your first technical assessment',
    description: 'Moves self-declared skills to the Assessed tier.',
    href: '/assessment',
    cta: 'View assessments',
  },
  {
    id: 'evidence',
    title: 'Link a project to your Evidence Hub',
    description: 'A GitHub repo or live demo is the first step to Project-Verified.',
    href: '/profile',
    cta: 'Add evidence',
  },
  {
    id: 'roadmap',
    title: 'Set a target role and generate a roadmap',
    description: 'Turns each skill gap into a milestone with a due date.',
    href: '/career',
    cta: 'Choose a role',
  },
] as const;

export default function DashboardPage() {
  const activity = usePanelState();

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Dashboard
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Skill readiness overview
          </h1>
          <p className="max-w-2xl text-slate-600">
            A single view of your passport, assessments, roadmap, and opportunities. Values fill
            in as you complete profiling and connect evidence.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Overview tiles */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {OVERVIEW_TILES.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link key={tile.id} href={tile.href} className={`block rounded-2xl ${FOCUS_RING}`}>
                <Card padding="lg" bordered hoverable>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-500">{tile.label}</p>
                      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">—</p>
                      <p className="mt-1 text-xs text-slate-500">{tile.hint}</p>
                    </div>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Activity + next steps */}
      <section
        aria-labelledby="activity-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2">
          <Card padding="lg" bordered>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="activity-heading" className="text-lg font-semibold text-slate-900">
                    Recent activity
                  </h2>
                  <p className="text-sm text-slate-500">
                    Assessments, verifications, feedback, and roadmap updates.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {IS_DEV && (
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                    onClick={activity.simulateError}
                    ariaLabel="Simulate error state for recent activity"
                  >
                    Simulate error
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onClick={activity.retry}
                  ariaLabel="Retry loading recent activity"
                >
                  Retry
                </Button>
              </div>
            </div>

            <StateView
              state={activity.state}
              title={
                activity.state === 'error'
                  ? 'Activity unavailable'
                  : activity.state === 'loading'
                    ? 'Loading activity'
                    : 'No activity yet'
              }
              description={
                activity.state === 'error'
                  ? 'The activity feed did not respond. Retry to reload it.'
                  : activity.state === 'loading'
                    ? 'Fetching your latest assessments, verifications, and feedback.'
                    : 'Your activity feed starts once you complete profiling or an assessment.'
              }
              action={{ label: 'Retry', onClick: activity.retry }}
            />
          </Card>
        </div>

        <Card padding="lg" bordered>
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Next steps
            </p>
            <h2 className="text-lg font-semibold text-slate-900">Recommended for you</h2>
          </div>
          <ol className="divide-y divide-slate-100">
            {NEXT_STEPS.map((step, index) => (
              <li key={step.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className={`mt-2 inline-flex items-center gap-1 rounded-md text-xs font-semibold text-indigo-600 hover:text-indigo-700 ${FOCUS_RING}`}
                    >
                      {step.cta}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}