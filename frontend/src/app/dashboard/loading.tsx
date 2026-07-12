import { Spinner } from '@/components/common/Spinner';

export default function DashboardLoading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60dvh',
        background: 'var(--color-background)',
      }}
      role="status"
      aria-label="Loading dashboard view"
    >
      <Spinner size={32} />
    </div>
  );
}
