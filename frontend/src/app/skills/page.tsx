'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StateView } from '@/components/ui/StateView';
import type { UIState, VerificationStatus } from '@/types/common';
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

const TIERS: ReadonlyArray<{
  id: VerificationStatus;
  label: string;
  description: string;
}> = [
  {
    id: 'self-declared',
    label: 'Self-Declared',
    description: 'You added the skill to your profile. Not yet validated by any assessment.',
  },
  {
    id: 'assessed',
    label: 'Assessed',
    description: 'Validated by a SkillBridge technical or soft skill assessment.',
  },
  {
    id: 'project-verified',
    label: 'Project-Verified',
    description: 'Backed by evidence in your Project & Evidence Hub — repositories, demos, certificates.',
  },
  {
    id: 'faculty-verified',
    label: 'Faculty-Verified',
    description: 'Reviewed and endorsed by an academician at your institution.',
  },
  {
    id: 'industry-verified',
    label: 'Industry-Verified',
    description: 'Endorsed by an industry reviewer or recruiter through the feedback loop.',
  },
];

type TierFilter = 'all' | VerificationStatus;

const TIER_FILTERS: ReadonlyArray<{ id: TierFilter; label: string }> = [
  { id: 'all', label: 'All tiers' },
  ...TIERS.map((tier) => ({ id: tier.id, label: tier.label })),
];

const PASSPORT_SUMMARY = [
  { label: 'Passport entries', value: '—' },
  { label: 'Highest tier reached', value: '—' },
  { label: 'Pending reviews', value: '—' },
  { label: 'Last verification', value: '—' },
] as const;

export default function SkillsPage() {
  const passport = usePanelState();
  const [activeFilter, setActiveFilter] = useState<TierFilter>('all');

  const activeFilterLabel =
    TIER_FILTERS.find((filter) => filter.id === activeFilter)?.label ?? 'All tiers';

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Skills
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Verified Skill Passport
          </h1>
          <p className="max-w-2xl text-slate-600">
            Your portable, evidence-backed record of skills. Each entry carries a verification
            tier that faculty, institutions, and recruiters can trust at a glance.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Summary + panel */}
      <section
        aria-labelledby="passport-panels-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <h2 id="passport-panels-heading" className="sr-only">
          Passport data
        </h2>

        <div className="space-y-6 lg:col-span-2">
          {/* Tier filter chips */}
          <div
            role="group"
            aria-label="Filter passport entries by verification tier"
            className="flex flex-wrap gap-2"
          >
            {TIER_FILTERS.map((filter) => {
              const isActive = filter.id === activeFilter;
              return (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveFilter(filter.id)}
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

          {/* Passport entries panel */}
          <Card padding="lg" bordered>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Passport entries</h3>
                <p className="text-sm text-slate-500">
                  Showing: <span className="font-medium text-slate-700">{activeFilterLabel}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                {IS_DEV && (
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                    onClick={passport.simulateError}
                    ariaLabel="Simulate error state for passport entries"
                  >
                    Simulate error
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onClick={passport.retry}
                  ariaLabel="Retry loading passport entries"
                >
                  Retry
                </Button>
              </div>
            </div>

            <StateView
              state={passport.state}
              title={
                passport.state === 'error'
                  ? 'Passport unavailable'
                  : passport.state === 'loading'
                    ? 'Loading your passport'
                    : 'Your passport is empty'
              }
              description={
                passport.state === 'error'
                  ? 'The passport service did not respond. Retry to reload your entries.'
                  : passport.state === 'loading'
                    ? 'Fetching skill entries and their verification tiers.'
                    : activeFilter === 'all'
                      ? 'Add skills to your profile or complete an assessment to create your first passport entry.'
                      : `No entries at the ${activeFilterLabel} tier yet. Entries move up the ladder as evidence is reviewed.`
              }
              action={{ label: 'Retry', onClick: passport.retry }}
            />
          </Card>
        </div>

        {/* Passport summary */}
        <Card padding="lg" bordered>
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Passport summary</h3>
              <p className="text-sm text-slate-500">Verification overview</p>
            </div>
            <span className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <dl className="divide-y divide-slate-100">
            {PASSPORT_SUMMARY.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-500">{item.label}</dt>
                <dd className="text-sm font-semibold text-slate-900">{item.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6">
            <Button variant="primary" size="sm" fullWidth>
              Add a skill
            </Button>
          </div>
        </Card>
      </section>

      {/* Static structure: tier legend */}
      <section aria-labelledby="tier-legend-heading" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Verification ladder
          </p>
          <h2
            id="tier-legend-heading"
            className="text-2xl font-bold tracking-tight text-slate-900"
          >
            What each tier means
          </h2>
        </div>

        <Card padding="none" bordered>
          <ol className="divide-y divide-slate-100">
            {TIERS.map((tier, index) => (
              <li
                key={tier.id}
                className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:gap-6"
              >
                <span className="w-8 shrink-0 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-44 shrink-0">
                  <Badge variant={tier.id} size="sm" dot>
                    {tier.label}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{tier.description}</p>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </div>
  );
}