'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface FooterProps {
  variant?: 'home' | 'minimal';
}

export function Footer({ variant = 'home' }: FooterProps) {
  const t = useTranslations('navigation');
  
  if (variant === 'minimal') {
    return (
      <footer className="py-8 border-t border-goc-border bg-goc-surface-alt relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
                <Image
                  src="/goc-logo.svg"
                  alt="GOC Logo"
                  width={24}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </Link>
              <span className="text-goc-muted text-sm">© 2026 by GOC</span>
            </div>
            <div className="flex space-x-6 text-sm text-goc-muted">
              <Link href="/" className="hover:text-goc-ink transition-colors">{t('home')}</Link>
              <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-goc-ink transition-colors">
                Etherscan
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-16 border-t border-goc-border bg-goc-surface-alt relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/goc-logo.svg"
                alt="GOC Logo"
                width={32}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-goc-muted text-sm leading-relaxed max-w-sm">
              The secure, gas-free way to claim your GOC tokens. Built on Ethereum for maximum security and transparency.
            </p>
          </div>
          
          <div>
            <h4 className="text-goc-ink font-semibold mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-goc-muted">
              <li><Link href="/claim" className="hover:text-goc-primary transition-colors">Claim Tokens</Link></li>
              {/* @ts-expect-error - Hash links are valid but types are strict */}
              <li><Link href="/#how-it-works" className="hover:text-goc-primary transition-colors">How it Works</Link></li>
              {/* @ts-expect-error - Hash links are valid but types are strict */}
              <li><Link href="/#faq" className="hover:text-goc-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-goc-ink font-semibold mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-goc-muted">
              <li><a href="https://etherscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-goc-primary transition-colors">Etherscan</a></li>
              <li><a href="#" className="hover:text-goc-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-goc-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-goc-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-goc-muted">
            © 2026 by GOC. All rights reserved.
          </div>
          <div className="flex space-x-6">
            {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
