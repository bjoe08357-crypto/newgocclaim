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
        'rounded-xl border backdrop-blur-sm transition-all duration-300 hover:shadow-2xl',
        className
      )}
      style={{
        backgroundColor: 'rgba(26, 26, 26, 0.8)',
        borderColor: 'rgba(64, 64, 64, 0.5)',
        boxShadow: '0 4px 14px 0 rgba(250, 204, 21, 0.15)',
        ...style
      }}
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
      className={cn('px-6 py-4 border-b', className)}
      style={{ borderColor: 'rgba(64, 64, 64, 0.5)' }}
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
      className={cn('px-6 py-4 border-t', className)}
      style={{ 
        borderColor: 'rgba(64, 64, 64, 0.5)',
        backgroundColor: 'rgba(18, 18, 18, 0.8)'
      }}
    >
      {children}
    </div>
  );
}
