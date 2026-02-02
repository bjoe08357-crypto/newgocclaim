import React from 'react';
import { Link } from '@/i18n/routing';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  
  return {
    title: t('home.title'),
    description: t('home.description'),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      images: ['/goc-logo.svg'],
    },
  };
}

export default function HomePage() {
  const t = useTranslations('home');
  return (
    <div className="min-h-screen bg-[#0b1020] text-goc-ink selection:bg-goc-primary/30">
      <Navigation variant="home" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 bg-goc-hero"></div>
        <div className="absolute -top-40 -left-32 w-[520px] h-[520px] rounded-full bg-goc-primary/15 blur-[140px]"></div>
        <div className="absolute -bottom-40 -right-24 w-[420px] h-[420px] rounded-full bg-goc-secondary/15 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_60%)]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-goc-surface border border-goc-border mb-8 shadow-goc-sm animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-goc-muted">Claims are now live</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-goc-ink animate-fade-in-up delay-100">
            Claim Your <br />
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 cursor-default bg-gradient-to-r from-goc-primary via-goc-secondary to-goc-primary bg-clip-text text-transparent">
              GOC Tokens
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-goc-muted mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t('hero.subtitle')}
            <br className="hidden md:block" />
            Secure, gas-free, and instant distribution directly to your wallet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
            <Link href="/claim" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-goc-primary to-goc-secondary rounded-2xl blur opacity-40 group-hover:opacity-80 transition duration-1000 group-hover:duration-200"></div>
              <button className="relative w-full sm:w-auto px-8 py-4 bg-goc-primary hover:bg-indigo-500 text-white font-bold rounded-xl transition-all duration-200 transform group-hover:translate-y-[-2px] flex items-center justify-center gap-2 shadow-goc">
                <span>{t('hero.claimNow')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            
            <a href="#how-it-works" className="group w-full sm:w-auto px-8 py-4 bg-goc-surface hover:bg-goc-surface-alt border border-goc-border text-goc-ink font-semibold rounded-xl transition-all duration-200 shadow-goc-sm flex items-center justify-center gap-2">
              <span>{t('hero.learnMore')}</span>
              <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-[-2px] group-hover:translate-y-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-goc-border/70 pt-10 animate-fade-in-up delay-500">
            {[
              { label: 'Total Claims', value: '10K+' },
              { label: 'Success Rate', value: '100%' },
              { label: 'Gas Fees', value: '$0' },
              { label: 'Support', value: '24/7' },
            ].map((stat, index) => (
              <div key={index} className="text-center rounded-2xl border border-goc-border bg-goc-surface/60 backdrop-blur-sm py-5">
                <div className="text-2xl md:text-3xl font-bold text-goc-ink mb-1">{stat.value}</div>
                <div className="text-sm text-goc-muted uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative z-10 bg-[#0b1020]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: t('features.nonCustodial.title'),
                desc: t('features.nonCustodial.description'),
                gradient: 'from-goc-primary/20 to-transparent'
              },
              {
                icon: '⚡',
                title: t('features.gasFree.title'),
                desc: t('features.gasFree.description'),
                gradient: 'from-goc-secondary/20 to-transparent'
              },
              {
                icon: '🛡️',
                title: t('features.secure.title'),
                desc: t('features.secure.description'),
                gradient: 'from-indigo-500/20 to-transparent'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative p-8 rounded-3xl border border-goc-border bg-goc-surface hover:bg-goc-surface-alt transition-all duration-300 overflow-hidden shadow-goc-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-goc-ink mb-3">{feature.title}</h3>
                  <p className="text-goc-muted leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative overflow-hidden bg-[#0c1224]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('howItWorks.title')} <span className="text-goc-primary">{t('howItWorks.subtitle')}</span>
            </h2>
            <p className="text-goc-muted max-w-2xl mx-auto text-lg">
              {t('howItWorks.description')}
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-goc-primary/40 to-transparent -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: '01',
                  title: 'Verify Email',
                  desc: 'Enter your email to receive a secure verification code.',
                  icon: '📧'
                },
                {
                  step: '02',
                  title: 'Connect Wallet',
                  desc: 'Connect your Ethereum wallet to receive tokens.',
                  icon: '🔗'
                },
                {
                  step: '03',
                  title: 'Claim Tokens',
                  desc: 'Confirm the transaction and receive GOC instantly.',
                  icon: '🎉'
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="bg-goc-surface border border-goc-border rounded-2xl p-8 relative z-10 hover:border-goc-primary/40 transition-colors duration-300 shadow-goc-sm">
                    <div className="w-12 h-12 rounded-full bg-goc-primary/15 border border-goc-primary/30 flex items-center justify-center text-goc-primary font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-goc-ink mb-3">{item.title}</h3>
                    <p className="text-goc-muted">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-goc-surface-alt">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h2>
            <p className="text-goc-muted">{t('faq.description')}</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: t('faq.questions.whyVerifyEmail.question'),
                a: t('faq.questions.whyVerifyEmail.answer')
              },
              {
                q: t('faq.questions.changeWallet.question'),
                a: t('faq.questions.changeWallet.answer')
              },
              {
                q: t('faq.questions.needEth.question'),
                a: t('faq.questions.needEth.answer')
              }
            ].map((faq, index) => (
              <div key={index} className="group bg-goc-surface border border-goc-border rounded-2xl p-6 hover:border-goc-primary/40 transition-all duration-300">
                <h3 className="text-lg font-semibold text-goc-ink mb-2 flex items-center gap-3">
                  <span className="text-goc-primary">Q.</span> {faq.q}
                </h3>
                <p className="text-goc-muted pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="home" />
    </div>
  );
}