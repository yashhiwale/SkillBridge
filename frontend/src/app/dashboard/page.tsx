// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Building2,
  BookOpen,
  Users,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   1. MOCK DATA FOR INSTITUTION VIEW (Dean / University)
───────────────────────────────────────────────────────────── */
const DEPARTMENT_READINESS = [
  { dept: 'B.Sc IT / Computer Science', students: 450, avgReadiness: 74, topSkill: 'Python & React' },
  { dept: 'B.Tech Electronics', students: 320, avgReadiness: 61, topSkill: 'Embedded C' },
  { dept: 'Master of Computer Applications (MCA)', students: 210, avgReadiness: 82, topSkill: 'System Design & Cloud' },
];

const ACCREDITATION_METRICS = [
  { metric: 'Curriculum Industry Alignment', status: 'Moderate', score: '62%' },
  { metric: 'Live Project Integration', status: 'Good', score: '78%' },
  { metric: 'Internship Conversion Rate', status: 'High', score: '85%' },
];

/* ─────────────────────────────────────────────────────────────
   2. MOCK DATA FOR FACULTY VIEW (Educator / Mentor)
───────────────────────────────────────────────────────────── */
const PENDING_VERIFICATIONS = [
  { id: 1, student: 'Rahul Sharma', skill: 'React.js & Next.js', evidence: 'E-commerce Project Repo', date: '2 hours ago' },
  { id: 2, student: 'Priya Patel', skill: 'Python & Django', evidence: 'Data Pipeline Script', date: '5 hours ago' },
  { id: 3, student: 'Amit Kumar', skill: 'System Design', evidence: 'Architecture Diagram PDF', date: '1 day ago' },
];

export default function DashboardRouter() {
  const { user } = useAuth();
  
  // Faculty specific states
  const [verifications, setVerifications] = useState(PENDING_VERIFICATIONS);
  const handleVerify = (id: number) => {
    setVerifications(verifications.filter(v => v.id !== id));
  };

  const roleStr = (user?.role as string) || 'institution';
  const displayName = user?.name || 'User';

  // ── IF USER IS FACULTY / ACADEMICIAN ──
  if (roleStr === 'faculty') {
    return (
      <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-emerald-600" />
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty Mentorship Hub</h1>
            </div>
            <p className="text-slate-600">Welcome, Prof. {displayName}. Review and validate practical student skill evidence.</p>
          </div>
          <Badge variant="faculty" size="md" dot>Faculty Workspace</Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assigned Mentees</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">64 Students</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending Reviews</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{verifications.length} Tasks</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verified This Month</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">142 Evidence</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" /> Pending Evidence Verification Queue
            </h2>
            <span className="text-xs font-semibold text-slate-500">Tier 4 Validation</span>
          </div>

          {verifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-400">
              <CheckCircle2 className="mb-2 h-12 w-12 text-emerald-500" />
              <p className="font-semibold text-slate-700 text-lg">All student evidence successfully reviewed!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verifications.map((task) => (
                <div key={task.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{task.student}</h3>
                    <p className="text-xs text-slate-500">Requesting Tier 4 Validation for <span className="font-semibold text-emerald-700">{task.skill}</span></p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {task.date}</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Evidence: {task.evidence}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleVerify(task.id)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
                  >
                    Approve & Grant Tier 4 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── IF USER IS INSTITUTION / UNIVERSITY ──
  return (
    <div className="mx-auto max-w-5xl py-8 px-4 sm:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-amber-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institution Analytics Hub</h1>
          </div>
          <p className="text-slate-600">Cohort skill readiness and accreditation intelligence for {displayName}.</p>
        </div>
        <Badge variant="institution" size="md" dot>Institution View</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Total Enrolled Students</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">980 Active</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Overall Campus Readiness</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">72.3%</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Industry Placement Trend</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">+14% YoY</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 mb-8">
        <div className="lg:col-span-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-600" /> Department-wise Skill Readiness
          </h2>
          <div className="space-y-6">
            {DEPARTMENT_READINESS.map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-amber-600" /> {item.dept}
                  </h3>
                  <span className="text-sm font-bold text-emerald-600">{item.avgReadiness}% Ready</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Enrolled: {item.students} students • Strongest Skill: {item.topSkill}</p>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: `${item.avgReadiness}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-3xl border border-amber-100 bg-gradient-to-b from-amber-50/50 to-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" /> Accreditation Metrics
          </h2>
          <div className="space-y-4">
            {ACCREDITATION_METRICS.map((acc, idx) => (
              <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-500">{acc.metric}</p>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="font-bold text-slate-900">{acc.status}</span>
                  <span className="text-sm font-bold text-indigo-600">{acc.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}