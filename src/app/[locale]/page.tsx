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
    <div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
      <Navigation variant="home" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-500/10 blur-[120px] rounded-full opacity-50 mix-blend-screen animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[800px] h-[600px] bg-purple-900/10 blur-[120px] rounded-full opacity-30 mix-blend-screen"></div>
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in-up">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-gray-300">Claims are now live</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white/90 to-white/50 animate-fade-in-up delay-100">
            Claim Your <br />
            <span className="text-yellow-400 inline-block transform hover:scale-105 transition-transform duration-300 cursor-default">GOC Tokens</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
            {t('hero.subtitle')}
            <br className="hidden md:block" />
            Secure, gas-free, and instant distribution directly to your wallet.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up delay-300">
            <Link href="/claim" className="group relative w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <button className="relative w-full sm:w-auto px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all duration-200 transform group-hover:translate-y-[-2px] flex items-center justify-center gap-2">
                <span>{t('hero.claimNow')}</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            
            <a href="#how-it-works" className="group w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center gap-2">
              <span>{t('hero.learnMore')}</span>
              <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-[-2px] group-hover:translate-y-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-12 animate-fade-in-up delay-500">
            {[
              { label: 'Total Claims', value: '10K+' },
              { label: 'Success Rate', value: '100%' },
              { label: 'Gas Fees', value: '$0' },
              { label: 'Support', value: '24/7' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔒',
                title: t('features.nonCustodial.title'),
                desc: t('features.nonCustodial.description'),
                gradient: 'from-blue-500/20 to-purple-500/20'
              },
              {
                icon: '⚡',
                title: t('features.gasFree.title'),
                desc: t('features.gasFree.description'),
                gradient: 'from-yellow-500/20 to-orange-500/20'
              },
              {
                icon: '🛡️',
                title: t('features.secure.title'),
                desc: t('features.secure.description'),
                gradient: 'from-green-500/20 to-emerald-500/20'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative p-8 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/20 to-black"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {t('howItWorks.title')} <span className="text-yellow-400">{t('howItWorks.subtitle')}</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              {t('howItWorks.description')}
            </p>
          </div>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent -translate-y-1/2"></div>

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
                  <div className="bg-black border border-white/10 rounded-2xl p-8 relative z-10 hover:border-yellow-500/50 transition-colors duration-300">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 font-bold mb-6 group-hover:scale-110 transition-transform duration-300">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-gray-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('faq.title')}</h2>
            <p className="text-gray-400">{t('faq.description')}</p>
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
              <div key={index} className="group bg-black border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300">
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-3">
                  <span className="text-yellow-400">Q.</span> {faq.q}
                </h3>
                <p className="text-gray-400 pl-8">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer variant="home" />
    </div>
  );
}
