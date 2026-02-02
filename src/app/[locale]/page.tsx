import React from 'react';
import { Link } from '@/i18n/routing';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Section } from '@/components/ui/Section';
import { Badge } from '@/components/ui/Badge';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { StatCard } from '@/components/ui/StatCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { StepCard } from '@/components/ui/StepCard';
import { FaqAccordion } from '@/components/ui/FaqAccordion';
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
  const faqItems = [
    {
      question: t('faq.questions.whyVerifyEmail.question'),
      answer: t('faq.questions.whyVerifyEmail.answer'),
    },
    {
      question: t('faq.questions.changeWallet.question'),
      answer: t('faq.questions.changeWallet.answer'),
    },
    {
      question: t('faq.questions.needEth.question'),
      answer: t('faq.questions.needEth.answer'),
    },
  ];

  return (
    <div className="min-h-screen text-goc-ink selection:bg-goc-primary/30 relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-purple-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-[320px] w-[320px] rounded-full bg-goc-primary/15 blur-[140px]" />
        <div className="absolute top-20 right-0 h-[280px] w-[280px] rounded-full bg-goc-secondary/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <Navigation variant="home" />

      <Section className="pt-24">
        <div className="text-center space-y-6">
          <Badge>Claims are live</Badge>
          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Claim your <span className="text-goc-primary">GOC</span> tokens
            </h1>
            <p className="text-sm md:text-base text-goc-muted max-w-2xl mx-auto">
              {t('hero.subtitle')} Secure, gas-free distribution directly to your wallet.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/claim">
              <PrimaryButton className="px-6 py-2 text-sm">Claim Now</PrimaryButton>
            </Link>
            <a href="#how-it-works">
              <SecondaryButton className="px-6 py-2 text-sm">Learn More</SecondaryButton>
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Claims" value="10K+" />
          <StatCard label="Success Rate" value="100%" />
          <StatCard label="Gas Fees" value="$0" />
          <StatCard label="Support" value="24/7" />
        </div>
      </Section>

      <Section className="bg-[#0c1224]/70 border-y border-goc-border/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: '🔒',
              title: t('features.nonCustodial.title'),
              desc: t('features.nonCustodial.description'),
            },
            {
              icon: '⚡',
              title: t('features.gasFree.title'),
              desc: t('features.gasFree.description'),
            },
            {
              icon: '🛡️',
              title: t('features.secure.title'),
              desc: t('features.secure.description'),
            },
          ].map((feature) => (
            <GlassCard key={feature.title}>
              <div className="p-5 space-y-3">
                <div className="text-2xl">{feature.icon}</div>
                <h3 className="text-base font-semibold text-goc-ink">{feature.title}</h3>
                <p className="text-sm text-goc-muted">{feature.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="how-it-works">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">
            {t('howItWorks.title')}{' '}
            <span className="text-goc-primary">{t('howItWorks.subtitle')}</span>
          </h2>
          <p className="text-sm text-goc-muted max-w-2xl mx-auto">
            {t('howItWorks.description')}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StepCard
            step="01"
            title="Verify Email"
            description="Enter your email and receive a secure verification code."
            icon={<span>📧</span>}
          />
          <StepCard
            step="02"
            title="Connect Wallet"
            description="Connect your wallet to receive your allocation."
            icon={<span>🔗</span>}
          />
          <StepCard
            step="03"
            title="Claim Tokens"
            description="Confirm the claim and receive GOC instantly."
            icon={<span>🎉</span>}
          />
        </div>
      </Section>

      <Section id="faq" className="bg-[#0c1224]/70 border-y border-goc-border/50">
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold">{t('faq.title')}</h2>
          <p className="text-sm text-goc-muted">{t('faq.description')}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <FaqAccordion items={faqItems} />
        </div>
      </Section>

      <Footer variant="home" />
    </div>
  );
}