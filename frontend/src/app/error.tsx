'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled app error:', error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-background)',
        padding: 'var(--space-6)',
      }}
    >
      <div
        style={{
          maxWidth: '440px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-5)',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-danger)',
          }}
        >
          <AlertCircle size={28} />
        </div>
        <div>
          <h1 className="aether-heading-md" style={{ marginBottom: 'var(--space-2)' }}>Something went wrong</h1>
          <p className="aether-body" style={{ fontSize: '0.9375rem' }}>
            An unexpected error occurred during rendering.
          </p>
        </div>
        <Button variant="primary" onClick={reset} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
