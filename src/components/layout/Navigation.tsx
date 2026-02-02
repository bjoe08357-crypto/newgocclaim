'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useTranslations } from 'next-intl';

interface NavigationProps {
  variant?: 'home' | 'claim' | 'admin';
  showCTA?: boolean;
}

export function Navigation({ showCTA = true }: NavigationProps) {
  const t = useTranslations('navigation');
  
  const getNavLinks = () => {
    // All pages get the same navigation links
    return (
      <nav className="hidden md:flex items-center space-x-1">
        <Link href="/" className="px-3 py-2 rounded-lg text-goc-muted hover:text-goc-ink hover:bg-goc-surface-alt transition-all duration-200 font-medium text-sm">
          {t('home')}
        </Link>
        <Link href="/claim" className="px-3 py-2 rounded-lg text-goc-muted hover:text-goc-ink hover:bg-goc-surface-alt transition-all duration-200 font-medium text-sm">
          {t('claim')}
        </Link>
        {/* @ts-expect-error - Hash links are valid but types are strict */}
        <Link href="/#how-it-works" className="px-3 py-2 rounded-lg text-goc-muted hover:text-goc-ink hover:bg-goc-surface-alt transition-all duration-200 font-medium text-sm">
          How it works
        </Link>
        {/* @ts-expect-error - Hash links are valid but types are strict */}
        <Link href="/#faq" className="px-3 py-2 rounded-lg text-goc-muted hover:text-goc-ink hover:bg-goc-surface-alt transition-all duration-200 font-medium text-sm">
          {t('faq')}
        </Link>
      </nav>
    );
  };

  const getCTA = () => {
    if (!showCTA) return null;
    
    // All pages get the same CTA - the main claim button
    return (
      <Link href="/claim">
        <button 
          className="px-6 py-2.5 rounded-xl font-semibold text-white transition-all duration-200 shadow-goc hover:shadow-goc-lg bg-goc-primary hover:bg-indigo-500"
        >
          Start Claiming
        </button>
      </Link>
    );
  };



  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-goc-border/60 bg-[#0b1020]/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group">
            <Image
              src="/goc-logo.svg"
              alt="GOC Logo"
              width={40}
              height={40}
              className="h-10 w-10 object-contain"
            />
            <div className="ml-3">
              <div className="text-sm font-semibold text-goc-ink">GOC Claim Portal</div>
              <div className="text-[11px] text-goc-muted">Secure token distribution</div>
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            {getNavLinks()}
            <div className="h-6 w-px bg-goc-border hidden md:block"></div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {getCTA()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
