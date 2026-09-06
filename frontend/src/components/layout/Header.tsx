// frontend/src/components/layout/Header.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronRight,
  LogIn,
  Menu,
  UserRound,
  X,
} from 'lucide-react';

import {
  LANDING_NAV_ITEMS,
  NAV_ITEMS,
  NavLinks,
  ROLE_ENTRY_POINTS,
  filterNavItems,
  groupNavItems,
  isActiveRoute,
} from '@/components/navigation/NavLinks';
import { useAuth } from '@/components/auth/AuthContext';
import { Badge } from '@/components/ui/Badge';
import type { HeaderProps } from '@/types/common';
import type { UserRole } from '@/types/roles';
import { ROLE_LABELS } from '@/types/roles';

/*
  Constants
*/
const ROLE_TONES: Record<UserRole, string> = {
  student: 'from-indigo-500 to-violet-600',
  faculty: 'from-emerald-500 to-teal-600',
  institution: 'from-amber-500 to-orange-600',
  industry: 'from-sky-500 to-blue-600',
};

const LOGIN_HREF = '/auth/login';
const REGISTER_HREF = '/auth/register';

const BRAND_LOGO_SRC = '/brand/skillbridge-logo.jpg';

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';

const hashOf = (href: string): string | null =>
  href.includes('#') ? href.slice(href.indexOf('#') + 1) : null;

/*
  Brand
*/
function Brand({ compactTagline = false }: { compactTagline?: boolean }) {
  return (
    <Link
      href="/"
      aria-label="SkillBridge home"
      className={`group flex items-center gap-2.5 rounded-xl ${FOCUS_RING}`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-md shadow-indigo-500/25 transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105">
        <Image
          src={BRAND_LOGO_SRC}
          alt=""
          width={40}
          height={40}
          priority
          className="h-full w-full object-cover"
        />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight text-slate-900">
          SkillBridge
        </span>
        <span
          className={[
            'text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500',
            compactTagline ? 'hidden xl:block' : '',
          ].join(' ')}
        >
          Academia · Industry
        </span>
      </span>
    </Link>
  );
}

/*
  Role menu (landing, desktop)
*/
function RoleMenu({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node))
        setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={[
          'inline-flex items-center gap-1.5 rounded-full border bg-white px-4 py-2 text-sm font-semibold shadow-sm transition-all duration-200',
          open
            ? 'border-indigo-200 text-indigo-700 ring-4 ring-indigo-500/10'
            : 'border-slate-200 text-slate-700 hover:border-indigo-200 hover:text-indigo-700',
          FOCUS_RING,
        ].join(' ')}
      >
        Select Role
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        role="menu"
        aria-label="Choose your role"
        className={[
          'absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xl shadow-slate-900/10 ring-1 ring-slate-900/5 transition-all duration-200',
          open
            ? 'visible translate-y-0 scale-100 opacity-100'
            : 'invisible -translate-y-1 scale-95 opacity-0',
        ].join(' ')}
      >
        <p className="px-3 pb-2 pt-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
          Enter SkillBridge as
        </p>
        <ul className="space-y-0.5">
          {ROLE_ENTRY_POINTS.map((entry) => (
            <li key={entry.role}>
              <Link
                role="menuitem"
                href={entry.href}
                onClick={() => setOpen(false)}
                className={`group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50 ${FOCUS_RING}`}
              >
                <span
                  className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${ROLE_TONES[entry.role]}`}
                >
                  {entry.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1 text-sm font-semibold text-slate-900">
                    {entry.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-3.5 w-3.5 text-slate-400 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100"
                    />
                  </span>
                  <span className="block text-xs leading-relaxed text-slate-500">
                    {entry.description}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-1 border-t border-slate-100 px-3 pb-1 pt-2.5 text-[11px] text-slate-400">
          Role selection is a preview — sign-in arrives with the auth task.
        </p>
      </div>
    </div>
  );
}

/*
  Header
*/
export function Header({ role = 'student', userName }: HeaderProps) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  const { user: authedUser, logout } = useAuth();
  
  const effectiveRole: UserRole = (authedUser?.role as UserRole) ?? role;
  const effectiveUserName = authedUser?.name ?? userName;
  const effectiveEmail = authedUser?.email;
  const isAuthenticated = !!authedUser;

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  /* Scroll-aware header + reset section highlight near the top */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 80) setActiveSection(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close drawer on route change */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /* Highlight the landing section currently in view */
  useEffect(() => {
    if (!isLanding) {
      setActiveSection(null);
      return;
    }
    const sections = LANDING_NAV_ITEMS.map((item) => hashOf(item.href))
      .filter((id): id is string => id !== null)
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-25% 0px -55% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isLanding]);

  /* Drawer: scroll lock, ESC, focus management */
  useEffect(() => {
    if (!drawerOpen) return;
    const trigger = menuButtonRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      trigger?.focus({ preventScroll: true });
    };
  }, [drawerOpen]);

  /* Smooth-scroll for hash links while on the landing page */
  const handleAnchorClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
      const id = hashOf(href);
      if (!id || !isLanding) return;
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
      setActiveSection(id);
      setDrawerOpen(false);
    },
    [isLanding],
  );

  const closeDrawer = () => setDrawerOpen(false);

  const appItems = filterNavItems(NAV_ITEMS, effectiveRole);
  const appGroups = groupNavItems(appItems);
  const orderedHrefs = appGroups.flatMap((group) =>
    group.items.map((item) => item.href),
  );
  const initial = effectiveUserName?.trim().charAt(0).toUpperCase() ?? '';

  return (
    <>
      <header
        className={[
          'sticky top-0 z-40 w-full border-b transition-all duration-300',
          scrolled
            ? 'border-slate-200/80 bg-white/85 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-xl'
            : 'border-transparent bg-white/60 backdrop-blur-md',
        ].join(' ')}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Brand compactTagline={isLanding} />

          {/* Desktop navigation */}
          {isLanding ? (
            <nav aria-label="Landing sections" className="hidden lg:block">
              <ul className="flex items-center gap-0.5 rounded-full border border-slate-200/70 bg-slate-50/80 p-1">
                {LANDING_NAV_ITEMS.map((item) => {
                  const id = hashOf(item.href);
                  const active = id !== null && id === activeSection;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={(event) =>
                          handleAnchorClick(event, item.href)
                        }
                        aria-current={active ? 'location' : undefined}
                        className={[
                          'group relative inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200 xl:px-4',
                          FOCUS_RING,
                          active
                            ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200/80'
                            : 'text-slate-600 hover:bg-white/70 hover:text-slate-900',
                        ].join(' ')}
                      >
                        {item.label}
                        {!active && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-3 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-indigo-600 transition-transform duration-300 group-hover:scale-x-100 xl:inset-x-4"
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ) : (
            <NavLinks role={effectiveRole} className="hidden xl:block" />
          )}

          {/* Right cluster */}
          <div className="flex items-center gap-2">
            {isLanding ? (
              <>
                <Link
                  href={LOGIN_HREF}
                  className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 xl:inline-flex ${FOCUS_RING}`}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  href={REGISTER_HREF}
                  className={`hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 md:inline-flex lg:hidden xl:inline-flex ${FOCUS_RING}`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <RoleMenu className="hidden lg:block" />
              </>
            ) : (
              <span className="hidden sm:block">
                <Badge variant={effectiveRole} size="sm" dot>
                  {ROLE_LABELS[effectiveRole]}
                </Badge>
              </span>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="site-drawer"
              onClick={() => setDrawerOpen(true)}
              className={[
                'inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-slate-900',
                FOCUS_RING,
                isLanding ? 'lg:hidden' : 'xl:hidden',
              ].join(' ')}
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in drawer */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          drawerOpen ? 'visible' : 'invisible'
        }`}
        aria-hidden={!drawerOpen}
      >
        <div
          onClick={closeDrawer}
          aria-hidden="true"
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <aside
          id="site-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={[
            'absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-out',
            drawerOpen ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        >
          {/* Drawer header */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-4">
            <Brand />
            <button
              ref={closeButtonRef}
              type="button"
              aria-label="Close menu"
              onClick={closeDrawer}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 ${FOCUS_RING}`}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Drawer body */}
          <div className="flex-1 overflow-y-auto px-4 py-5">
            {isLanding ? (
              <div className="space-y-7">
                <div>
                  <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Explore
                  </p>
                  <ul className="space-y-1">
                    {LANDING_NAV_ITEMS.map((item, index) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={(event) =>
                            handleAnchorClick(event, item.href)
                          }
                          style={{
                            transitionDelay: drawerOpen
                              ? `${60 + index * 30}ms`
                              : '0ms',
                          }}
                          className={[
                            'group flex items-center justify-between rounded-xl px-3 py-2.5 transition-all duration-300 hover:bg-slate-50',
                            FOCUS_RING,
                            drawerOpen
                              ? 'translate-x-0 opacity-100'
                              : 'translate-x-6 opacity-0',
                          ].join(' ')}
                        >
                          <span>
                            <span className="block text-sm font-semibold text-slate-900">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="block text-xs text-slate-500">
                                {item.description}
                              </span>
                            )}
                          </span>
                          <ChevronRight
                            aria-hidden="true"
                            className="h-4 w-4 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-slate-500"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                    Enter as
                  </p>
                  <ul className="space-y-1">
                    {ROLE_ENTRY_POINTS.map((entry, index) => (
                      <li key={entry.role}>
                        <Link
                          href={entry.href}
                          onClick={closeDrawer}
                          style={{
                            transitionDelay: drawerOpen
                              ? `${60 + (LANDING_NAV_ITEMS.length + index) * 30}ms`
                              : '0ms',
                          }}
                          className={[
                            'group flex items-start gap-3 rounded-xl border border-slate-200/80 px-3 py-3 transition-all duration-300 hover:border-indigo-200 hover:bg-indigo-50/40',
                            FOCUS_RING,
                            drawerOpen
                              ? 'translate-x-0 opacity-100'
                              : 'translate-x-6 opacity-0',
                          ].join(' ')}
                        >
                          <span
                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm ${ROLE_TONES[entry.role]}`}
                          >
                            {entry.icon}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-slate-900">
                              {entry.label}
                            </span>
                            <span className="block text-xs leading-relaxed text-slate-500">
                              {entry.description}
                            </span>
                          </span>
                          <ArrowUpRight
                            aria-hidden="true"
                            className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-600"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-7">
                {/* Identity card */}
                <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-bold text-white shadow-md shadow-indigo-500/25">
                      {initial ? (
                        initial
                      ) : (
                        <UserRound className="h-5 w-5" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {effectiveUserName ?? '—'}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {effectiveEmail
                          ? effectiveEmail
                          : isAuthenticated
                            ? 'Signed in'
                            : 'Guest preview'}
                      </p>
                    </div>
                    <Badge variant={effectiveRole} size="sm" dot>
                      {ROLE_LABELS[effectiveRole]}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          closeDrawer();
                        }}
                        className={[
                          'inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50',
                          FOCUS_RING,
                        ].join(' ')}
                      >
                        Logout
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href={LOGIN_HREF}
                          onClick={closeDrawer}
                          className={[
                            'inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50',
                            FOCUS_RING,
                          ].join(' ')}
                        >
                          <LogIn className="h-4 w-4" aria-hidden="true" />
                          Login
                        </Link>
                        <Link
                          href={REGISTER_HREF}
                          onClick={closeDrawer}
                          className={[
                            'inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30',
                            FOCUS_RING,
                          ].join(' ')}
                        >
                          Register
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Grouped navigation */}
                <nav aria-label="Primary navigation" className="space-y-6">
                  {appGroups.map((group) => (
                    <div key={group.title}>
                      <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                        {group.title}
                      </p>
                      <ul className="space-y-1">
                        {group.items.map((item) => {
                          const active = isActiveRoute(pathname, item.href);
                          const order = orderedHrefs.indexOf(item.href);
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={closeDrawer}
                                aria-current={active ? 'page' : undefined}
                                style={{
                                  transitionDelay: drawerOpen
                                    ? `${60 + order * 30}ms`
                                    : '0ms',
                                }}
                                className={[
                                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300',
                                  FOCUS_RING,
                                  drawerOpen
                                    ? 'translate-x-0 opacity-100'
                                    : 'translate-x-6 opacity-0',
                                  active
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-slate-700 hover:bg-slate-50',
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
                                  <span className="block text-sm font-semibold">
                                    {item.label}
                                  </span>
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
                    </div>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Drawer footer */}
          <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 py-4">
            {isLanding ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href={LOGIN_HREF}
                  onClick={closeDrawer}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${FOCUS_RING}`}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  href={REGISTER_HREF}
                  onClick={closeDrawer}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:shadow-lg hover:shadow-indigo-500/30 ${FOCUS_RING}`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <Link
                href="/"
                onClick={closeDrawer}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${FOCUS_RING}`}
              >
                Back to landing
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}

export default Header;