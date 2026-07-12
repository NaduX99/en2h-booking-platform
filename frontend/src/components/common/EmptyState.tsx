import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Nothing here yet',
  description = 'No items to display.',
  action,
}: EmptyStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: 'var(--space-20) var(--space-6)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div style={{ width: 56, height: 56, background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PackageOpen size={24} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <div>
        <p style={{ color: 'var(--color-text-primary)', fontWeight: 500, marginBottom: 'var(--space-2)' }}>{title}</p>
        <p className="aether-body" style={{ fontSize: '0.9375rem' }}>{description}</p>
      </div>
      {action}
    </div>
  );
}
