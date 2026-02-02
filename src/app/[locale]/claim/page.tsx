'use client';

import React from 'react';
import Image from 'next/image';
import { AddressInputCard } from '@/components/claim/AddressInputCard';
import { ClaimCard } from '@/components/claim/ClaimCard';
import { TokenInfoCard } from '@/components/claim/TokenInfoCard';
import { WalletCard } from '@/components/claim/WalletCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { useTranslations } from 'next-intl';
import { useClaim } from '@/hooks/useClaim';

export default function ClaimPage() {
  const t = useTranslations('claim');
  const { reset } = useClaim();
  return (
    <div className="min-h-screen bg-[#0b1020]">
      <Navigation variant="claim" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-28">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-goc-surface border border-goc-border shadow-goc-sm p-4">
              <Image
                src="/goc-logo.svg"
                alt="GOC Logo"
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-goc-ink mb-3">
            {t('title')}
          </h1>
          <p className="text-goc-muted text-lg mb-6">
            {t('description')}
          </p>
          
          <div className="flex justify-center">
            <Button
              onClick={() => {
                if (confirm('Are you sure you want to start over? This will clear all progress.')) {
                  reset();
                }
              }}
              variant="outline"
              size="sm"
              className="text-goc-muted hover:text-goc-primary"
            >
              Reset Progress
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr),minmax(0,1fr)] gap-8">
          <div className="space-y-6">
            <AddressInputCard />
            <ClaimCard />
          </div>
          <div className="space-y-6">
            <TokenInfoCard />
            <WalletCard />
          </div>
        </div>
      </main>

      {/* Help Section */}
      <section className="border-t border-goc-border bg-goc-surface-alt mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-goc-ink mb-4">
              Need Help?
            </h2>
            <p className="text-goc-muted mb-6 max-w-2xl mx-auto">
              If you encounter any issues during the claiming process, check our FAQ or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a 
                href="/#faq" 
                className="inline-flex items-center px-4 py-2 border border-goc-border rounded-xl text-sm font-medium text-goc-ink bg-goc-surface hover:border-goc-primary/40 hover:text-goc-primary transition-all duration-200"
              >
                View FAQ
              </a>
              <a 
                href="mailto:support@goc.example" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-white transition-all duration-200 shadow-goc bg-goc-primary hover:bg-indigo-500"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer variant="minimal" />
    </div>
  );
}
