// frontend/src/components/layout/Header.tsx

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
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
  filterNavItems,
  groupNavItems,
  isActiveRoute,
} from '@/components/navigation/NavLinks';
import { useAuth } from '@/components/auth/AuthContext';
import { Badge } from '@/components/ui/Badge';
import type { HeaderProps } from '@/types/common';
import type { UserRole } from '@/types/roles';
import { ROLE_LABELS } from '@/types/roles';

const LOGIN_HREF = '/auth/login';
const REGISTER_HREF = '/auth/register'; // Now acts as the multi-role selection registration page

const BRAND_LOGO_SRC = '/brand/skillbridge-logo.jpg';

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2';

const hashOf = (href: string): string | null =>
  href.includes('#') ? href.slice(href.indexOf('#') + 1) : null;

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

export function Header({ role = 'student', userName }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';

  const { user: authedUser, logout } = useAuth();
  
  const isAuthenticated = !!authedUser;
  const effectiveRole: UserRole = authedUser?.role ? (authedUser.role as UserRole) : (isAuthenticated ? role : ('guest' as any));
  const effectiveUserName = authedUser?.name ?? userName;
  const effectiveEmail = authedUser?.email;

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      if (window.scrollY < 80) setActiveSection(null);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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

  const handleLogout = () => {
    logout();
    closeDrawer();
    router.push('/');
  };

  const appItems = filterNavItems(NAV_ITEMS, isAuthenticated ? effectiveRole : undefined);
  const appGroups = groupNavItems(appItems);
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
            isAuthenticated && <NavLinks role={effectiveRole} className="hidden xl:block" />
          )}

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href={LOGIN_HREF}
                  className={`hidden items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 sm:inline-flex ${FOCUS_RING}`}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  Login
                </Link>
                <Link
                  href={REGISTER_HREF}
                  className={`hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/30 sm:inline-flex ${FOCUS_RING}`}
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </>
            ) : (
              <span className="hidden sm:block">
                <Badge variant={effectiveRole} size="sm" dot>
                  {ROLE_LABELS[effectiveRole]}
                </Badge>
              </span>
            )}

            {/* 3-Line Menu Button: ONLY shown when user is authenticated */}
            {isAuthenticated && (
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
                ].join(' ')}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Slide-in drawer (Only renders if authenticated) */}
      {isAuthenticated && (
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

            <div className="flex-1 overflow-y-auto px-4 py-5">
              <div className="space-y-7">
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
                        {effectiveEmail ?? 'Signed in'}
                      </p>
                    </div>
                    <Badge variant={effectiveRole} size="sm" dot>
                      {ROLE_LABELS[effectiveRole]}
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className={[
                        'inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50',
                        FOCUS_RING,
                      ].join(' ')}
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <nav aria-label="Primary navigation" className="space-y-6">
                  {appGroups.map((group) => {
                    const filteredGroupItems = group.items.filter((item) => {
                      if (!item.roles) return true;
                      return item.roles.includes(effectiveRole);
                    });

                    if (filteredGroupItems.length === 0) return null;

                    return (
                      <div key={group.title}>
                        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                          {group.title}
                        </p>
                        <ul className="space-y-1">
                          {filteredGroupItems.map((item) => {
                            const active = isActiveRoute(pathname, item.href);
                            return (
                              <li key={item.href}>
                                <Link
                                  href={item.href}
                                  onClick={closeDrawer}
                                  aria-current={active ? 'page' : undefined}
                                  className={[
                                    'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300',
                                    FOCUS_RING,
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
                    );
                  })}
                </nav>
              </div>
            </div>

            <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 px-4 py-4">
              <Link
                href="/"
                onClick={closeDrawer}
                className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 ${FOCUS_RING}`}
              >
                Back to landing
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export default Header;