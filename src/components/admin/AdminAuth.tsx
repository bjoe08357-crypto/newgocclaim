'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ 
          background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(250, 204, 21, 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 80% at 50% 120%, rgba(234, 179, 8, 0.1) 0%, transparent 50%), linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #121212 100%)'
        }}
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img 
                src="/goc-logo.svg" 
                alt="GOC Logo" 
                className="h-16 w-auto object-contain drop-shadow-lg"
              />
            </div>
            <h1 
              className="text-2xl font-bold mb-2 bg-clip-text text-transparent"
              style={{
                background: 'linear-gradient(135deg, #facc15 0%, #fde047 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Admin Login
            </h1>
            <p className="text-gray-300">
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-semibold text-white text-center">
                Authentication Required
              </h2>
            </CardHeader>
            <CardContent>
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

                <Button
                  type="submit"
                  loading={loading}
                  className="w-full"
                >
                  Login
                </Button>
              </form>
            </CardContent>
          </Card>
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
          className="bg-gray-800/80 backdrop-blur-sm border-gray-600 hover:border-yellow-400/50"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
