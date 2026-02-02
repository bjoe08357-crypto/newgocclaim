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
        <Link href="/" className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium text-sm">
          {t('home')}
        </Link>
        <Link href="/claim" className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium text-sm">
          {t('claim')}
        </Link>
        {/* @ts-expect-error - Hash links are valid but types are strict */}
        <Link href="/#how-it-works" className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium text-sm">
          How it works
        </Link>
        {/* @ts-expect-error - Hash links are valid but types are strict */}
        <Link href="/#about" className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium text-sm">
          {t('about')}
        </Link>
        {/* @ts-expect-error - Hash links are valid but types are strict */}
        <Link href="/#faq" className="px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-300 font-medium text-sm">
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
          className="px-6 py-2.5 rounded-xl font-semibold text-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
            boxShadow: '0 10px 25px 0 rgba(250, 204, 21, 0.3)'
          }}
        >
          Start Claiming
        </button>
      </Link>
    );
  };

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center group">
            <div className="flex-shrink-0 relative">
              <div className="absolute -inset-2 bg-yellow-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image
                src="/goc-logo.svg"
                alt="GOC Logo"
                width={40}
                height={40}
                className="h-10 w-auto object-contain relative z-10"
              />
            </div>
          </Link>
          
          <div className="flex items-center gap-6">
            {getNavLinks()}
            <div className="h-6 w-px bg-white/10 hidden md:block"></div>
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
