// frontend/src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Shell } from '@/components/layout/Shell';
import type { UserRole } from '@/types/roles';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'SkillBridge',
    template: '%s · SkillBridge',
  },
  description:
    'SkillBridge is an AI-powered Academia-Industry Skill Intelligence Platform that maps degree curricula to real-world competencies, surfaces skill gaps, and issues a Verified Skill Passport.',
  keywords: [
    'skill gap analysis',
    'skill passport',
    'career roadmap',
    'academia industry',
    'student assessment',
  ],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#4f46e5',
};

/*
  Session placeholder. Replaced by the auth/RBAC layer later;
  for now the shell renders a fixed default role.
*/
const PLACEHOLDER_SESSION: { role: UserRole; userName?: string } = {
  role: 'student',
  userName: undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <Shell
          role={PLACEHOLDER_SESSION.role}
          userName={PLACEHOLDER_SESSION.userName}
        >
          {children}
        </Shell>
      </body>
    </html>
  );
}