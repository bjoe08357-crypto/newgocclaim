import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ children, className, style }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-goc-border bg-goc-surface/90 shadow-goc-sm transition-all duration-300 hover:shadow-goc backdrop-blur-xl',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div 
      className={cn('px-6 py-4 border-b border-goc-border/80 bg-goc-surface-alt/40', className)}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-6 py-4', className)}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div 
      className={cn('px-6 py-4 border-t border-goc-border/80 bg-goc-surface-alt/50', className)}
    >
      {children}
    </div>
  );
}
