'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Award,
  FolderGit2,
  Github,
  Globe,
  RefreshCw,
  UserRound,
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

const PROFILE_FIELDS = [
  { label: 'Institution', value: '—' },
  { label: 'Programme', value: '—' },
  { label: 'Graduation year', value: '—' },
  { label: 'Headline', value: '—' },
  { label: 'Career profiling', value: '—' },
] as const;

const EVIDENCE_TYPES = [
  {
    id: 'github',
    title: 'GitHub repositories',
    description:
      'Link repositories that demonstrate a skill. Commits, README quality, and tests are visible to reviewers.',
    icon: Github,
  },
  {
    id: 'demo',
    title: 'Live demos',
    description:
      'Deployed applications or notebooks reviewers can open and interact with directly.',
    icon: Globe,
  },
  {
    id: 'certificate',
    title: 'Certificates',
    description:
      'Course completions and industry certifications attached as supporting evidence.',
    icon: Award,
  },
] as const;

export default function ProfilePage() {
  const evidence = usePanelState();
  const credentials = usePanelState();

  return (
    <div className="space-y-10">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Profile
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Personal Profile &amp; Evidence Hub
          </h1>
          <p className="max-w-2xl text-slate-600">
            The single place reviewers see who you are and what you can prove. Keep your profile
            current and attach evidence to every skill you want verified.
          </p>
        </div>
        <Badge variant="student" size="md" dot>
          {ROLE_LABELS.student}
        </Badge>
      </header>

      {/* Summary + evidence panel */}
      <section
        aria-labelledby="profile-panels-heading"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <h2 id="profile-panels-heading" className="sr-only">
          Profile data
        </h2>

        {/* Profile summary card */}
        <Card padding="lg" bordered>
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"
            >
              <UserRound className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-slate-900">—</p>
              <p className="truncate text-sm text-slate-500">—</p>
              <div className="mt-1.5">
                <Badge variant="student" size="xs">
                  {ROLE_LABELS.student}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="mt-6 divide-y divide-slate-100 border-t border-slate-100">
            {PROFILE_FIELDS.map((field) => (
              <div key={field.label} className="flex items-center justify-between py-3">
                <dt className="text-sm text-slate-500">{field.label}</dt>
                <dd className="text-sm font-semibold text-slate-900">{field.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 space-y-2">
            <Button variant="primary" size="sm" fullWidth>
              Edit profile
            </Button>
            <Button variant="secondary" size="sm" fullWidth>
              Share public profile
            </Button>
          </div>
          {/* TODO(api): replace with api.get(...) from lib/api.ts */}
        </Card>

        {/* Evidence panel */}
        <div className="lg:col-span-2">
          <Card padding="lg" bordered>
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <FolderGit2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Project &amp; Evidence Hub</h3>
                  <p className="text-sm text-slate-500">
                    Repositories, live demos, and certificates linked to passport skills.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {IS_DEV && (
                  <Button
                    variant="ghost"
                    size="xs"
                    leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                    onClick={evidence.simulateError}
                    ariaLabel="Simulate error state for evidence"
                  >
                    Simulate error
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                  onClick={evidence.retry}
                  ariaLabel="Retry loading evidence"
                >
                  Retry
                </Button>
              </div>
            </div>

            <StateView
              state={evidence.state}
              title={
                evidence.state === 'error'
                  ? 'Evidence unavailable'
                  : evidence.state === 'loading'
                    ? 'Loading evidence'
                    : 'No evidence added yet'
              }
              description={
                evidence.state === 'error'
                  ? 'The evidence service did not respond. Retry to reload your items.'
                  : evidence.state === 'loading'
                    ? 'Fetching linked repositories, demos, and certificates.'
                    : 'Add a GitHub repository, live demo, or certificate and link it to a skill to start moving entries toward Project-Verified.'
              }
              action={{ label: 'Retry', onClick: evidence.retry }}
            />

            {/* Evidence type structure */}
            <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-6 sm:grid-cols-3">
              {EVIDENCE_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    className="rounded-xl border border-slate-200/80 bg-slate-50 p-4"
                  >
                    <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 ring-1 ring-slate-200">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">{type.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {type.description}
                    </p>
                    <p className="mt-3 text-xs text-slate-500">
                      Linked: <span className="font-semibold text-slate-900">—</span>
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* Credentials panel */}
      <section aria-labelledby="credentials-heading">
        <Card padding="lg" bordered>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                Credentials
              </p>
              <h2 id="credentials-heading" className="text-lg font-semibold text-slate-900">
                Academic &amp; professional credentials
              </h2>
              <p className="text-sm text-slate-500">
                Degrees, enrolments, and institution-issued credentials attached to your profile.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {IS_DEV && (
                <Button
                  variant="ghost"
                  size="xs"
                  leftIcon={<AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />}
                  onClick={credentials.simulateError}
                  ariaLabel="Simulate error state for credentials"
                >
                  Simulate error
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<RefreshCw className="h-4 w-4" aria-hidden="true" />}
                onClick={credentials.retry}
                ariaLabel="Retry loading credentials"
              >
                Retry
              </Button>
            </div>
          </div>

          <StateView
            state={credentials.state}
            title={
              credentials.state === 'error'
                ? 'Credentials unavailable'
                : credentials.state === 'loading'
                  ? 'Loading credentials'
                  : 'No credentials on record'
            }
            description={
              credentials.state === 'error'
                ? 'We could not load your credentials. Retry to try again.'
                : credentials.state === 'loading'
                  ? 'Fetching credentials issued by your institution.'
                  : 'Credentials issued or confirmed by your institution will be listed here once your institution account is linked.'
            }
            action={{ label: 'Retry', onClick: credentials.retry }}
          />
        </Card>
      </section>
    </div>
  );
}