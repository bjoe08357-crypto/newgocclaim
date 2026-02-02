import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

interface TokenStatCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

export function TokenStatCard({
  title,
  description,
  icon,
  className,
  children,
}: TokenStatCardProps) {
  return (
    <GlassCard className={cn('h-full', className)}>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="h-10 w-10 rounded-xl bg-goc-primary/15 border border-goc-primary/30 text-goc-primary flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h4 className="text-base font-semibold text-goc-ink">{title}</h4>
            <p className="text-sm text-goc-muted">{description}</p>
          </div>
        </div>
        {children}
      </div>
    </GlassCard>
  );
}
