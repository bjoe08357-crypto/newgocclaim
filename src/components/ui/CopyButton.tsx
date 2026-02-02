import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'text-xs font-medium text-goc-primary hover:text-goc-ink transition-colors',
        className
      )}
      aria-label={`Copy ${label}`}
      type="button"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
