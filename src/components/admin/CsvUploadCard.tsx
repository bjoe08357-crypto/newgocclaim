'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useTranslations } from 'next-intl';

interface UploadResult {
  success: boolean;
  inserted?: number;
  updated?: number;
  skipped?: number;
  total?: number;
  error?: string;
}

export function CsvUploadCard() {
  const t = useTranslations('admin.uploadCsv');
  const [csvData, setCsvData] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleUpload = async () => {
    if (!csvData.trim()) {
      setResult({ success: false, error: 'Please enter CSV data' });
      return;
    }

    setUploading(true);
    setResult(null);

    try {
      // Get basic auth credentials
      const username = prompt('Admin Username:');
      const password = prompt('Admin Password:');
      
      if (!username || !password) {
        throw new Error('Authentication required');
      }

      const credentials = btoa(`${username}:${password}`);

      const response = await fetch('/api/admin/upload-csv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify({ csvData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      setResult(data);
      setCsvData(''); // Clear on success
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setResult({ success: false, error: errorMessage });
    } finally {
      setUploading(false);
    }
  };

  const exampleCsv = `email,amount
alice@example.com,1000.5
bob@example.com,2500
charlie@example.com,750.25`;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold text-goc-ink">
          {t('title')}
        </h2>
        <p className="text-sm text-goc-muted">
          {t('description')}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="csv-data" className="block text-sm font-medium text-goc-ink mb-2">
            CSV Data
          </label>
          <textarea
            id="csv-data"
            rows={8}
            className="block w-full rounded-md bg-goc-surface border border-goc-border text-goc-ink placeholder-goc-muted focus:border-goc-primary/40 focus:ring-goc-primary/30 sm:text-sm font-mono"
            placeholder={exampleCsv}
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
          />
          <p className="text-xs text-goc-muted mt-1">
            Format: email,amount (one per line, with or without header)
          </p>
        </div>

        {result && (
          <div>
            {result.success ? (
              <Alert variant="success">
                <div>
                  <strong>Upload Successful!</strong>
                  <div className="text-sm mt-1">
                    Inserted: {result.inserted}, Updated: {result.updated}, Skipped: {result.skipped}
                    <br />
                    Total processed: {result.total}
                  </div>
                </div>
              </Alert>
            ) : (
              <Alert variant="error">
                <strong>Upload Failed:</strong> {result.error}
              </Alert>
            )}
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            onClick={handleUpload}
            loading={uploading}
            disabled={!csvData.trim()}
            className="flex-1"
          >
            {uploading ? t('uploading') : t('upload')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setCsvData('');
              setResult(null);
            }}
          >
            Clear
          </Button>
        </div>

        <div className="text-xs text-goc-muted space-y-1">
          <p>• Existing unclaimed allocations will be updated</p>
          <p>• Already claimed allocations will be skipped</p>
          <p>• Duplicate emails in CSV will use the last occurrence</p>
          <p>• Invalid rows will be skipped and reported</p>
        </div>
      </CardContent>
    </Card>
  );
}
