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
    success: 'text-green-700 border border-green-200 bg-green-50',
    info: 'text-blue-700 border border-blue-200 bg-blue-50',
    warning: 'text-amber-700 border border-amber-200 bg-amber-50',
    error: 'text-red-700 border border-red-200 bg-red-50',
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
