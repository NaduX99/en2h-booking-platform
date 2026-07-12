import Link from 'next/link';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { ROUTES } from '@/lib/constants/navigation';

export default function NotFound() {
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
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-text-secondary)',
          }}
        >
          <FileQuestion size={28} />
        </div>
        <div>
          <h1 className="aether-heading-md" style={{ marginBottom: 'var(--space-2)' }}>Page Not Found</h1>
          <p className="aether-body" style={{ fontSize: '0.9375rem' }}>
            We could not find the page you are looking for. Please check the URL or return to home.
          </p>
        </div>
        <Link href={ROUTES.HOME} className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
