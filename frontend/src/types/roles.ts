// frontend/src/types/roles.ts

export type UserRole = 'student' | 'faculty' | 'institution' | 'industry';

export const USER_ROLES: readonly UserRole[] = [
  'student',
  'faculty',
  'institution',
  'industry',
] as const;

export const ROLE_LABELS: Record<UserRole, string> = {
  student: 'Student',
  faculty: 'Academician / Faculty',
  institution: 'Institution',
  industry: 'Industry / Recruiter',
};

export const isUserRole = (value: unknown): value is UserRole =>
  typeof value === 'string' && (USER_ROLES as readonly string[]).includes(value);