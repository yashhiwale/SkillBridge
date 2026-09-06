// frontend/src/components/layout/Shell.tsx

import React from 'react';
import { Header } from './Header';
import type { ShellProps } from '@/types/common';

export const Shell: React.FC<ShellProps> = ({
  children,
  role = 'student',
  userName,
}) => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header role={role} userName={userName} />

      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
      >
        {children}
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} SkillBridge — AI-powered Academia-Industry
            Skill Intelligence Platform
          </p>
          <p className="text-slate-400">
            Verified Skill Passport · Gap Analysis · Action Roadmaps
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Shell;