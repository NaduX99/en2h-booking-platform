import { cn } from '@/lib/utils/class-names';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({ width, height = 20, className, count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn('skeleton', className)}
          style={{ width: width ?? '100%', height }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="aether-card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <Skeleton height={24} width="60%" />
      <Skeleton height={16} count={2} />
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        <Skeleton height={32} width={80} />
        <Skeleton height={32} width={80} />
      </div>
    </div>
  );
}
