'use client';

import React, { use, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { ArrowLeft, User, Mail, Phone, Calendar, FileText, CheckSquare, RefreshCw, XCircle } from 'lucide-react';
import { bookingsApi } from '@/lib/api/bookings.api';
import { Booking, BookingStatus } from '@/types/booking.types';
import { Button } from '@/components/common/Button';
import { Spinner } from '@/components/common/Spinner';
import { ErrorState } from '@/components/common/ErrorState';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { formatDate, formatTime, formatDateTime } from '@/lib/formatters/date-time';
import { formatCurrency } from '@/lib/formatters/currency';
import { formatDuration } from '@/lib/formatters/duration';
import { BOOKING_STATUS_LABELS, getAllowedTransitions } from '@/lib/constants/booking-status';
import { getErrorMessage } from '@/lib/api/api-error';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './page.module.css';

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transitionStatus, setTransitionStatus] = useState<BookingStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await bookingsApi.getOne(id);
      setBooking(res.data);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    Promise.resolve().then(() => {
      void load();
    });
  }, [load]);

  const handleStatusChange = async () => {
    if (!transitionStatus) return;
    setSubmitting(true);
    try {
      if (transitionStatus === 'CANCELLED') {
        await bookingsApi.cancel(id);
      } else {
        await bookingsApi.updateStatus(id, transitionStatus);
      }
      toast.success(`Booking status updated to ${BOOKING_STATUS_LABELS[transitionStatus]}.`);
      setTransitionStatus(null);
      void load();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className={styles.page}>
        <Link href={ROUTES.DASHBOARD_BOOKINGS} className={styles.backLink}>
          <ArrowLeft size={16} /> Back to Bookings
        </Link>
        <ErrorState message={error ?? 'Booking not found.'} onRetry={() => void load()} />
      </div>
    );
  }

  const allowedTransitions = getAllowedTransitions(booking.status);

  return (
    <div className={styles.page}>
      <Link href={ROUTES.DASHBOARD_BOOKINGS} className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Bookings
      </Link>

      <div className={styles.container}>
        {/* Detail Card */}
        <div className={`aether-card ${styles.card}`}>
          <div className={styles.header}>
            <div>
              <span className="aether-label" style={{ color: 'var(--color-text-secondary)' }}>
                Booking Ref: #{booking.id.slice(0, 8).toUpperCase()}
              </span>
              <h1 className="aether-heading-md" style={{ marginTop: 6 }}>
                {booking.service?.title ?? 'Unknown Service'}
              </h1>
            </div>
            <span className={`badge badge-${booking.status.toLowerCase()}`}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </span>
          </div>

          <div className={styles.grid}>
            {/* Customer Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <User size={16} /> Customer Information
              </h2>
              <div className={styles.sectionContent}>
                <p className={styles.detailRow}>
                  <span className={styles.detailLabel}>Name</span>
                  <span className={styles.detailValue}>{booking.customerName}</span>
                </p>
                <p className={styles.detailRow}>
                  <span className={styles.detailLabel}>Email</span>
                  <a href={`mailto:${booking.customerEmail}`} className={styles.detailValueLink}>
                    <Mail size={12} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                    {booking.customerEmail}
                  </a>
                </p>
                <p className={styles.detailRow}>
                  <span className={styles.detailLabel}>Phone</span>
                  <a href={`tel:${booking.customerPhone}`} className={styles.detailValueLink}>
                    <Phone size={12} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                    {booking.customerPhone}
                  </a>
                </p>
              </div>
            </div>

            {/* Service & Time Details */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Calendar size={16} /> Appointment details
              </h2>
              <div className={styles.sectionContent}>
                <p className={styles.detailRow}>
                  <span className={styles.detailLabel}>Date</span>
                  <span className={styles.detailValue}>{formatDate(booking.bookingDate)}</span>
                </p>
                <p className={styles.detailRow}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>{formatTime(booking.bookingTime)}</span>
                </p>
                {booking.service && (
                  <>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>Duration</span>
                      <span className={styles.detailValue}>{formatDuration(booking.service.duration)}</span>
                    </p>
                    <p className={styles.detailRow}>
                      <span className={styles.detailLabel}>Price</span>
                      <span className={styles.detailValue}>{formatCurrency(booking.service.price)}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className={styles.section} style={{ gridColumn: 'span 2' }}>
            <h2 className={styles.sectionTitle}>
              <FileText size={16} /> Customer Notes
            </h2>
            <div className={styles.notesBox}>
              <p className="aether-body" style={{ color: booking.notes ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                {booking.notes || 'No notes provided by customer.'}
              </p>
            </div>
          </div>

          {/* System metadata */}
          <div className={styles.meta}>
            <p>Created: {formatDateTime(booking.createdAt ?? '')}</p>
            {booking.updatedAt && <p>Updated: {formatDateTime(booking.updatedAt)}</p>}
            {booking.cancelledAt && <p style={{ color: 'var(--color-danger)' }}>Cancelled: {formatDateTime(booking.cancelledAt)}</p>}
          </div>

          {/* Actions */}
          {allowedTransitions.length > 0 && (
            <div className={styles.actions}>
              {allowedTransitions.includes('CONFIRMED') && (
                <Button variant="primary" onClick={() => setTransitionStatus('CONFIRMED')} leftIcon={<CheckSquare size={16} />}>
                  Confirm Booking
                </Button>
              )}
              {allowedTransitions.includes('COMPLETED') && (
                <Button variant="primary" onClick={() => setTransitionStatus('COMPLETED')} leftIcon={<RefreshCw size={16} />}>
                  Mark Completed
                </Button>
              )}
              {allowedTransitions.includes('CANCELLED') && (
                <Button variant="danger" onClick={() => setTransitionStatus('CANCELLED')} leftIcon={<XCircle size={16} />}>
                  Cancel Booking
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action confirm */}
      <ConfirmDialog
        isOpen={!!transitionStatus}
        onClose={() => setTransitionStatus(null)}
        onConfirm={handleStatusChange}
        title={transitionStatus === 'CANCELLED' ? 'Cancel booking?' : 'Update status?'}
        description={`Are you sure you want to update this booking status to ${transitionStatus ? BOOKING_STATUS_LABELS[transitionStatus] : ''}?`}
        confirmLabel={transitionStatus === 'CANCELLED' ? 'Cancel Booking' : 'Update Status'}
        isLoading={submitting}
        variant={transitionStatus === 'CANCELLED' ? 'danger' : 'primary'}
      />
    </div>
  );
}
