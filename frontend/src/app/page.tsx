// frontend/src/app/page.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  ClipboardList,
  Compass,
  FolderGit2,
  GraduationCap,
  Handshake,
  Layers,
  Map,
  ShieldCheck,
  Target,
  Users,
  UserSquare2,
  Briefcase,
  BookOpen,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROLE_ENTRY_POINTS } from '@/components/navigation/NavLinks';
import type { UserRole } from '@/types/roles';
import type { BadgeVariant } from '@/types/common';

/* ─────────────────────────────────────────────────────────────
   Static content registries. Presentation-only — no scoring,
   metrics, or inference lives here.
───────────────────────────────────────────────────────────── */
const FLOW_STEPS = [
  { label: 'Profiling', sub: '20 questions' },
  { label: 'Assessment', sub: 'Tech + soft skills' },
  { label: 'Passport', sub: 'Verified tiers' },
  { label: 'Opportunity', sub: 'Feedback loop' },
];

const TRUST_ROW = [
  { icon: <Users className="h-4 w-4" aria-hidden="true" />, label: '4 stakeholders, one shared view' },
  { icon: <Layers className="h-4 w-4" aria-hidden="true" />, label: '7 connected modules' },
  { icon: <BadgeCheck className="h-4 w-4" aria-hidden="true" />, label: '5 verification tiers' },
];

const MODULES: { title: string; description: string; icon: React.ReactNode; href: string }[] = [
  {
    title: '20-Question Career Profiling',
    description: 'A structured diagnostic that captures interests, working style, and aspirations to seed a personal profile.',
    icon: <UserSquare2 className="h-5 w-5" aria-hidden="true" />,
    href: '/assessment',
  },
  {
    title: 'Technical & Soft Skill Assessments',
    description: 'Role-aligned evaluations covering programming, tooling, communication, and problem-solving.',
    icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />,
    href: '/assessment',
  },
  {
    title: 'Skill Gap Analysis',
    description: 'Compares current competencies against target roles and highlights the highest-impact gaps.',
    icon: <Target className="h-5 w-5" aria-hidden="true" />,
    href: '/career',
  },
  {
    title: 'Personalized Action Roadmaps',
    description: 'Sequenced learning and project milestones that turn gaps into a concrete, time-boxed plan.',
    icon: <Map className="h-5 w-5" aria-hidden="true" />,
    href: '/career',
  },
  {
    title: 'Project & Evidence Hub',
    description: 'Attach GitHub repositories, live demos, and certificates as proof behind each claimed skill.',
    icon: <FolderGit2 className="h-5 w-5" aria-hidden="true" />,
    href: '/profile',
  },
  {
    title: 'Verified Skill Passport',
    description: 'A portable record where every skill carries a verification tier, from Self-Declared to Industry-Verified.',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    href: '/skills',
  },
];

const LOOP_MODULE = {
  title: 'Opportunities & Feedback Loops',
  description:
    'Internships, jobs, and industry projects matched to the passport — with evaluator feedback routed back to the student and their faculty, closing the loop between classroom and workplace.',
  icon: <Handshake className="h-5 w-5" aria-hidden="true" />,
  href: '/opportunities',
};

const HOW_IT_WORKS: { title: string; description: string; icon: React.ReactNode; href: string }[] = [
  {
    title: 'Profile & Assess',
    description: 'Complete the 20-question profile, then take technical and soft skill assessments aligned to your goals.',
    icon: <ClipboardList className="h-5 w-5" aria-hidden="true" />,
    href: '/assessment',
  },
  {
    title: 'Analyse the Gap',
    description: 'See exactly where you stand against target roles and receive a sequenced action roadmap.',
    icon: <Compass className="h-5 w-5" aria-hidden="true" />,
    href: '/career',
  },
  {
    title: 'Prove It',
    description: 'Attach projects, demos, and certificates. Faculty and industry endorsements raise each skill’s tier.',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden="true" />,
    href: '/skills',
  },
  {
    title: 'Get Matched',
    description: 'Apply to opportunities with a verified passport and receive direct evaluator feedback.',
    icon: <Briefcase className="h-5 w-5" aria-hidden="true" />,
    href: '/opportunities',
  },
];

const STAKEHOLDER_DETAILS: Record<
  UserRole,
  { description: string; icon: React.ReactNode; accent: string }
> = {
  student: {
    description:
      'Discover where your degree stops and industry expectations begin. Assess, close gaps, and carry a Verified Skill Passport into every application.',
    icon: <GraduationCap className="h-6 w-6" aria-hidden="true" />,
    accent: 'from-indigo-500 to-indigo-400',
  },
  faculty: {
    description:
      'See how course outcomes map to real competencies, verify student project work, and shape curricula with live industry signal.',
    icon: <BookOpen className="h-6 w-6" aria-hidden="true" />,
    accent: 'from-teal-500 to-teal-400',
  },
  institution: {
    description:
      'Track cohort-level skill readiness, benchmark programmes against industry demand, and evidence outcomes for accreditation.',
    icon: <Building2 className="h-6 w-6" aria-hidden="true" />,
    accent: 'from-purple-500 to-purple-400',
  },
  industry: {
    description:
      'Source candidates by verified competencies rather than keywords, post real projects, and feed evaluation results back into academia.',
    icon: <Briefcase className="h-6 w-6" aria-hidden="true" />,
    accent: 'from-orange-500 to-orange-400',
  },
};

const VERIFICATION_TIERS: { label: string; variant: BadgeVariant; dot: string; description: string }[] = [
  { label: 'Self-Declared', variant: 'self-declared', dot: 'bg-slate-400', description: 'Claimed by the student on their profile. Every skill starts here.' },
  { label: 'Assessed', variant: 'assessed', dot: 'bg-blue-400', description: 'Confirmed through a technical or soft skill assessment.' },
  { label: 'Project-Verified', variant: 'project-verified', dot: 'bg-violet-400', description: 'Backed by evidence in the Project Hub — repositories, demos, or certificates.' },
  { label: 'Faculty-Verified', variant: 'faculty-verified', dot: 'bg-amber-400', description: 'Endorsed by an academician after reviewing coursework or project outcomes.' },
  { label: 'Industry-Verified', variant: 'industry-verified', dot: 'bg-emerald-400', description: 'Confirmed by an industry evaluator through a real project or feedback loop.' },
];

const CONTACT_CHANNELS: { title: string; description: string; href: string; cta: string; icon: React.ReactNode }[] = [
  {
    title: 'Students & Faculty',
    description: 'Questions about profiling, assessments, evidence, or how verification tiers work.',
    href: '/#get-started',
    cta: 'Enter the workspace',
    icon: <GraduationCap className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Institutions',
    description: 'Programme-level readiness views, accreditation evidence, and departmental pilots.',
    href: '/dashboard',
    cta: 'View the dashboard',
    icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
  },
  {
    title: 'Industry Partners',
    description: 'Post real projects, source verified talent, and route feedback back into academia.',
    href: '/opportunities',
    cta: 'Explore opportunities',
    icon: <Handshake className="h-5 w-5" aria-hidden="true" />,
  },
];

/* ─────────────────────────────────────────────────────────────
   Section chrome. `scroll-mt-24` keeps anchored headings clear
   of the sticky header.
───────────────────────────────────────────────────────────── */
const SectionHeading: React.FC<{
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  light?: boolean;
}> = ({ id, eyebrow, title, description, light = false }) => (
  <div className="mx-auto mb-12 max-w-2xl text-center">
    <p className={`mb-3 text-xs font-semibold uppercase tracking-widest ${light ? 'text-indigo-300' : 'text-indigo-600'}`}>
      {eyebrow}
    </p>
    <h2
      id={id}
      className={`text-3xl font-bold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-slate-900'}`}
    >
      {title}
    </h2>
    <p className={`mt-4 text-lg leading-relaxed ${light ? 'text-slate-300' : 'text-slate-600'}`}>
      {description}
    </p>
  </div>
);

export default function HomePage() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    // Simulate an API call delay for the prototype
    setTimeout(() => setFormState('success'), 1200);
  };

  return (
    <div className="space-y-28 pb-8">
      {/* ── Hero ──────────────────────────────────────────── */}
      <section
        id="top"
        className="relative left-1/2 -mt-8 w-screen -translate-x-1/2 overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-sky-50 via-white to-slate-50"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-indigo-200/40 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-[28rem] w-[28rem] rounded-full bg-sky-200/50 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-28">
          {/* Copy */}
          <div className="lg:col-span-7">
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary" size="md" dot className="shadow-sm">
                Academia · Industry Skill Intelligence
              </Badge>
              <Badge variant="default" size="md" className="bg-white shadow-sm">
                Verified Skill Passport
              </Badge>
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Bridging Academic Learning with Industry Competencies.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              An AI-powered collaboration ecosystem connecting Students,
              Academicians, Industry, and Institutions under one verified skill
              and opportunity model.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/student">
                <Button
                  size="lg"
                  className="rounded-full px-7 shadow-lg shadow-indigo-600/25"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Join as Student
                </Button>
              </Link>
              <Link href="/opportunities">
                <Button
                  size="lg"
                  variant="ghost"
                  className="rounded-full border border-slate-200 bg-white px-7 hover:bg-slate-50"
                >
                  Hire Talent / Partner
                </Button>
              </Link>
            </div>

            <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-500">
              {TRUST_ROW.map((item) => (
                <li key={item.label} className="inline-flex items-center gap-2">
                  <span className="text-indigo-500">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Flow card */}
          <div className="lg:col-span-5">
            <Card
              padding="lg"
              shadow="lg"
              className="border-white/60 bg-white/90 shadow-indigo-100/70 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-slate-600">
                  SkillBridge Flow
                </span>
                <Badge variant="success" size="sm" dot>
                  Shell preview
                </Badge>
              </div>

              <ol className="mt-8 grid grid-cols-4 gap-2">
                {FLOW_STEPS.map((step, i) => (
                  <li key={step.label} className="relative flex flex-col items-center text-center">
                    {i < FLOW_STEPS.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-4 h-px w-full bg-gradient-to-r from-slate-200 to-slate-200"
                      />
                    )}
                    <span
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        i === 0
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'border border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="mt-3 text-xs font-semibold text-slate-900">
                      {step.label}
                    </span>
                    <span className="mt-0.5 text-[11px] text-slate-500">
                      {step.sub}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Skill Passport
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {VERIFICATION_TIERS.map((t) => (
                      <Badge key={t.label} variant={t.variant} size="xs" dot>
                        {t.label}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    Feedback Loop
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-800">
                    <Badge variant="industry" size="xs">Industry</Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <Badge variant="student" size="xs">Student</Badge>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    <Badge variant="faculty" size="xs">Faculty</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">
                    Evaluator feedback flows straight back into the classroom.
                  </p>
                </div>
              </div>

              <p className="mt-6 border-t border-slate-200 pt-4 text-sm leading-relaxed text-slate-500">
                Cohort readiness views help institutions track learning outcomes
                across programmes.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Features / Modules ────────────────────────────── */}
      <section id="features" aria-labelledby="features-heading" className="scroll-mt-24">
        <SectionHeading
          id="features-heading"
          eyebrow="Features"
          title="From diagnosis to verified proof"
          description="Seven connected modules take a learner from a first profiling questionnaire to industry-verified credentials."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m, i) => (
            <Link key={m.title} href={m.href} className="group block h-full">
              <Card hoverable className="h-full">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    {m.icon}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    Module {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{m.description}</p>
              </Card>
            </Link>
          ))}

          <Link href={LOOP_MODULE.href} className="group block sm:col-span-2 lg:col-span-3">
            <Card hoverable className="bg-gradient-to-r from-indigo-50 via-white to-sky-50">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                    {LOOP_MODULE.icon}
                  </span>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                      Module 07 · Closing the loop
                    </span>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900">{LOOP_MODULE.title}</h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                      {LOOP_MODULE.description}
                    </p>
                  </div>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600">
                  Explore opportunities
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </div>
            </Card>
          </Link>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24">
        <SectionHeading
          id="how-heading"
          eyebrow="How it works"
          title="Four steps from transcript to verified talent"
          description="Each step feeds the next, so effort in one place compounds everywhere else."
        />
        <ol className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden="true"
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent lg:block"
          />
          {HOW_IT_WORKS.map((step, i) => (
            <li key={step.title} className="relative">
              <Link href={step.href} className="group block h-full">
                <Card hoverable className="h-full pt-8">
                  <span className="absolute -top-0 left-6 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-2xl border-4 border-slate-50 bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/30">
                    {i + 1}
                  </span>
                  <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    {step.icon}
                  </span>
                  <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{step.description}</p>
                </Card>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Stakeholders ──────────────────────────────────── */}
      <section id="stakeholders" aria-labelledby="stakeholders-heading" className="scroll-mt-24">
        <SectionHeading
          id="stakeholders-heading"
          eyebrow="Stakeholders"
          title="Built for every side of the bridge"
          description="Four stakeholders, one shared view of skill readiness."
        />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {ROLE_ENTRY_POINTS.map((entry) => {
            const detail = STAKEHOLDER_DETAILS[entry.role];
            return (
              <Link key={entry.role} href={entry.href} className="group block h-full">
                <Card hoverable padding="none" className="relative flex h-full flex-col overflow-hidden">
                  <span
                    aria-hidden="true"
                    className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${detail.accent}`}
                  />
                  <div className="flex flex-1 flex-col p-6 pt-7">
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                        {detail.icon}
                      </span>
                      <Badge variant={entry.role} size="xs" dot>
                        {entry.label.split(' ')[0]}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">{entry.label}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {detail.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-indigo-600">
                      Continue as {entry.label.split(' ')[0]}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Verification ladder ───────────────────────────── */}
      <section
        id="verification"
        aria-labelledby="tiers-heading"
        className="relative isolate scroll-mt-24 overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-white sm:px-12 lg:py-20"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 -z-10 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl"
        />

        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-300">
              Verified Skill Passport
            </p>
            <h2 id="tiers-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
              Every skill carries its proof
            </h2>
            <p className="mt-4 leading-relaxed text-slate-300">
              A skill in the passport is never just a word on a résumé. It
              climbs five verification tiers as evidence accumulates, so a
              recruiter can see exactly how much trust each claim has earned.
            </p>
            <Link href="/skills" className="mt-8 inline-block">
              <Button
                variant="secondary"
                className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/20"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Open Skill Passport
              </Button>
            </Link>
          </div>

          <ol className="relative space-y-5 lg:col-span-3">
            <span
              aria-hidden="true"
              className="absolute bottom-5 left-[15px] top-5 w-px bg-gradient-to-b from-slate-600 via-indigo-400/60 to-emerald-400/60"
            />
            {VERIFICATION_TIERS.map((tier, i) => (
              <li key={tier.label} className="relative flex items-start gap-5">
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-xs font-bold text-slate-200 shadow-md">
                  <span aria-hidden="true" className={`absolute inset-0 rounded-full ${tier.dot} opacity-20`} />
                  {i + 1}
                </span>
                <div className="flex-1 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors hover:bg-white/10">
                  <div className="flex items-center gap-3">
                    <span className={`h-2 w-2 rounded-full ${tier.dot}`} aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-white">{tier.label}</h3>
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{tier.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Get started ───────────────────────────────────── */}
      <section
        id="get-started"
        aria-labelledby="start-heading"
        className="scroll-mt-24 rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-6 py-14 sm:px-12"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Get started
          </p>
          <h2 id="start-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose your role to enter the workspace
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Sign-in and registration arrive with the authentication layer. For
            now, pick a role to preview its workspace.
          </p>
        </div>
        <div className="mx-auto mt-10 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ROLE_ENTRY_POINTS.map((entry) => (
            <Link key={entry.role} href={entry.href} className="group block">
              <Card hoverable className="flex h-full flex-col items-center text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  {entry.icon}
                </span>
                <span className="mt-4 text-sm font-semibold text-slate-900">{entry.label}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Continue
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────── */}
      <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-24">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Contact us
            </p>
            <h2 id="contact-heading" className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Talk to the SkillBridge team
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Whether you are a student, an academician, an institution, or an
              industry partner, there is a direct path into the platform. Pick
              the channel that fits and we will route you to the right place.
            </p>

            {formState === 'success' ? (
              <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center text-emerald-800 shadow-sm">
                <CheckCircle2 className="mb-3 h-8 w-8 text-emerald-500" />
                <p className="font-semibold text-lg">Message sent!</p>
                <p className="mt-1 text-sm text-emerald-600">Our team will get back to you shortly.</p>
                <button 
                  type="button" 
                  onClick={() => setFormState('idle')} 
                  className="mt-5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 underline underline-offset-2 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
                    <input 
                      id="name"
                      required 
                      type="text" 
                      placeholder="Your name"
                      disabled={formState === 'submitting'}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                    <input 
                      id="email"
                      required 
                      type="email" 
                      placeholder="you@example.com"
                      disabled={formState === 'submitting'}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-slate-700">How can we help?</label>
                    <textarea 
                      id="message"
                      required 
                      rows={3} 
                      placeholder="Tell us about your needs..."
                      disabled={formState === 'submitting'}
                      className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={formState === 'submitting'} 
                    className="w-full rounded-xl bg-indigo-600 py-2.5 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700" 
                  >
                    {formState === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <Send className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>

          <div className="grid gap-4 lg:col-span-3">
            {CONTACT_CHANNELS.map((channel) => (
              <Link key={channel.title} href={channel.href} className="group block h-full">
                <Card hoverable className="flex h-full flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                    {channel.icon}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-slate-900">{channel.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{channel.description}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600">
                    {channel.cta}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}