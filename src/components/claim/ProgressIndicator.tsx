'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useClaim } from '@/hooks/useClaim';
import { useWallet } from '@/hooks/useWallet';
import { useTranslations } from 'next-intl';
import { TOKEN_SYMBOL } from '@/config/token';

export function ProgressIndicator() {
  const t = useTranslations('claim.steps');
  const { isConnected } = useWallet();
  const { isEmailVerified, allocation, isSigned, isClaimed, reset } = useClaim();

  const steps = [
    { 
      id: 1, 
      name: t('connectWallet.title'), 
      completed: isConnected,
      description: t('connectWallet.description')
    },
    { 
      id: 2, 
      name: t('verifyEmail.title'), 
      completed: isEmailVerified && !!allocation,
      description: t('verifyEmail.description')
    },
    { 
      id: 3, 
      name: t('signMessage.title'), 
      completed: isSigned,
      description: t('signMessage.description')
    },
    { 
      id: 4, 
      name: t('claimTokens.title'), 
      completed: isClaimed,
      description: t('claimTokens.description')
    },
  ];

  const currentStep = steps.findIndex(step => !step.completed) + 1 || steps.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Progress</h3>
          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step, _index) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div 
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : currentStep === step.id
                    ? 'bg-goc-primary text-white'
                    : 'bg-gray-600 text-gray-400'
                }`}
              >
                {step.completed ? '✓' : step.id}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  step.completed ? 'text-green-400' : 'text-gray-300'
                }`}>
                  {step.name}
                </p>
                <p className="text-xs text-gray-400">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {allocation && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-xs text-gray-400">Allocation:</p>
            <p className="text-sm font-medium text-white">
              {allocation.amount} {allocation.symbol ?? TOKEN_SYMBOL}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
