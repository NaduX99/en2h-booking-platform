'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/common/SearchInput';
import { Select } from '@/components/common/Select';
import { Pagination } from '@/components/common/Pagination';
import { Skeleton } from '@/components/common/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { useDebounce } from '@/hooks/useDebounce';
import { bookingsApi } from '@/lib/api/bookings.api';
import { servicesApi } from '@/lib/api/services.api';
import { Booking, BookingStatus } from '@/types/booking.types';
import { ServiceItem } from '@/types/service.types';
import { formatDate, formatTime } from '@/lib/formatters/date-time';
import { ROUTES } from '@/lib/constants/navigation';
import { BOOKING_STATUS_LABELS } from '@/lib/constants/booking-status';
import { getErrorMessage } from '@/lib/api/api-error';
import styles from './page.module.css';

const LIMIT = 10;
const STATUS_OPTIONS: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 400);

  const loadFilterData = async () => {
    try {
      const res = await servicesApi.getAll({ limit: 100 });
      setServices(res.data ?? []);
    } catch {
      // ignore
    }
  };

  const loadBookings = async (p: number, s: string, st: string, svcId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsApi.getAll({
        page: p,
        limit: LIMIT,
        search: s || undefined,
        status: (st as BookingStatus) || undefined,
        serviceId: svcId || undefined,
      });
      setBookings(res.data ?? []);
      setTotal(res.meta?.total ?? 0);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadFilterData();
    });
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => {
      setPage(1);
    });
  }, [debouncedSearch, statusFilter, serviceFilter]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void loadBookings(page, debouncedSearch, statusFilter, serviceFilter);
    });
  }, [page, debouncedSearch, statusFilter, serviceFilter]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className="aether-heading-lg">Bookings</h1>
          <p className="aether-body">Review and manage customer reservations.</p>
        </div>
      </div>

      <div className={styles.filters}>
        <div className={styles.search}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
        </div>
        <div className={styles.selects}>
          <Select
            aria-label="Filter by Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {BOOKING_STATUS_LABELS[st]}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by Service"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
          >
            <option value="">All Services</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {loading && <div><Skeleton height={48} count={5} className={styles.skeletonRow} /></div>}
      {!loading && error && <ErrorState message={error} onRetry={() => void loadBookings(page, debouncedSearch, statusFilter, serviceFilter)} />}

      {!loading && !error && bookings.length === 0 && (
        <EmptyState title="No bookings found" description="Try adjusting your filters or search." />
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
          <div className={`aether-card ${styles.tableCard}`}>
            <div className="table-scroll-wrapper">
              <table className="aether-table" aria-label="Bookings list">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <p style={{ fontWeight: 500 }}>{b.customerName}</p>
                        <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: 2 }}>{b.customerEmail}</p>
                      </td>
                      <td>{b.service?.title ?? 'Unknown'}</td>
                      <td>
                        <p style={{ fontSize: '0.875rem' }}>{formatDate(b.bookingDate)}</p>
                        <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: 2 }}>{formatTime(b.bookingTime)}</p>
                      </td>
                      <td>
                        <span className={`badge badge-${b.status.toLowerCase()}`}>
                          {BOOKING_STATUS_LABELS[b.status]}
                        </span>
                      </td>
                      <td>
                        <Link href={ROUTES.DASHBOARD_BOOKING_DETAIL(b.id)} className="btn btn-secondary btn-sm">
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
