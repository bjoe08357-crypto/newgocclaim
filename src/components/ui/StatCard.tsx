import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <GlassCard className={cn('h-full', className)}>
      <div className="p-4 text-center space-y-1">
        <div className="text-xl font-semibold text-goc-ink">{value}</div>
        <div className="text-xs uppercase tracking-widest text-goc-muted">{label}</div>
      </div>
    </GlassCard>
  );
}
