// frontend/src/app/dashboard/institution/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { Building2, BarChart3, TrendingUp, Users, ShieldAlert, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

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

export default function InstitutionDashboard() {
  const { user } = useAuth();
  const displayName = user?.name || 'Administrator';

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8 flex items-center justify-between">
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