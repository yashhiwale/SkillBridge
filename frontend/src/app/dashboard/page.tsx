// frontend/src/app/dashboard/page.tsx

'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import {
  Building2,
  Users,
  TrendingUp,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

/* ─────────────────────────────────────────────────────────────
   Mock Data for Institution/Faculty Dashboard
───────────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Total Students', value: '2,450', trend: '+12%', icon: <Users className="h-5 w-5" /> },
  { label: 'Avg. Employability', value: '68%', trend: '+5%', icon: <TrendingUp className="h-5 w-5" /> },
  { label: 'Verified Skills', value: '14,200', trend: '+800 this week', icon: <CheckCircle2 className="h-5 w-5" /> },
];

const DEPARTMENT_READINESS = [
  { dept: 'B.Sc IT', skills: [{ name: 'Python', score: 72 }, { name: 'SQL', score: 65 }, { name: 'Cloud', score: 38 }] },
  { dept: 'B.Tech CS', skills: [{ name: 'React', score: 85 }, { name: 'Node.js', score: 60 }, { name: 'DevOps', score: 42 }] },
];

const INDUSTRY_DEMAND = [
  { skill: 'Cloud Computing (AWS/Azure)', demand: 'HIGH', trend: 'up' },
  { skill: 'Data Analytics & Power BI', demand: 'HIGH', trend: 'up' },
  { skill: 'Cybersecurity', demand: 'HIGH', trend: 'up' },
  { skill: 'Basic Java', demand: 'MEDIUM', trend: 'down' },
];

const PENDING_VERIFICATIONS = [
  { id: 1, student: 'Rahul Sharma', skill: 'React.js', evidence: 'E-commerce Project Repo', date: '2 hours ago' },
  { id: 2, student: 'Priya Patel', skill: 'Python', evidence: 'Data Pipeline Script', date: '5 hours ago' },
  { id: 3, student: 'Amit Kumar', skill: 'System Design', evidence: 'Architecture Diagram PDF', date: '1 day ago' },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState(PENDING_VERIFICATIONS);

  const handleVerify = (id: number) => {
    setVerifications(verifications.filter(v => v.id !== id));
  };

  const displayName = user?.name || 'Admin';
  
  return (
    <div className="mx-auto max-w-6xl py-8">
      
      {/* ── Header ──────────────────────────────── */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Institution Dashboard</h1>
          </div>
          <p className="text-lg text-slate-600">
            Welcome back, <span className="font-semibold text-indigo-600">Prof. {displayName}</span>. Here is your cohort&apos;s skill intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="institution" size="md" dot>University View</Badge>
          <Badge variant="faculty" size="md" dot>Faculty View</Badge>
        </div>
      </div>

      {/* ── Top Stats ──────────────────────────────── */}
      <div className="mb-8 grid gap-5 sm:grid-cols-3">
        {STATS.map((stat, idx) => (
          <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {stat.icon}
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-slate-500">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm font-medium text-emerald-600">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        
        {/* ── Department Readiness ──────────────────────────────── */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-slate-700" />
              <h2 className="text-xl font-bold text-slate-900">Cohort Readiness</h2>
            </div>
          </div>

          <div className="space-y-6">
            {DEPARTMENT_READINESS.map((dept, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <h3 className="mb-4 font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" /> {dept.dept}
                </h3>
                <div className="space-y-4">
                  {dept.skills.map((skill, sIdx) => (
                    <div key={sIdx}>
                      <div className="mb-1 flex justify-between text-sm font-medium">
                        <span className="text-slate-700">{skill.name}</span>
                        <span className={skill.score < 50 ? 'text-rose-600' : 'text-emerald-600'}>{skill.score}% Ready</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div 
                          className={`h-full rounded-full ${skill.score < 50 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${skill.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* ── Industry Demand Alerts ──────────────────────────────── */}
          <div className="rounded-3xl border border-rose-100 bg-gradient-to-b from-rose-50 to-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-600" />
              <h2 className="text-xl font-bold text-slate-900">Industry Demand Alerts</h2>
            </div>
            <p className="mb-4 text-sm text-slate-600">Align curriculum with these real-time market shifts.</p>
            <div className="space-y-3">
              {INDUSTRY_DEMAND.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm border border-slate-100">
                  <span className="font-semibold text-slate-700">{item.skill}</span>
                  <Badge variant={item.demand === 'HIGH' ? 'success' : 'industry'} size="xs">
                    {item.demand} DEMAND
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* ── Faculty Verification Tasks ──────────────────────────────── */}
          <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Pending Verifications</h2>
              <Badge variant="faculty" size="sm">{verifications.length} Tasks</Badge>
            </div>
            
            {verifications.length === 0 ? (
              <div className="flex h-32 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-400">
                <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-400" />
                <p>All student evidence verified!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {verifications.map((task) => (
                  <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{task.student}</p>
                      <p className="text-xs text-slate-500">Requested Tier 4 for <span className="font-semibold text-indigo-600">{task.skill}</span></p>
                      <div className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Clock className="h-3 w-3" /> {task.date}
                        <span>•</span>
                        <a href="#" className="text-indigo-600 hover:underline">View: {task.evidence}</a>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleVerify(task.id)}
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700"
                    >
                      Verify Evidence <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}