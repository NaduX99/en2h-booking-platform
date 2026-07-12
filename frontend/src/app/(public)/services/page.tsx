'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, DollarSign } from 'lucide-react';
import { servicesApi } from '@/lib/api/services.api';
import { ServiceItem } from '@/types/service.types';
import { formatCurrency } from '@/lib/formatters/currency';
import { formatDuration } from '@/lib/formatters/duration';
import { SearchInput } from '@/components/common/SearchInput';
import { CardSkeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Pagination } from '@/components/common/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './page.module.css';

const LIMIT = 9;

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const load = async (p: number, s: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesApi.getPublicActive({ page: p, limit: LIMIT, search: s || undefined });
      setServices(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      setPage(1);
    });
  }, [debouncedSearch]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void load(page, debouncedSearch);
    });
  }, [page, debouncedSearch]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      <div className="aether-container">
        <div className={styles.header}>
          <p className="aether-label">Browse</p>
          <h1 className="aether-heading-xl">Available Services</h1>
          <p className="aether-body">Find and book from our range of available services. No account required.</p>
        </div>

        <div className={styles.controls}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search services..." />
        </div>

        {loading && (
          <div className="services-grid">
            {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {!loading && error && <ErrorState message={error} onRetry={() => void load(page, debouncedSearch)} />}

        {!loading && !error && services.length === 0 && (
          <EmptyState title="No services found" description="Try adjusting your search." />
        )}

        {!loading && !error && services.length > 0 && (
          <>
            <div className="services-grid">
              {services.map((svc) => (
                <div key={svc.id} className={`aether-card ${styles.card}`}>
                  <h2 className={styles.cardTitle}>{svc.title}</h2>
                  <p className={styles.cardDesc}>{svc.description}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}><Clock size={14} aria-hidden="true" />{formatDuration(svc.duration)}</span>
                    <span className={styles.metaItem}><DollarSign size={14} aria-hidden="true" />{formatCurrency(svc.price)}</span>
                  </div>
                  <Link href={`${ROUTES.BOOK}?serviceId=${svc.id}`} className="btn btn-primary btn-sm">Book Now</Link>
                </div>
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
