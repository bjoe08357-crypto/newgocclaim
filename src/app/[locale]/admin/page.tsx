'use client';

import React from 'react';
import { AdminAuth } from '@/components/admin/AdminAuth';
import { HealthBanner } from '@/components/admin/HealthBanner';
import { CsvUploadCard } from '@/components/admin/CsvUploadCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { useTranslations } from 'next-intl';
import { useAdminStats } from '@/hooks/useAdminStats';
import { TOKEN_ADDRESS, TOKEN_SYMBOL } from '@/config/token';

function AdminDashboard() {
  const t = useTranslations('admin');
  const { stats, loading: statsLoading, error: statsError, refresh } = useAdminStats();
  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 92, 255, 0.18) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 50% 120%, rgba(34, 211, 238, 0.12) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #121212 100%)'
      }}
    >
      <Navigation variant="admin" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/goc-logo.svg" 
              alt="GOC Logo" 
              className="h-12 w-auto object-contain drop-shadow-lg"
            />
          </div>
          <h1 
            className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
            style={{
              background: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('title')}
          </h1>
          <p className="text-gray-300">
            Monitor system health, manage allocations, and view claim statistics.
          </p>
        </div>

        {/* Health Banner */}
        <div className="mb-8">
          <HealthBanner />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CSV Upload */}
          <CsvUploadCard />

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Quick Stats
                </h2>
                <button
                  onClick={refresh}
                  className="text-goc-primary hover:text-goc-secondary text-sm transition-colors"
                  disabled={statsLoading}
                >
                  {statsLoading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {statsError ? (
                <div className="text-center py-8">
                  <p className="text-red-400 mb-4">{statsError}</p>
                  <button
                    onClick={refresh}
                    className="text-goc-primary hover:text-goc-secondary transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="text-center p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      borderColor: 'rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <div className="text-2xl font-bold text-blue-400">
                      {statsLoading ? '-' : stats?.totalAllocations || 0}
                    </div>
                    <div className="text-sm text-blue-300">Total Allocations</div>
                  </div>
                  <div 
                    className="text-center p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      borderColor: 'rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <div className="text-2xl font-bold text-green-400">
                      {statsLoading ? '-' : stats?.claimedAllocations || 0}
                    </div>
                    <div className="text-sm text-green-300">Claims Completed</div>
                  </div>
                  <div 
                    className="text-center p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(124, 92, 255, 0.12)',
                      borderColor: 'rgba(124, 92, 255, 0.35)'
                    }}
                  >
                    <div className="text-2xl font-bold text-goc-primary">
                      {statsLoading ? '-' : stats?.pendingClaims || 0}
                    </div>
                    <div className="text-sm text-goc-primary/80">Pending Claims</div>
                  </div>
                  <div 
                    className="text-center p-4 rounded-lg border"
                    style={{
                      backgroundColor: 'rgba(168, 85, 247, 0.1)',
                      borderColor: 'rgba(168, 85, 247, 0.3)'
                    }}
                  >
                    <div className="text-2xl font-bold text-purple-400">
                      {statsLoading ? '-' : `${stats?.totalValue?.toLocaleString() || 0}`}
                    </div>
                    <div className="text-sm text-purple-300">Total {TOKEN_SYMBOL}</div>
                  </div>
                </div>
              )}
              
              {stats && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Claim Progress:</span>
                    <span className="text-goc-primary font-medium">{stats.claimPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.claimPercentage}%`,
                        background: 'linear-gradient(135deg, #7C5CFF 0%, #22D3EE 100%)'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Allocations Table Placeholder */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white">
                Recent Allocations
              </h2>
              <p className="text-sm text-gray-400">
                View and manage token allocations
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-white">No allocations</h3>
                <p className="mt-1 text-sm text-gray-400">
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
              <h2 className="text-lg font-semibold text-white">
                Gas Fee Settings
              </h2>
              <p className="text-sm text-gray-400">
                Control maximum gas limits and costs for token claims
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Gas Limit
                    </label>
                    <input
                      type="number"
                      id="maxGasLimit"
                      defaultValue="50000"
                      min="21000"
                      max="200000"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-goc-primary"
                      placeholder="50000"
                    />
                    <p className="text-xs text-gray-500 mt-1">Range: 21,000 - 200,000</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Max Gas Cost (ETH)
                    </label>
                    <input
                      type="number"
                      id="maxGasCostETH"
                      defaultValue="0.0002"
                      min="0.0001"
                      max="0.01"
                      step="0.0001"
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-goc-primary"
                      placeholder="0.0002"
                    />
                    <p className="text-xs text-gray-500 mt-1">Range: 0.0001 - 0.01 ETH</p>
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
                    className="px-4 py-2 text-white font-medium rounded-md transition-all bg-gradient-to-r from-goc-primary to-goc-secondary hover:opacity-90"
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
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
                  >
                    Load Current
                  </button>
                </div>
                
                <div className="text-xs text-gray-400 space-y-1">
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
              <h3 className="text-lg font-semibold text-white">System Information</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Environment:</span>
                <span className="font-medium text-white">{process.env.NODE_ENV || 'development'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Token Contract:</span>
                <span className="font-mono text-xs text-goc-primary">{TOKEN_ADDRESS}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Network:</span>
                <span className="font-medium text-white">Ethereum Mainnet</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-white">Security Features</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Email hashing (HMAC)</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Rate limiting</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">Captcha verification</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300">One-time claims</span>
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
