import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-3)', paddingTop: 'var(--space-6)' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', letterSpacing: '0.05em', color: 'var(--color-text-secondary)' }}>
        {page} / {totalPages}
      </span>

      <button
        className="btn btn-secondary btn-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
