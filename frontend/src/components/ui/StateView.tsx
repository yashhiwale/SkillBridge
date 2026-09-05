'use client';

import { AlertCircle, CheckCircle2, Inbox, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import type { StateViewProps, UIState } from '@/types/common';

const DEFAULT_ICONS: Record<UIState, React.ReactNode> = {
  loading: <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />,
  empty: <Inbox className="h-6 w-6" aria-hidden="true" />,
  error: <AlertCircle className="h-6 w-6" aria-hidden="true" />,
  success: <CheckCircle2 className="h-6 w-6" aria-hidden="true" />,
};

const ICON_TONES: Record<UIState, string> = {
  loading: 'bg-indigo-50 text-indigo-600',
  empty: 'bg-slate-100 text-slate-500',
  error: 'bg-red-50 text-red-600',
  success: 'bg-emerald-50 text-emerald-600',
};

export function StateView({ state, title, description, action, icon }: StateViewProps) {
  const isLoading = state === 'loading';

  return (
    <div
      role={state === 'error' ? 'alert' : 'status'}
      aria-live={state === 'error' ? 'assertive' : 'polite'}
      aria-busy={isLoading}
      className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-12 text-center"
    >
      <span
        className={[
          'mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl',
          ICON_TONES[state],
        ].join(' ')}
      >
        {icon ?? DEFAULT_ICONS[state]}
      </span>

      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>

      {action && !isLoading && (
        <div className="mt-5">
          <Button
            variant={state === 'error' ? 'primary' : 'secondary'}
            size="sm"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

export default StateView;