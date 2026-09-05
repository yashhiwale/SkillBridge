// frontend/src/components/ui/Card.tsx

import React from 'react';
import { CardProps } from '@/types/common';

const paddingMap = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

const shadowMap = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm',
  bordered = true,
  hoverable = false,
  onClick,
}) => {
  const base =
    'bg-white rounded-2xl transition-all duration-200 ease-out';
  const border = bordered ? 'border border-slate-200/80' : '';
  const hover = hoverable
    ? 'hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/60 cursor-pointer'
    : '';
  const interactive = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${base} ${paddingMap[padding]} ${shadowMap[shadow]} ${border} ${hover} ${interactive} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => e.key === 'Enter' && onClick()
          : undefined
      }
    >
      {children}
    </div>
  );
};

export default Card;