'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Briefcase, CalendarCheck, Clock, CheckCircle2, XCircle, CheckCheck, Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { servicesApi } from '@/lib/api/services.api';
import { bookingsApi } from '@/lib/api/bookings.api';
import { Booking } from '@/types/booking.types';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatTime } from '@/lib/formatters/date-time';
import { ROUTES } from '@/lib/constants/navigation';
import { BOOKING_STATUS_LABELS } from '@/lib/constants/booking-status';
import styles from './page.module.css';

interface Stats {
  totalServices: number;
  activeServices: number;
  totalBookings: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function DashboardPage() {
  const { user, isInitializing } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const isStaff = user?.email.endsWith('@en2h.com') ?? false;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isStaff) {
        const [svcRes, bkRes] = await Promise.all([
          servicesApi.getAll({ limit: 100 }),
          bookingsApi.getAll({ limit: 100 }),
        ]);

        const svcs = svcRes.data ?? [];
        const bks = bkRes.data ?? [];

        setStats({
          totalServices: svcRes.meta?.total ?? svcs.length,
          activeServices: svcs.filter((s) => s.isActive).length,
          totalBookings: bkRes.meta?.total ?? bks.length,
          pending: bks.filter((b) => b.status === 'PENDING').length,
          confirmed: bks.filter((b) => b.status === 'CONFIRMED').length,
          completed: bks.filter((b) => b.status === 'COMPLETED').length,
          cancelled: bks.filter((b) => b.status === 'CANCELLED').length,
        });

        setBookings(bks);
      } else {
        const bkRes = await bookingsApi.getAll({ limit: 100 });
        const bks = bkRes.data ?? [];

        setStats({
          totalServices: 0,
          activeServices: 0,
          totalBookings: bkRes.meta?.total ?? bks.length,
          pending: bks.filter((b) => b.status === 'PENDING').length,
          confirmed: bks.filter((b) => b.status === 'CONFIRMED').length,
          completed: bks.filter((b) => b.status === 'COMPLETED').length,
          cancelled: bks.filter((b) => b.status === 'CANCELLED').length,
        });

        setBookings(bks);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isStaff]);

  useEffect(() => {
    if (!isInitializing && user) {
      Promise.resolve().then(() => {
        void load();
      });
    }
  }, [isInitializing, user, load]);

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled successfully.');
      void load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  if (isInitializing || loading) {
    return (
      <div className={styles.page}>
        <div style={{ marginBottom: 'var(--space-8)' }}><Skeleton height={40} /></div>
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          {Array.from({ length: isStaff ? 6 : 4 }).map((_, i) => (
            <div key={i} className="aether-card"><Skeleton height={60} /></div>
          ))}
        </div>
        <Skeleton height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <ErrorState message={error} onRetry={() => void load()} />
      </div>
    );
  }

  if (isStaff) {
    const STAT_CARDS = stats ? [
      { icon: Briefcase, label: 'Total Services', value: stats.totalServices, sub: `${stats.activeServices} active` },
      { icon: CalendarCheck, label: 'Total Bookings', value: stats.totalBookings, sub: 'all time' },
      { icon: Clock, label: 'Pending', value: stats.pending, sub: 'awaiting confirmation' },
      { icon: CheckCircle2, label: 'Confirmed', value: stats.confirmed, sub: 'upcoming' },
      { icon: CheckCheck, label: 'Completed', value: stats.completed, sub: 'finished' },
      { icon: XCircle, label: 'Cancelled', value: stats.cancelled, sub: 'cancelled' },
    ] : [];

    const recentBookings = bookings.slice(0, 5);

    // Donut chart calculations
    const pendingCount = stats?.pending ?? 0;
    const confirmedCount = stats?.confirmed ?? 0;
    const completedCount = stats?.completed ?? 0;
    const cancelledCount = stats?.cancelled ?? 0;
    const bookingsTotal = pendingCount + confirmedCount + completedCount + cancelledCount;

    const donutSegments = [
      { label: 'Pending', count: pendingCount, color: '#C5A67C', percentage: bookingsTotal ? (pendingCount / bookingsTotal) : 0 },
      { label: 'Confirmed', count: confirmedCount, color: '#3B82F6', percentage: bookingsTotal ? (confirmedCount / bookingsTotal) : 0 },
      { label: 'Completed', count: completedCount, color: '#10B981', percentage: bookingsTotal ? (completedCount / bookingsTotal) : 0 },
      { label: 'Cancelled', count: cancelledCount, color: '#EF4444', percentage: bookingsTotal ? (cancelledCount / bookingsTotal) : 0 }
    ];

    const radius = 50;
    const circ = 2 * Math.PI * radius;
    let currentOffset = 0;

    // Bar chart calculations
    const serviceCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const title = b.service?.title || 'Other';
      serviceCounts[title] = (serviceCounts[title] || 0) + 1;
    });

    const barData = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxBarCount = Math.max(...barData.map((d) => d.count), 1);

    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className="aether-heading-lg">Overview</h1>
          <p className="aether-body">Dashboard summary of services and bookings.</p>
        </div>

        <div className="stats-grid">
          {STAT_CARDS.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} className={`aether-card ${styles.statCard}`}>
              <div className={styles.statIcon}><Icon size={20} /></div>
              <div>
                <p className={styles.statValue}>{value}</p>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statSub}>{sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.chartsGrid}>
          {/* Donut Chart: Bookings by Status */}
          <div className="aether-card">
            <h2 className="aether-heading-md" style={{ marginBottom: 'var(--space-6)' }}>Bookings by Status</h2>
            <div className={styles.chartContainer}>
              <svg width="200" height="200" viewBox="0 0 200 200" className={styles.donutSvg}>
                {donutSegments.map((seg, idx) => {
                  const strokeDashoffset = currentOffset;
                  currentOffset -= seg.percentage * circ;
                  
                  return (
                    <circle
                      key={seg.label}
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="12"
                      strokeDasharray={`${seg.percentage * circ} ${circ}`}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 100 100)"
                      style={{
                        transition: 'stroke-width 0.2s ease, opacity 0.2s ease',
                        opacity: hoveredSegment === null || hoveredSegment === idx ? 1 : 0.4,
                        strokeWidth: hoveredSegment === idx ? 16 : 12,
                        cursor: 'pointer'
                      }}
                      onMouseEnter={() => setHoveredSegment(idx)}
                      onMouseLeave={() => setHoveredSegment(null)}
                    />
                  );
                })}
                <text x="100" y="95" textAnchor="middle" fill="var(--color-text-secondary)" fontSize="11" fontFamily="var(--font-label)">
                  {hoveredSegment !== null ? donutSegments[hoveredSegment].label.toUpperCase() : 'TOTAL'}
                </text>
                <text x="100" y="122" textAnchor="middle" fill="var(--color-text-primary)" fontSize="26" fontWeight="bold" fontFamily="var(--font-display)">
                  {hoveredSegment !== null ? donutSegments[hoveredSegment].count : bookingsTotal}
                </text>
              </svg>

              <div className={styles.chartLegend}>
                {donutSegments.map((seg, idx) => (
                  <div
                    key={seg.label}
                    className={`${styles.legendItem} ${hoveredSegment === idx ? styles.legendActive : ''}`}
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                  >
                    <span className={styles.legendDot} style={{ backgroundColor: seg.color }} />
                    <span className={styles.legendLabel}>{seg.label}</span>
                    <span className={styles.legendValue}>{seg.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar Chart: Service Frequencies */}
          <div className="aether-card">
            <h2 className="aether-heading-md" style={{ marginBottom: 'var(--space-6)' }}>Top Booked Services</h2>
            <div className={styles.chartContainer}>
              {barData.length === 0 ? (
                <p className="aether-body" style={{ textAlign: 'center', width: '100%', margin: 'auto' }}>No service data available.</p>
              ) : (
                <svg width="100%" height="200" viewBox="0 0 500 200" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A67C" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C5A67C" stopOpacity="0.1" />
                    </linearGradient>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A67C" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="30" y1="20" x2="470" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="30" y1="80" x2="470" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                  <line x1="30" y1="140" x2="470" y2="140" stroke="rgba(255,255,255,0.1)" />

                  {barData.map((data, idx) => {
                    const barWidth = 44;
                    const spacing = (420 - barData.length * barWidth) / Math.max(barData.length - 1, 1);
                    const x = 40 + idx * (barWidth + spacing);
                    const barHeight = (data.count / maxBarCount) * 120;
                    const y = 140 - barHeight;

                    return (
                      <g key={data.name}>
                        {hoveredBar === idx && (
                          <rect
                            x={x - 4}
                            y={y - 4}
                            width={barWidth + 8}
                            height={barHeight + 8}
                            fill="url(#goldGradient)"
                            rx="1"
                            style={{ filter: 'blur(3px)' }}
                          />
                        )}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          fill={hoveredBar === idx ? '#C5A67C' : 'url(#barGradient)'}
                          rx="1"
                          style={{
                            transition: 'all 0.2s ease',
                            cursor: 'pointer'
                          }}
                          onMouseEnter={() => setHoveredBar(idx)}
                          onMouseLeave={() => setHoveredBar(null)}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={y - 8}
                          textAnchor="middle"
                          fill={hoveredBar === idx ? '#C5A67C' : 'var(--color-text-secondary)'}
                          fontSize="11"
                          fontWeight="bold"
                          fontFamily="var(--font-display)"
                        >
                          {data.count}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y="165"
                          textAnchor="middle"
                          fill={hoveredBar === idx ? 'var(--color-text-primary)' : 'var(--color-text-muted)'}
                          fontSize="9"
                          fontFamily="var(--font-label)"
                          style={{
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s ease'
                          }}
                        >
                          {data.name.length > 12 ? data.name.substring(0, 10) + '..' : data.name}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>

        <div className={styles.recentSection}>
          <div className={styles.recentHeader}>
            <h2 className="aether-heading-md">Recent Bookings</h2>
            <Link href={ROUTES.DASHBOARD_BOOKINGS} className="btn btn-secondary btn-sm">View All</Link>
          </div>

          {recentBookings.length === 0 ? (
            <p className="aether-body" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>No bookings yet.</p>
          ) : (
            <div className={styles.recentList}>
              {recentBookings.map((b) => (
                <Link key={b.id} href={ROUTES.DASHBOARD_BOOKING_DETAIL(b.id)} className={styles.recentItem}>
                  <div>
                    <p className={styles.recentName}>{b.customerName}</p>
                    <p className={styles.recentMeta}>
                      {formatDate(b.bookingDate)} · {formatTime(b.bookingTime)}
                    </p>
                  </div>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>
                    {BOOKING_STATUS_LABELS[b.status]}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={styles.quickLinks}>
          <Link href={ROUTES.DASHBOARD_SERVICES} className="btn btn-secondary">Manage Services</Link>
          <Link href={ROUTES.DASHBOARD_BOOKINGS} className="btn btn-secondary">Manage Bookings</Link>
          <Link href={ROUTES.BOOK} className="btn btn-ghost">Public Booking Page</Link>
        </div>
      </div>
    );
  }

  // Customer Dashboard Portal View
  const CUSTOMER_STATS = stats ? [
    { icon: CalendarCheck, label: 'Total Bookings', value: stats.totalBookings, color: 'var(--color-text-primary)' },
    { icon: Clock, label: 'Pending Slots', value: stats.pending, color: 'var(--color-primary)' },
    { icon: CheckCircle2, label: 'Confirmed Slots', value: stats.confirmed, color: '#2ec4b6' },
    { icon: XCircle, label: 'Cancelled Slots', value: stats.cancelled, color: '#e71d36' },
  ] : [];

  return (
    <div className={styles.page}>
      <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="aether-heading-lg">Welcome back, {user?.name}</h1>
          <p className="aether-body">Track, manage, and schedule your appointment bookings with EN2H.</p>
        </div>
        <Link href={ROUTES.BOOK} className="btn btn-primary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Plus size={16} style={{ marginRight: '8px' }} /> New Booking
        </Link>
      </div>

      <div className="stats-grid" style={{ marginTop: 'var(--space-6)' }}>
        {CUSTOMER_STATS.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={`aether-card ${styles.statCard}`}>
            <div className={styles.statIcon} style={{ color }}><Icon size={20} /></div>
            <div>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statLabel}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.recentSection} style={{ marginTop: 'var(--space-8)' }}>
        <h2 className="aether-heading-md" style={{ marginBottom: 'var(--space-4)' }}>My Active Appointments</h2>

        {bookings.length === 0 ? (
          <div className="aether-card" style={{ textAlign: 'center', padding: 'var(--space-12)', borderStyle: 'dashed' }}>
            <p className="aether-body" style={{ marginBottom: 'var(--space-4)' }}>You don&apos;t have any bookings yet.</p>
            <Link href={ROUTES.BOOK} className="btn btn-secondary btn-sm">Schedule your first booking</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {bookings.map((b) => (
              <div key={b.id} className="aether-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', transition: 'transform 0.2s ease', position: 'relative' }}>
                <div>
                  <h3 className="aether-heading-sm" style={{ color: 'var(--color-primary)' }}>{b.service?.title || 'Service Session'}</h3>
                  <p className="aether-body" style={{ fontSize: '0.875rem', marginTop: 'var(--space-1)' }}>
                    Scheduled for <strong>{formatDate(b.bookingDate)}</strong> at <strong>{formatTime(b.bookingTime)}</strong>
                  </p>
                  {b.notes && (
                    <p className="aether-body" style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginTop: 'var(--space-2)', fontStyle: 'italic' }}>
                      Notes: {b.notes}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <span className={`badge badge-${b.status.toLowerCase()}`}>
                    {BOOKING_STATUS_LABELS[b.status]}
                  </span>
                  {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                    <button
                      onClick={() => void handleCancel(b.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ borderColor: 'rgba(231, 29, 54, 0.4)', color: '#e71d36' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
