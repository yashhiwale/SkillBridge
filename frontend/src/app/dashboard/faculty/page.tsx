// frontend/src/app/dashboard/faculty/page.tsx
'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { BookOpen, CheckCircle2, Clock, Users, ArrowRight, FileCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const PENDING_VERIFICATIONS = [
  { id: 1, student: 'Rahul Sharma', skill: 'React.js & Next.js', evidence: 'E-commerce Project Repo', date: '2 hours ago' },
  { id: 2, student: 'Priya Patel', skill: 'Python & Django', evidence: 'Data Pipeline Script', date: '5 hours ago' },
  { id: 3, student: 'Amit Kumar', skill: 'System Design', evidence: 'Architecture Diagram PDF', date: '1 day ago' },
];

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [verifications, setVerifications] = useState(PENDING_VERIFICATIONS);

  const handleVerify = (id: number) => {
    setVerifications(verifications.filter(v => v.id !== id));
  };

  const displayName = user?.name || 'Professor';

  return (
    <div className="mx-auto max-w-5xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-emerald-600" />
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Faculty Mentorship Portal</h1>
          </div>
          <p className="text-slate-600">Welcome, Prof. {displayName}. Review and verify practical student evidence.</p>
        </div>
        <Badge variant="faculty" size="md" dot>Faculty View</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Assigned Mentees</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">64 Students</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Pending Reviews</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{verifications.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Verified This Month</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">142</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-emerald-600" /> Pending Evidence Verifications
          </h2>
          <span className="text-xs font-semibold text-slate-500">Tier 4 Faculty Validation Queue</span>
        </div>

        {verifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
            <CheckCircle2 className="mb-2 h-10 w-10 text-emerald-500" />
            <p className="font-semibold text-slate-700">All student evidence successfully reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verifications.map((task) => (
              <div key={task.id} className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">{task.student}</h3>
                  <p className="text-xs text-slate-500">Requesting Tier 4 Validation for <span className="font-semibold text-emerald-700">{task.skill}</span></p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {task.date}</span>
                    <span>•</span>
                    <span className="text-indigo-600 font-medium hover:underline cursor-pointer">Evidence: {task.evidence}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleVerify(task.id)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-700"
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