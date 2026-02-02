import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StepCard({ step, title, description, icon, className }: StepCardProps) {
  return (
    <GlassCard className={cn('h-full', className)}>
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl border border-goc-primary/30 bg-goc-primary/15 text-goc-primary flex items-center justify-center font-semibold">
            {icon || step}
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-goc-muted">Step {step}</p>
            <h4 className="text-base font-semibold text-goc-ink">{title}</h4>
          </div>
        </div>
        <p className="text-sm text-goc-muted">{description}</p>
      </div>
    </GlassCard>
  );
}
