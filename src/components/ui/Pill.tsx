import React from 'react';
import { cn } from '@/lib/utils';

interface PillProps {
  variant?: 'success' | 'info' | 'warning' | 'error' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  className?: string;
}

export function Pill({ variant = 'neutral', size = 'sm', children, className }: PillProps) {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variantClasses = {
    success: 'text-green-300 border border-green-500/40 bg-green-500/10',
    info: 'text-blue-300 border border-blue-500/40 bg-blue-500/10',
    warning: 'text-amber-300 border border-amber-500/40 bg-amber-500/10',
    error: 'text-rose-300 border border-rose-500/40 bg-rose-500/10',
    neutral: 'text-goc-muted border border-goc-border bg-goc-surface-alt',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
