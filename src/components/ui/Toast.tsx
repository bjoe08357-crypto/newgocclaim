import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100',
  error: 'border-rose-500/40 bg-rose-500/15 text-rose-100',
  info: 'border-blue-500/40 bg-blue-500/15 text-blue-100',
};

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[60] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'min-w-[260px] max-w-[320px] rounded-2xl border px-4 py-3 shadow-goc backdrop-blur-xl',
              variantStyles[toast.variant || 'info']
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.message && <p className="text-xs text-goc-muted mt-1">{toast.message}</p>}
              </div>
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-xs text-goc-muted hover:text-goc-ink transition-colors"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
