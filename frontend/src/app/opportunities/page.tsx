'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Briefcase,
  Inbox,
  MessageSquareText,
  RefreshCw,
  Send,
  UserCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StateView } from '@/components/ui/StateView';
import type { UIState } from '@/types/common';
import { ROLE_LABELS } from '@/types/roles';

const IS_DEV = process.env.NODE_ENV !== 'production';
const RESOLVE_DELAY_MS = 600;

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

type OpportunityType = 'all' | 'internship' | 'job' | 'project';

const TYPE_FILTERS: ReadonlyArray<{ id: OpportunityType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'internship', label: 'Internships' },
  { id: 'job', label: 'Jobs' },
  { id: 'project', label: 'Industry projects' },
];

const FEEDBACK_LOOP_STEPS = [
  {
    id: 'apply',
    title: 'Apply with your passport',
    description:
      'Share your Verified Skill Passport and Evidence Hub links directly with the posting. No separate CV formatting required.',
    icon: Send,
  },
  {
    id: 'review',
    title: 'Industry reviews evidence',
    description:
      'Recruiters and mentors review the evidence behind each skill and leave structured, skill-level feedback.',
    icon: UserCheck,
  },
  {
    id: 'act',
    title: 'Feedback updates your roadmap',
    description:
      'Feedback lands in your inbox and can be turned into new roadmap milestones — closing the loop between industry and learning.',
    icon: MessageSquareText,
  },
] as const;

export default function OpportunitiesPage() {
  const opportunities = usePanelState();
  const feedback = usePanelState();
  const [activeType, setActiveType] = useState<OpportunityType>('all');

  const activeTypeLabel = TYPE_FILTERS.find((f) => f.id === activeType)?.label ?? 'All';

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Opportunities
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Industry Opportunities &amp; Feedback Loop
          </h1>
          <p className="max-w-2xl text-slate-600">
            Internships, jobs, and industry projects that match the skills in your passport — plus
            direct, skill-level feedback from the people who review your evidence.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Data panels */}
      <section
        aria-labelledby="opportunity-panels-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <h2 id="opportunity-panels-heading" className="sr-only">
          Opportunity data
        </h2>

        <div className="space-y-6 lg:col-span-2">
          {/* Type filter chips */}
          <div
            role="group"
            aria-label="Filter opportunities by type"
            className="flex flex-wrap gap-2"
          >
            {TYPE_FILTERS.map((filter) => {
              const isActive = filter.id === activeType;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveType(filter.id)}
                  className={[
                    'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                    isActive
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900',
                  ].join(' ')}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          {/* Opportunity list panel */}
          <Card padding="lg" bordered>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Briefcase className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Open opportunities</h3>
                  <p className="text-sm text-slate-500">
                    Showing: <span className="font-medium text-slate-700">{activeTypeLabel}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {IS_DEV && (
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                    onClick={opportunities.simulateError}
                    ariaLabel="Simulate error state for opportunities"
                  >
                    Simulate error
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onClick={opportunities.retry}
                  ariaLabel="Retry loading opportunities"
                >
                  Retry
                </Button>
              </div>
            </div>

            <StateView
              state={opportunities.state}
              title={
                opportunities.state === 'error'
                  ? 'Opportunities unavailable'
                  : opportunities.state === 'loading'
                    ? 'Loading opportunities'
                    : 'No opportunities listed yet'
              }
              description={
                opportunities.state === 'error'
                  ? 'The opportunities service did not respond. Retry to reload listings.'
                  : opportunities.state === 'loading'
                    ? 'Fetching postings that reference skills in your passport.'
                    : activeType === 'all'
                      ? 'Industry partners publish postings here. Complete your profile and assessments to be matched when listings go live.'
                      : `No ${activeTypeLabel.toLowerCase()} listed right now. Try another type or check back later.`
              }
              action={{ label: 'Retry', onClick: opportunities.retry }}
            />
          </Card>
        </div>

        {/* Feedback inbox panel */}
        <Card padding="lg" bordered>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
                <Inbox className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Feedback inbox</h3>
                <p className="text-sm text-slate-500">Direct industry feedback</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {IS_DEV && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={feedback.simulateError}
                  ariaLabel="Simulate error state for feedback inbox"
                >
                  Err
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                onClick={feedback.retry}
                ariaLabel="Retry loading feedback"
              >
                Retry
              </Button>
            </div>
          </div>

          <StateView
            state={feedback.state}
            title={
              feedback.state === 'error'
                ? 'Inbox unavailable'
                : feedback.state === 'loading'
                  ? 'Checking your inbox'
                  : 'No feedback yet'
            }
            description={
              feedback.state === 'error'
                ? 'We could not load your feedback. Retry to try again.'
                : feedback.state === 'loading'
                  ? 'Fetching feedback from industry reviewers.'
                  : 'When a recruiter or mentor reviews your evidence, their skill-level feedback appears here.'
            }
            action={{ label: 'Retry', onClick: feedback.retry }}
          />
        </Card>
      </section>

      {/* Static structure: feedback loop */}
      <section aria-labelledby="feedback-loop-heading" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Direct feedback loop
          </p>
          <h2
            id="feedback-loop-heading"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            How industry feedback reaches you
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEEDBACK_LOOP_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={step.id} padding="lg" bordered hoverable>
                <div className="flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                      Step {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="rounded-xl bg-slate-100 p-2 text-slate-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}