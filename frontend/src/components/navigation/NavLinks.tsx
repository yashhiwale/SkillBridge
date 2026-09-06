// frontend/src/components/navigation/NavLinks.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Briefcase,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Home,
  LayoutDashboard,
  ShieldCheck,
  UserCircle2,
  GraduationCap
} from 'lucide-react';

import type { NavItem, NavLinksProps, RoleEntryPoint } from '@/types/common';
import type { UserRole } from '@/types/roles';

/* ─────────────────────────────────────────────────────────────
   Authenticated app navigation. `roles` drives visibility once a
   role is known.
───────────────────────────────────────────────────────────── */
export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: <Home className="h-4 w-4" aria-hidden="true" />,
    description: 'SkillBridge overview',
    roles: ['student', 'faculty', 'institution', 'industry'],
  },
  // ── Faculty & Institution ──
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-4 w-4" aria-hidden="true" />,
    description: 'Institution & Faculty Analytics',
    roles: ['faculty', 'institution'], // Sirf in dono ko dikhega
  },
  // ── Industry / Employer ──
  {
    label: 'Employer Hub',
    href: '/employer',
    icon: <Building2 className="h-4 w-4" aria-hidden="true" />,
    description: 'Discover Verified Talent',
    roles: ['industry'], // Sirf Industry ko dikhega
  },
  // ── Student ──
  {
    label: 'Passport',
    href: '/skills',
    icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
    description: 'Verified Skill Passport',
    roles: ['student'], // Sirf Student ko
  },
  {
    label: 'Gap Analysis',
    href: '/career',
    icon: <Compass className="h-4 w-4" aria-hidden="true" />,
    description: 'AI Action Roadmaps',
    roles: ['student'], // Sirf Student ko
  },
  {
    label: 'Opportunities',
    href: '/opportunities',
    icon: <Briefcase className="h-4 w-4" aria-hidden="true" />,
    description: 'Jobs & Internships',
    roles: ['student'], // Sirf Student ko
  },
  {
    label: 'Assessment',
    href: '/assessment',
    icon: <ClipboardCheck className="h-4 w-4" aria-hidden="true" />,
    description: 'Career profiling and skill assessments',
    roles: ['student'], // Sirf Student ko
  },
  {
    label: 'Evidence Hub',
    href: '/profile',
    icon: <UserCircle2 className="h-4 w-4" aria-hidden="true" />,
    description: 'Projects and Credentials',
    roles: ['student'], // Sirf Student ko
  },
];

/* ─────────────────────────────────────────────────────────────
   Presentation-only grouping used by the app drawer.
───────────────────────────────────────────────────────────── */
export const NAV_GROUPS: ReadonlyArray<{ title: string; hrefs: string[] }> = [
  { title: 'Overview', hrefs: ['/', '/dashboard', '/employer'] },
  { title: 'My Journey', hrefs: ['/skills', '/career', '/assessment'] },
  { title: 'Connect & Evidence', hrefs: ['/opportunities', '/profile'] },
];

/* ─────────────────────────────────────────────────────────────
   Public landing navigation. Hash links scroll to sections on
   the home page.
───────────────────────────────────────────────────────────── */
export const LANDING_NAV_ITEMS: NavItem[] = [
  { label: 'Features', href: '/#features', description: 'Platform modules' },
  { label: 'How It Works', href: '/#how-it-works', description: 'The four-step flow' },
  { label: 'Stakeholders', href: '/#stakeholders', description: 'Who SkillBridge serves' },
  { label: 'Skill Passport', href: '/#verification', description: 'Verification tiers' },
  { label: 'Contact Us', href: '/#contact', description: 'Get in touch' },
];

/* ─────────────────────────────────────────────────────────────
   Role entry points. Clicking any role card or dropdown option
   NOW redirects to the Login/Register page per requirement.
───────────────────────────────────────────────────────────── */
export const ROLE_ENTRY_POINTS: RoleEntryPoint[] = [
  {
    role: 'student',
    label: 'Student',
    description: 'Profile, assess, and build a Verified Skill Passport.',
    href: '/auth/register?role=student', 
    icon: <GraduationCap className="h-5 w-5" aria-hidden="true" />,
  },
  {
    role: 'faculty',
    label: 'Academician / Faculty',
    description: 'Map outcomes to competencies and verify student work.',
    href: '/auth/register?role=faculty', 
    icon: <BookOpen className="h-5 w-5" aria-hidden="true" />,
  },
  {
    role: 'institution',
    label: 'Institution',
    description: 'Track cohort readiness and evidence programme outcomes.',
    href: '/auth/register?role=institution', 
    icon: <Building2 className="h-5 w-5" aria-hidden="true" />,
  },
  {
    role: 'industry',
    label: 'Industry / Recruiter',
    description: 'Post projects, source verified talent, close the loop.',
    href: '/auth/register?role=industry', 
    icon: <Briefcase className="h-5 w-5" aria-hidden="true" />,
  },
];

/* ─────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────── */
export const isActiveRoute = (pathname: string, href: string): boolean => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

/** Authenticated Menu Filter: Only shows items authorized for current user role */
export const filterNavItems = (items: NavItem[], role?: UserRole): NavItem[] =>
  role ? items.filter((item) => !item.roles || item.roles.includes(role)) : items;

/** Groups items by NAV_GROUPS order; anything unknown lands in "More". */
export const groupNavItems = (items: NavItem[]): Array<{ title: string; items: NavItem[] }> => {
  const grouped = NAV_GROUPS.map((group) => ({
    title: group.title,
    items: group.hrefs
      .map((href) => items.find((item) => item.href === href))
      .filter((item): item is NavItem => item !== undefined),
  })).filter((group) => group.items.length > 0);

  const known = new Set(NAV_GROUPS.flatMap((group) => group.hrefs));
  const rest = items.filter((item) => !known.has(item.href));

  return rest.length > 0 ? [...grouped, { title: 'More', items: rest }] : grouped;
};

/* ─────────────────────────────────────────────────────────────
   NavLinks Component
───────────────────────────────────────────────────────────── */
export function NavLinks({
  items = NAV_ITEMS,
  role,
  orientation = 'horizontal',
  onNavigate,
  className = '',
}: NavLinksProps) {
  const pathname = usePathname();
  // Ensure that UI respects the Role filtering securely
  const visibleItems = filterNavItems(items, role);

  if (orientation === 'vertical') {
    return (
      <nav aria-label="Primary navigation" className={className}>
        <ul className="flex flex-col gap-1">
          {visibleItems.map((item) => {
            const active = isActiveRoute(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-50',
                  ].join(' ')}
                >
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-2 left-0 w-1 rounded-full bg-indigo-600"
                    />
                  )}
                  <span
                    className={[
                      'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                      active
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 group-hover:ring-1 group-hover:ring-slate-200',
                    ].join(' ')}
                  >
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    {item.description && (
                      <span className="block truncate text-xs text-slate-500">
                        {item.description}
                      </span>
                    )}
                  </span>
                  <ChevronRight
                    aria-hidden="true"
                    className={[
                      'h-4 w-4 shrink-0 transition-transform duration-200',
                      active
                        ? 'text-indigo-500'
                        : 'text-slate-300 group-hover:translate-x-0.5 group-hover:text-slate-500',
                    ].join(' ')}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Primary navigation" className={className}>
      <ul className="flex items-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-50/80 p-1">
        {visibleItems.map((item) => {
          const active = isActiveRoute(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                title={item.description}
                aria-current={active ? 'page' : undefined}
                className={[
                  'group relative inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2',
                  active
                    ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/80'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900',
                ].join(' ')}
              >
                {item.label}
                {!active && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default NavLinks;