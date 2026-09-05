'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Flag, Map, RefreshCw, Target } from 'lucide-react';

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

const ROADMAP_PHASES = [
  {
    id: 'foundation',
    step: '01',
    title: 'Foundation',
    description:
      'Close the highest-priority gaps identified against your target role with curated learning and short practice tasks.',
  },
  {
    id: 'build',
    step: '02',
    title: 'Build',
    description:
      'Apply new skills in portfolio projects and log evidence — repositories, demos, and write-ups — in your Evidence Hub.',
  },
  {
    id: 'verify',
    step: '03',
    title: 'Verify',
    description:
      'Submit evidence for faculty and industry review to move passport entries up the verification ladder.',
  },
] as const;

export default function CareerPage() {
  const gaps = usePanelState();
  const roadmap = usePanelState();

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Career
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Skill Gap Analysis &amp; Action Roadmap
          </h1>
          <p className="max-w-2xl text-slate-600">
            Compare your assessed skills against the expectations of a target role, then follow a
            personalized roadmap of milestones that turns each gap into verifiable progress.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Target role selector placeholder */}
      <Card padding="lg" bordered>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Target role</h2>
              <p className="text-sm text-slate-500">
                Gap analysis and roadmap are computed against the role you select here.
              </p>
            </div>
          </div>
          <div className="w-full md:w-80">
            <label
              htmlFor="target-role"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
            >
              Select target role
            </label>
            <select
              id="target-role"
              disabled
              defaultValue=""
              aria-describedby="target-role-help"
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"
            >
              <option value="">— No roles loaded —</option>
            </select>
            <p id="target-role-help" className="mt-1.5 text-xs text-slate-500">
              Role catalogue loads from the career service.
              {/* TODO(api): replace with api.get(...) from lib/api.ts */}
            </p>
          </div>
        </div>
      </Card>

      {/* Data panels */}
      <section
        aria-labelledby="career-panels-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-2"
      >
        <h2 id="career-panels-heading" className="sr-only">
          Career data
        </h2>

        {/* Skill gap panel */}
        <Card padding="lg" bordered>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Skill gaps</h3>
              <p className="text-sm text-slate-500">
                Skills your target role expects that are not yet assessed or verified.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {IS_DEV && (
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                  onClick={gaps.simulateError}
                  ariaLabel="Simulate error state for skill gaps"
                >
                  Simulate error
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                onClick={gaps.retry}
                ariaLabel="Retry loading skill gaps"
              >
                Retry
              </Button>
            </div>
          </div>

          <StateView
            state={gaps.state}
            title={
              gaps.state === 'error'
                ? 'Gap analysis unavailable'
                : gaps.state === 'loading'
                  ? 'Analysing skill gaps'
                  : 'No gap analysis yet'
            }
            description={
              gaps.state === 'error'
                ? 'The career service did not respond. Retry to run the analysis again.'
                : gaps.state === 'loading'
                  ? 'Comparing your passport against the selected target role.'
                  : 'Select a target role and complete at least one assessment to generate your first gap analysis.'
            }
            action={{ label: 'Retry', onClick: gaps.retry }}
          />
        </Card>

        {/* Roadmap milestones panel */}
        <Card padding="lg" bordered>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Roadmap milestones</h3>
              <p className="text-sm text-slate-500">
                Ordered actions with due dates, linked resources, and evidence checkpoints.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {IS_DEV && (
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                  onClick={roadmap.simulateError}
                  ariaLabel="Simulate error state for roadmap milestones"
                >
                  Simulate error
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                onClick={roadmap.retry}
                ariaLabel="Retry loading roadmap milestones"
              >
                Retry
              </Button>
            </div>
          </div>

          <StateView
            state={roadmap.state}
            title={
              roadmap.state === 'error'
                ? 'Roadmap unavailable'
                : roadmap.state === 'loading'
                  ? 'Loading roadmap'
                  : 'No roadmap yet'
            }
            description={
              roadmap.state === 'error'
                ? 'We could not fetch your milestones. Retry to try again.'
                : roadmap.state === 'loading'
                  ? 'Fetching your personalized action plan.'
                  : 'Your roadmap is generated from your gap analysis. Milestones will appear here once a target role is set.'
            }
            action={{ label: 'Retry', onClick: roadmap.retry }}
          />
        </Card>
      </section>

      {/* Static structure: roadmap phases */}
      <section aria-labelledby="phases-heading" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Roadmap structure
          </p>
          <h2 id="phases-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            How your roadmap is organised
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {ROADMAP_PHASES.map((phase) => (
            <Card key={phase.id} padding="lg" bordered hoverable>
              <div className="flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                    Phase {phase.step}
                  </span>
                  <span className="rounded-xl bg-slate-100 p-2 text-slate-600">
                    {phase.id === 'verify' ? (
                      <Flag className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Map className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{phase.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {phase.description}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                  <span className="text-slate-500">Milestones</span>
                  <span className="font-semibold text-slate-900">—</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}