'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Brain,
  ClipboardList,
  Code2,
  MessagesSquare,
  RefreshCw,
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

const ASSESSMENT_TRACKS = [
  {
    id: 'profiling',
    title: '20-Question Career Profiling',
    description:
      'A structured questionnaire that captures your interests, work preferences, and aspirations to anchor your personal profile and target roles.',
    icon: Brain,
    format: 'Questionnaire',
  },
  {
    id: 'technical',
    title: 'Technical Skill Assessments',
    description:
      'Role-aligned technical evaluations across programming, data, cloud, and domain tooling. Results feed directly into your skill gap analysis.',
    icon: Code2,
    format: 'Timed assessment',
  },
  {
    id: 'soft',
    title: 'Soft Skill Assessments',
    description:
      'Scenario-based evaluation of communication, collaboration, problem framing, and adaptability — the skills industry mentors ask about first.',
    icon: MessagesSquare,
    format: 'Scenario-based',
  },
] as const;

const PROFILING_FIELDS = [
  { label: 'Questions answered', value: '—' },
  { label: 'Completion status', value: '—' },
  { label: 'Last updated', value: '—' },
  { label: 'Linked target roles', value: '—' },
] as const;

export default function AssessmentPage() {
  const assessments = usePanelState();
  const profiling = usePanelState();

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Assessments
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Career Profiling &amp; Skill Assessments
          </h1>
          <p className="max-w-2xl text-slate-600">
            Start with the 20-Question Career Profiling, then validate your technical and soft
            skills. Every completed assessment raises entries in your Skill Passport from
            Self-Declared to Assessed.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Data panels */}
      <section
        aria-labelledby="assessment-panels-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <h2 id="assessment-panels-heading" className="sr-only">
          Assessment data
        </h2>

        {/* Assessment list panel */}
        <div className="lg:col-span-2">
          <Card padding="lg" bordered>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Your assessments</h3>
                <p className="text-sm text-slate-500">
                  Available, in-progress, and completed assessments assigned to your profile.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {IS_DEV && (
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                    onClick={assessments.simulateError}
                    ariaLabel="Simulate error state for the assessment list"
                  >
                    Simulate error
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onClick={assessments.retry}
                  ariaLabel="Retry loading assessments"
                >
                  Retry
                </Button>
              </div>
            </div>

            <StateView
              state={assessments.state}
              title={
                assessments.state === 'error'
                  ? 'We couldn’t load your assessments'
                  : assessments.state === 'loading'
                    ? 'Loading assessments'
                    : 'No assessments yet'
              }
              description={
                assessments.state === 'error'
                  ? 'The assessment service did not respond. Retry, or come back in a moment.'
                  : assessments.state === 'loading'
                    ? 'Fetching your assigned and completed assessments.'
                    : 'Assessments will appear here once the assessment service is connected and your profiling is complete.'
              }
              action={{ label: 'Retry', onClick: assessments.retry }}
            />
          </Card>
        </div>

        {/* Profiling status card */}
        <Card padding="lg" bordered>
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Profiling status</h3>
              <p className="text-sm text-slate-500">20-Question Career Profiling</p>
            </div>
            <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <ClipboardList className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          {profiling.state === 'empty' || profiling.state === 'success' ? (
            <dl className="divide-y divide-slate-100">
              {PROFILING_FIELDS.map((field) => (
                <div key={field.label} className="flex items-center justify-between py-3">
                  <dt className="text-sm text-slate-500">{field.label}</dt>
                  <dd className="text-sm font-semibold text-slate-900">{field.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <StateView
              state={profiling.state}
              title={
                profiling.state === 'error' ? 'Profiling status unavailable' : 'Loading status'
              }
              description={
                profiling.state === 'error'
                  ? 'We could not fetch your profiling progress.'
                  : 'Checking your career profiling progress.'
              }
              action={{ label: 'Retry', onClick: profiling.retry }}
            />
          )}

          <div className="mt-6 flex items-center justify-between gap-2">
            <Button variant="primary" size="sm" fullWidth>
              Start profiling
            </Button>
            {IS_DEV && (
              <Button
                variant="ghost"
                size="xs"
                onClick={profiling.simulateError}
                ariaLabel="Simulate error state for profiling status"
              >
                Err
              </Button>
            )}
          </div>
        </Card>
      </section>

      {/* Static structure: assessment tracks */}
      <section aria-labelledby="tracks-heading" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Assessment tracks
          </p>
          <h2 id="tracks-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            Three tracks, one verified profile
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ASSESSMENT_TRACKS.map((track) => {
            const Icon = track.icon;
            return (
              <Card key={track.id} padding="lg" bordered hoverable>
                <div className="flex h-full flex-col">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">{track.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {track.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                    <span className="text-slate-500">{track.format}</span>
                    <span className="font-semibold text-slate-900">Status: —</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}