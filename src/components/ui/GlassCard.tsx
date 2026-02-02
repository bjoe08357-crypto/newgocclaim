import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
}

export function GlassCard({ children, className, innerClassName }: GlassCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl p-[1px] bg-gradient-to-r from-goc-primary/40 via-goc-secondary/30 to-goc-primary/40 shadow-goc',
        className
      )}
    >
      <div
        className={cn(
          'rounded-2xl bg-goc-surface/80 border border-goc-border/70 backdrop-blur-xl',
          innerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
