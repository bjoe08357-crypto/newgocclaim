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
    <div 
      className="min-h-screen"
      style={{ 
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(250, 204, 21, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 50% 120%, rgba(234, 179, 8, 0.1) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #121212 100%)'
      }}
    >
      <Navigation variant="claim" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        <div className="mb-12 text-center">
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div
                className="absolute -inset-4 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)' }}
              ></div>
              <Image
                src="/goc-logo.svg"
                alt="GOC Logo"
                width={80}
                height={80}
                className="relative h-20 w-auto object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
          
          <h1 
            className="text-3xl font-bold mb-4 bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('title')}
          </h1>
          <p className="text-gray-300 text-lg mb-6">
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
              className="text-gray-400 border-gray-600 hover:border-yellow-400/50 hover:text-yellow-400 transition-all duration-300"
            >
              🔄 Start Over
            </Button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto space-y-6">
          <AddressInputCard />
          <WalletCard />
          <ClaimCard />
          <TokenInfoCard />
        </div>

        <div className="lg:hidden mt-8">
          <div className="text-center text-sm text-gray-400">
            Complete the steps to claim your tokens
          </div>
        </div>
      </main>

      {/* Help Section */}
      <section 
        className="border-t mt-16"
        style={{
          backgroundColor: 'rgba(26, 26, 26, 0.8)',
          borderColor: 'rgba(64, 64, 64, 0.5)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white mb-4">
              Need Help?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              If you encounter any issues during the claiming process, check our FAQ or contact support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a 
                href="/#faq" 
                className="inline-flex items-center px-4 py-2 border-2 rounded-xl text-sm font-medium text-yellow-400 bg-transparent hover:bg-yellow-400 hover:text-black transition-all duration-300"
                style={{ borderColor: 'rgba(250, 204, 21, 0.5)' }}
              >
                View FAQ
              </a>
              <a 
                href="mailto:support@goc.example" 
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-xl text-sm font-medium text-black transition-all duration-300 shadow-2xl hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 50%, #ca8a04 100%)',
                  boxShadow: '0 4px 14px 0 rgba(250, 204, 21, 0.2)'
                }}
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
