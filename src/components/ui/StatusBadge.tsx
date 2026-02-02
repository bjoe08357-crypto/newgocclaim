import React from 'react';
import { cn } from '@/lib/utils';

type StatusType = 'eligible' | 'not-eligible' | 'claimed' | 'pending';

const statusStyles: Record<StatusType, string> = {
  eligible: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200',
  'not-eligible': 'border-slate-500/40 bg-slate-500/15 text-slate-300',
  claimed: 'border-goc-primary/50 bg-goc-primary/20 text-goc-primary',
  pending: 'border-amber-500/40 bg-amber-500/15 text-amber-200',
};

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        statusStyles[status],
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-80"></span>
      {label}
    </span>
  );
}
