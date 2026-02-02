import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-goc-border bg-goc-surface/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-goc-muted',
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-goc-primary"></span>
      {children}
    </span>
  );
}
