// frontend/src/types/common.ts

import type React from 'react';
import type { UserRole } from './roles';

/* ── User & Session ─────────────────────────────────────────── */
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  institutionId?: string;
  organisationId?: string;
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
}

/* ── API ────────────────────────────────────────────────────── */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: number;
}

export interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  cache?: RequestCache;
}

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}

/* ── Skill Passport ─────────────────────────────────────────── */
export type VerificationStatus =
  | 'self-declared'
  | 'assessed'
  | 'project-verified'
  | 'faculty-verified'
  | 'industry-verified';

/* ── UI State ───────────────────────────────────────────────── */
export type UIState = 'loading' | 'empty' | 'error' | 'success';

export interface StateViewProps {
  state: UIState;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  icon?: React.ReactNode;
  className?: string;
}

/* ── Navigation ─────────────────────────────────────────────── */
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
  /** Roles that will see this link once RBAC is wired. Not enforced yet. */
  roles?: UserRole[];
}

export interface NavLinksProps {
  items?: NavItem[];
  /** When provided, items whose `roles` exclude this role are hidden. */
  role?: UserRole;
  orientation?: 'horizontal' | 'vertical';
  onNavigate?: () => void;
  className?: string;
}

export interface RoleEntryPoint {
  role: UserRole;
  label: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

/* ── Layout ─────────────────────────────────────────────────── */
export interface HeaderProps {
  role?: UserRole;
  userName?: string;
}

export interface ShellProps {
  children: React.ReactNode;
  role?: UserRole;
  userName?: string;
}

/* ── Card ───────────────────────────────────────────────────── */
export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  bordered?: boolean;
  hoverable?: boolean;
  onClick?: () => void;
}

/* ── Button ─────────────────────────────────────────────────── */
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  ariaLabel?: string;
}

/* ── Badge ──────────────────────────────────────────────────── */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | VerificationStatus
  | UserRole;

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}