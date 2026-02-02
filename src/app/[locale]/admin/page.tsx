'use client';

import React from 'react';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { HealthBanner } from '@/components/admin/HealthBanner';
import { CsvUploadCard } from '@/components/admin/CsvUploadCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { GlassCard } from '@/components/ui/GlassCard';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';
import { useAdminStats } from '@/hooks/useAdminStats';
import { TOKEN_ADDRESS, TOKEN_SYMBOL } from '@/config/token';



function AdminDashboard() {
  const t = useTranslations('admin');
  const { stats, loading: statsLoading, error: statsError, refresh } = useAdminStats();
  return (
    <div className="min-h-screen bg-[#0b1020]">
      <Navigation variant="admin" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/goc-logo.svg" 
              alt="GOC Logo" 
              className="h-12 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-goc-ink">
            {t('title')}
          </h1>
          <p className="text-goc-muted">
            Monitor system health, manage allocations, and view claim statistics.
          </p>
        </div>

        {/* Health Banner */}
        <div className="mb-8">
          <HealthBanner />
        </div>

        {/* Admin Guide */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard>
            <div className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wide text-goc-muted">Step 1</p>
              <h3 className="text-base font-semibold text-goc-ink">Prepare CSV</h3>
              <p className="text-sm text-goc-muted">
                Create a CSV with <span className="font-mono">email,amount</span> columns.
              </p>
              <div className="rounded-lg border border-goc-border bg-goc-surface/70 p-2 text-xs font-mono text-goc-ink">
                email,amount<br />alice@example.com,1000.5<br />bob@example.com,2500
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wide text-goc-muted">Step 2</p>
              <h3 className="text-base font-semibold text-goc-ink">Upload Allocations</h3>
              <p className="text-sm text-goc-muted">
                Paste CSV into the upload box and click Upload. Existing unclaimed rows update automatically.
              </p>
              <p className="text-xs text-goc-muted">
                Tip: Use one row per email. Latest duplicate wins.
              </p>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-5 space-y-3">
              <p className="text-xs uppercase tracking-wide text-goc-muted">Step 3</p>
              <h3 className="text-base font-semibold text-goc-ink">Verify & Monitor</h3>
              <p className="text-sm text-goc-muted">
                Check system health and stats to confirm allocations, pending claims, and total distributed tokens.
              </p>
              <p className="text-xs text-goc-muted">
                Use the Gas Fee settings section to cap gas costs for claims.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CSV Upload */}
          <CsvUploadCard />

          {/* Quick Stats */}
          <GlassCard>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-goc-ink">
                  Quick Stats
                </h2>
                <button
                  onClick={refresh}
                  className="text-goc-primary hover:text-blue-700 text-sm transition-colors"
                  disabled={statsLoading}
                >
                  {statsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {statsError ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{statsError}</p>
                  <button
                    onClick={refresh}
                    className="text-goc-primary hover:text-blue-700 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg border border-goc-border bg-goc-surface/60">
                    <div className="text-2xl font-bold text-goc-ink">
                      {statsLoading ? '-' : stats?.totalAllocations || 0}
                    </div>
                    <div className="text-xs text-goc-muted uppercase tracking-wide">Total Allocations</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-goc-border bg-goc-surface/60">
                    <div className="text-2xl font-bold text-goc-ink">
                      {statsLoading ? '-' : stats?.claimedAllocations || 0}
                    </div>
                    <div className="text-xs text-goc-muted uppercase tracking-wide">Claims Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-goc-border bg-goc-surface/60">
                    <div className="text-2xl font-bold text-goc-ink">
                      {statsLoading ? '-' : stats?.pendingClaims || 0}
                    </div>
                    <div className="text-xs text-goc-muted uppercase tracking-wide">Pending Claims</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border border-goc-border bg-goc-surface/60">
                    <div className="text-2xl font-bold text-goc-ink">
                      {statsLoading ? '-' : `${stats?.totalValue?.toLocaleString() || 0}`}
                    </div>
                    <div className="text-xs text-goc-muted uppercase tracking-wide">Total {TOKEN_SYMBOL}</div>
                  </div>
                </div>
              )}
              
              {stats && (
                <div className="mt-4 pt-4 border-t border-goc-border/70">
                  <div className="flex justify-between text-sm">
                    <span className="text-goc-muted">Claim Progress:</span>
                    <span className="text-goc-primary font-medium">{stats.claimPercentage}%</span>
                  </div>
                  <div className="w-full bg-goc-border rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.claimPercentage}%`,
                        background: 'linear-gradient(135deg, #7c5cff 0%, #22d3ee 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Allocations Table Placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-goc-ink">
                Recent Allocations
              </h2>
              <p className="text-sm text-goc-muted">
                View and manage token allocations
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-goc-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-goc-ink">No allocations</h3>
                <p className="mt-1 text-sm text-goc-muted">
                  Upload a CSV file to create token allocations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gas Settings */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-goc-ink">
                Gas Fee Settings
              </h2>
              <p className="text-sm text-goc-muted">
                Control maximum gas limits and costs for token claims
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-goc-ink mb-2">
                      Max Gas Limit
                    </label>
                    <input
                      type="number"
                      id="maxGasLimit"
                      defaultValue="50000"
                      min="21000"
                      max="200000"
                      className="w-full px-3 py-2 bg-goc-surface border border-goc-border rounded-md text-goc-ink focus:outline-none focus:ring-2 focus:ring-goc-primary/30"
                      placeholder="50000"
                    />
                    <p className="text-xs text-goc-muted mt-1">Range: 21,000 - 200,000</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-goc-ink mb-2">
                      Max Gas Cost (ETH)
                    </label>
                    <input
                      type="number"
                      id="maxGasCostETH"
                      defaultValue="0.0002"
                      min="0.0001"
                      max="0.01"
                      step="0.0001"
                      className="w-full px-3 py-2 bg-goc-surface border border-goc-border rounded-md text-goc-ink focus:outline-none focus:ring-2 focus:ring-goc-primary/30"
                      placeholder="0.0002"
                    />
                    <p className="text-xs text-goc-muted mt-1">Range: 0.0001 - 0.01 ETH</p>
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      const gasLimit = (document.getElementById('maxGasLimit') as HTMLInputElement).value;
                      const gasCost = (document.getElementById('maxGasCostETH') as HTMLInputElement).value;
                      
                      fetch('/api/admin/gas-settings', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Basic ${sessionStorage.getItem('admin-auth')}`,
                        },
                        body: JSON.stringify({
                          maxGasLimit: gasLimit,
                          maxGasCostETH: gasCost,
                        }),
                      })
                      .then(response => response.json())
                      .then(data => {
                        if (data.success) {
                          alert('Gas settings updated successfully!');
                        } else {
                          alert('Error: ' + (data.error || 'Unknown error'));
                        }
                      })
                      .catch(error => {
                        alert('Error updating settings: ' + error.message);
                      });
                    }}
                    className="px-4 py-2 bg-goc-primary hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
                  >
                    Update Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      fetch('/api/admin/gas-settings', {
                        headers: {
                          'Authorization': `Basic ${sessionStorage.getItem('admin-auth')}`,
                        },
                      })
                      .then(response => response.json())
                      .then(data => {
                        if (data.maxGasLimit && data.maxGasCostETH) {
                          (document.getElementById('maxGasLimit') as HTMLInputElement).value = data.maxGasLimit;
                          (document.getElementById('maxGasCostETH') as HTMLInputElement).value = data.maxGasCostETH;
                        }
                      })
                      .catch(error => {
                        alert('Error loading settings: ' + error.message);
                      });
                    }}
                    className="px-4 py-2 bg-goc-surface hover:bg-goc-border text-goc-ink font-medium rounded-md transition-colors border border-goc-border"
                  >
                    Load Current
                  </button>
                </div>
                
                <div className="text-xs text-goc-muted space-y-1">
                  <p>• Current network gas: ~20 GWEI</p>
                  <p>• 50,000 gas × 20 GWEI = ~0.001 ETH (~$4)</p>
                  <p>• Claims will be rejected if gas exceeds these limits</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-goc-ink">System Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-goc-muted">Environment:</span>
                <span className="font-medium text-goc-ink">{process.env.NODE_ENV || 'development'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-goc-muted">Token Contract:</span>
                <span className="font-mono text-xs text-goc-primary">{TOKEN_ADDRESS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-goc-muted">Network:</span>
                <span className="font-medium text-goc-ink">Ethereum Mainnet</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-goc-ink">Security Features</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-goc-muted">Email hashing (HMAC)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-goc-muted">Rate limiting</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-goc-muted">Captcha verification</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-goc-muted">One-time claims</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer variant="minimal" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuth>
      <AdminDashboard />
    </AdminAuth>
  );
}
