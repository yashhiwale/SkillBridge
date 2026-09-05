// frontend/src/components/ui/Badge.tsx

import React from 'react';
import type { BadgeProps, BadgeVariant } from '@/types/common';

const variantMap: Record<BadgeVariant, string> = {
  // General purpose
  default: 'bg-slate-100 text-slate-700 border border-slate-200',
  primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  danger: 'bg-red-100 text-red-700 border border-red-200',
  info: 'bg-sky-100 text-sky-700 border border-sky-200',

  // Skill Passport verification statuses
  'self-declared': 'bg-slate-100 text-slate-600 border border-slate-300',
  assessed: 'bg-blue-100 text-blue-700 border border-blue-200',
  'project-verified': 'bg-violet-100 text-violet-700 border border-violet-200',
  'faculty-verified': 'bg-amber-100 text-amber-700 border border-amber-200',
  'industry-verified': 'bg-emerald-100 text-emerald-700 border border-emerald-200',

  // Role badges
  student: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  faculty: 'bg-teal-100 text-teal-700 border border-teal-200',
  institution: 'bg-purple-100 text-purple-700 border border-purple-200',
  industry: 'bg-orange-100 text-orange-700 border border-orange-200',
};

const dotColorMap: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  primary: 'bg-indigo-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  'self-declared': 'bg-slate-400',
  assessed: 'bg-blue-500',
  'project-verified': 'bg-violet-500',
  'faculty-verified': 'bg-amber-500',
  'industry-verified': 'bg-emerald-500',
  student: 'bg-indigo-500',
  faculty: 'bg-teal-500',
  institution: 'bg-purple-500',
  industry: 'bg-orange-500',
};

const sizeMap = {
  xs: 'px-1.5 py-0.5 text-xs rounded',
  sm: 'px-2 py-0.5 text-xs rounded-md',
  md: 'px-2.5 py-1 text-sm rounded-md',
  lg: 'px-3 py-1 text-sm rounded-lg',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium ${variantMap[variant]} ${sizeMap[size]} ${className}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${dotColorMap[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};

export default Badge;