'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { GradientButton } from '@/components/ui/GradientButton';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';


interface AdminAuthProps {
  children: React.ReactNode;
}

export function AdminAuth({ children }: AdminAuthProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if already authenticated on mount
  useEffect(() => {
    const authToken = sessionStorage.getItem('admin-auth');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const credentials = btoa(`${username}:${password}`);
      
      // Test authentication with the stats API
      const response = await fetch('/api/admin/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
        },
      });

      if (response.ok) { // Should get 200 for successful auth
        sessionStorage.setItem('admin-auth', credentials);
        setIsAuthenticated(true);
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('admin-authenticated'));
      } else {
        setError('Invalid username or password');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setIsAuthenticated(false);
    setUsername('');
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-goc-surface-alt">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/goc-logo.svg" 
                alt="GOC Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-goc-ink">
              Admin Login
            </h1>
            <p className="text-goc-muted">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <GlassCard>
            <div className="p-6 space-y-5">
              <div className="text-center space-y-2">
                <h2 className="text-lg font-semibold text-goc-ink">
                  Authentication Required
                </h2>
                <p className="text-xs text-goc-muted">
                  Credentials are set via environment variables: <span className="font-mono">ADMIN_USERNAME</span> and{' '}
                  <span className="font-mono">ADMIN_PASSWORD</span>.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <Input
                  type="text"
                  label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
                
                <Input
                  type="password"
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />

                {error && (
                  <Alert variant="error">
                    {error}
                  </Alert>
                )}

                <GradientButton
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Login
                </GradientButton>
              </form>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div>
      {children}
      
      {/* Logout button in top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="bg-goc-surface border-goc-border hover:border-goc-primary/40"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
