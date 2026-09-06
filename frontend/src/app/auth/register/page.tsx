// frontend/src/app/auth/register/page.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, AlertCircle, GraduationCap, BookOpen, Building2, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import type { UserRole } from '@/types/roles';

const ROLE_META: Record<UserRole, { title: string; subtitle: string; description: string; icon: any; color: string; extraFieldLabel: string; extraPlaceholder: string }> = {
  student: {
    title: 'Student Portal',
    subtitle: 'Build your Verified Skill Passport',
    description: 'Assess skills, bridge career gaps, and get matched with top opportunities.',
    icon: <GraduationCap className="h-6 w-6 text-indigo-600" />,
    color: 'border-indigo-200 hover:border-indigo-500 bg-indigo-50/30',
    extraFieldLabel: 'Degree & Major (e.g. B.Tech Computer Science)',
    extraPlaceholder: 'e.g. B.Sc IT / B.Tech CSE',
  },
  faculty: {
    title: 'Faculty / Academician Portal',
    subtitle: 'Verify Student Evidence & Mentor',
    description: 'Map curriculum outcomes, monitor progress, and validate student project work.',
    icon: <BookOpen className="h-6 w-6 text-emerald-600" />,
    color: 'border-emerald-200 hover:border-emerald-500 bg-emerald-50/30',
    extraFieldLabel: 'Department Name',
    extraPlaceholder: 'e.g. Department of Computer Science',
  },
  institution: {
    title: 'Institution Portal',
    subtitle: 'Institutional Analytics & Readiness',
    description: 'Track cohort-level skill gaps, placement trends, and program outcomes.',
    icon: <Building2 className="h-6 w-6 text-amber-600" />,
    color: 'border-amber-200 hover:border-amber-500 bg-amber-50/30',
    extraFieldLabel: 'University / Institution Name',
    extraPlaceholder: 'e.g. Pune Institute of Technology',
  },
  industry: {
    title: 'Industry / Recruiter Portal',
    subtitle: 'Source Verified Talent',
    description: 'Post live projects, hire verified candidates, and close the academia feedback loop.',
    icon: <Briefcase className="h-6 w-6 text-sky-600" />,
    color: 'border-sky-200 hover:border-sky-500 bg-sky-50/30',
    extraFieldLabel: 'Company / Organization Name',
    extraPlaceholder: 'e.g. TechNova Solutions',
  },
};

function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [extraDetail, setExtraDetail] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['student', 'faculty', 'institution', 'industry'].includes(roleParam)) {
      setRole(roleParam as UserRole);
    }
  }, [searchParams]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!role) {
      setError('Please select a role first');
      return;
    }
    if (!name.trim() || !email.trim() || !extraDetail.trim()) {
      setError('All fields are required');
    }
    
    register({ name, email, role: role as any });
    
    if (role === 'industry') {
      router.push('/employer');
    } else if (role === 'faculty' || role === 'institution') {
      router.push('/dashboard');
    } else {
      router.push('/student');
    }
  };

  // If no role is selected yet, show the magnificent 4-Role Selector Cards page!
  if (!role) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Choose Your SkillBridge Portal
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Select your stakeholder category to begin your registration journey.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {(Object.keys(ROLE_META) as UserRole[]).map((r) => {
            const meta = ROLE_META[r];
            return (
              <div
                key={r}
                onClick={() => setRole(r)}
                className={`group relative flex cursor-pointer flex-col justify-between rounded-3xl border-2 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${meta.color}`}
              >
                <div>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                    {meta.icon}
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">{meta.title}</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    {meta.subtitle}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {meta.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-indigo-600">
                  Register as {r.charAt(0).toUpperCase() + r.slice(1)} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    );
  }

  // Once a role is clicked, render the targeted Registration Form
  const currentMeta = ROLE_META[role];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5">
        <div className="mb-6 flex items-center justify-between">
          <button 
            type="button" 
            onClick={() => setRole(null)} 
            className="text-xs font-semibold text-indigo-600 hover:underline"
          >
            ← Back to Role Selection
          </button>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            {role.toUpperCase()}
          </span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{currentMeta.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{currentMeta.subtitle}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="extra" className="mb-1.5 block text-sm font-semibold text-slate-700">
              {currentMeta.extraFieldLabel}
            </label>
            <input
              type="text"
              id="extra"
              value={extraDetail}
              onChange={(e) => setExtraDetail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder={currentMeta.extraPlaceholder}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 active:scale-[0.98]"
          >
            <UserPlus className="h-4 w-4" />
            Complete Registration
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading registration hub...</div>}>
      <RegisterForm />
    </Suspense>
  );
}