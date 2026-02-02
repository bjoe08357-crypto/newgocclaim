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
    success: 'text-black',
    info: 'text-blue-300',
    warning: 'text-yellow-300',
    error: 'text-red-400',
    neutral: 'text-gray-300',
  };

  const variantStyles = {
    success: { background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
    info: { backgroundColor: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)' },
    warning: { backgroundColor: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.3)' },
    error: { backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' },
    neutral: { backgroundColor: 'rgba(107, 114, 128, 0.2)', border: '1px solid rgba(107, 114, 128, 0.3)' },
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
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
