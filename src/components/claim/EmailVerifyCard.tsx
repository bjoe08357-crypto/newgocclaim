'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Pill } from '@/components/ui/Pill';
import { Alert } from '@/components/ui/Alert';
import { useClaim } from '@/hooks/useClaim';
import { useTranslations } from 'next-intl';

declare global {
  interface Window {
    turnstile: {
      render: (element: string, options: Record<string, unknown>) => string;
      getResponse: (widgetId?: string) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

export function EmailVerifyCard() {
  const t = useTranslations('claim.steps.verifyEmail');
  const [localEmail, setLocalEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');

  const {
    email: savedEmail,
    isEmailVerified,
    allocation,
    loading,
    errors,
    requestEmailCode,
    verifyEmailCode,
    clearError,
  } = useClaim();

  // Use saved email if available, otherwise use local state
  const email = savedEmail || localEmail;

  // If we have a saved email but aren't verified yet, we were probably in the middle of verification
  useEffect(() => {
    if (savedEmail && !isEmailVerified && step === 'email') {
      setStep('code');
    }
  }, [savedEmail, isEmailVerified, step]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Captcha removed for easier testing
    const result = await requestEmailCode(email, '');
    if (result.success) {
      setStep('code');
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await verifyEmailCode(email, code);
    if (result.success) {
      // Clear the code and force a re-render of the page
      setCode('');
      
      // Force all components to re-render by triggering a state change
      setTimeout(() => {
        window.dispatchEvent(new Event('claim-state-updated'));
      }, 100);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setCode('');
    clearError('code');
    // Captcha removed
  };

  if (isEmailVerified) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' }}
            >
              2
            </div>
            <h2 className="text-lg font-semibold text-white">
              {t('title')}
            </h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">
                {email}
              </p>
              <Pill variant="success" className="mt-1">
                {t('emailVerified')} ✓
              </Pill>
            </div>
          </div>
          
          {allocation && (
            <div 
              className="border rounded-lg p-4"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }}
            >
              <p className="text-sm font-medium text-green-400">
                Allocated: {allocation.amount} {allocation.symbol}
              </p>
              {allocation.claimed && (
                <p className="text-xs text-green-300 mt-1">
                  This allocation has already been claimed.
                </p>
              )}
            </div>
          )}

          {!allocation && (
            <Alert variant="info">
              {t('noAllocation')}
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-black font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)' }}
          >
            2
          </div>
          <h2 className="text-lg font-semibold text-white">
            {t('title')}
          </h2>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 'email' ? (
          <>
            <p className="text-sm text-gray-300">
              {t('description')}
            </p>
            
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <Input
                type="email"
                label={t('emailPlaceholder')}
                value={email}
                onChange={(e) => setLocalEmail(e.target.value)}
                error={errors.email}
                placeholder={t('emailPlaceholder')}
                required
              />

              {/* Captcha removed for easier testing */}

              {errors.email && (
                <Alert variant="error">
                  {errors.email}
                </Alert>
              )}

              <Button
                type="submit"
                loading={loading.requestingCode}
                className="w-full"
                disabled={!email}
              >
                {t('sendCode')}
              </Button>
            </form>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-300">
              {t('codeSent')} <strong className="text-white">{email}</strong>. 
              {t('enterCode')}
            </p>
            
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <Input
                type="text"
                label={t('codePlaceholder')}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                error={errors.code}
                placeholder={t('codePlaceholder')}
                maxLength={6}
                required
              />

              {errors.code && (
                <Alert variant="error">
                  {errors.code}
                </Alert>
              )}

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToEmail}
                  className="flex-1"
                >
                  {t('resendCode')}
                </Button>
                <Button
                  type="submit"
                  loading={loading.verifyingCode}
                  className="flex-1"
                  disabled={code.length !== 6}
                >
                  {t('verifyCode')}
                </Button>
              </div>
            </form>

            <p className="text-xs text-gray-400 text-center">
              If an allocation exists for this address, we&apos;ve sent a code. 
              Didn&apos;t receive it? Check your spam folder.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
