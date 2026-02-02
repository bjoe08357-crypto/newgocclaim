import React from 'react';
import { cn } from '@/lib/utils';

interface InfoRowProps {
  label: string;
  value: string;
  mono?: boolean;
  action?: React.ReactNode;
  className?: string;
}

export function InfoRow({ label, value, mono = false, action, className }: InfoRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-3', className)}>
      <div>
        <div className="text-xs uppercase tracking-wide text-goc-muted">{label}</div>
        <div className={cn('text-sm text-goc-ink', mono && 'font-mono text-xs')}>
          {value}
        </div>
      </div>
      {action}
    </div>
  );
}
