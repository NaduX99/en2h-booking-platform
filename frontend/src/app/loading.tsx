import { Spinner } from '@/components/common/Spinner';

export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80dvh',
        background: 'var(--color-background)',
      }}
      role="status"
      aria-label="Loading page content"
    >
      <Spinner size={36} />
    </div>
  );
}
