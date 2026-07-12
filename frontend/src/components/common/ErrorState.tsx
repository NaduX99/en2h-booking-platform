import { AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We could not load this content. Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-20) var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div style={{ width: 56, height: 56, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle size={24} style={{ color: 'var(--color-danger)' }} />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>{title}</p>
        <p className="aether-body" style={{ fontSize: '0.9375rem' }}>{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
