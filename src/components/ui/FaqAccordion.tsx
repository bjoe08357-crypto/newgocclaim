'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <GlassCard key={item.question}>
            <button
              className="w-full text-left px-5 py-4 flex items-center justify-between"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="text-sm font-semibold text-goc-ink">{item.question}</span>
              <span className="text-goc-muted text-xs">{isOpen ? '—' : '+'}</span>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="px-5 pb-4"
                >
                  <p className="text-sm text-goc-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        );
      })}
    </div>
  );
}
