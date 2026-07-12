'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { CheckCircle, ArrowLeft, Plus } from 'lucide-react';
import { servicesApi } from '@/lib/api/services.api';
import { bookingsApi } from '@/lib/api/bookings.api';
import { ServiceItem } from '@/types/service.types';
import { Booking } from '@/types/booking.types';
import { bookingSchema, BookingFormData } from '@/lib/validation/booking.schema';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { TextArea } from '@/components/common/TextArea';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { getErrorMessage } from '@/lib/api/api-error';
import { formatCurrency } from '@/lib/formatters/currency';
import { formatDuration } from '@/lib/formatters/duration';
import { formatDate, formatTime, getTodayString } from '@/lib/formatters/date-time';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './page.module.css';

function BookPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, user, isInitializing } = useAuth();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [svcLoading, setSvcLoading] = useState(true);
  const [svcError, setSvcError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<Booking | null>(null);

  const preselectedId = searchParams.get('serviceId') ?? '';

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: { serviceId: preselectedId },
  });

  // Redirect if unauthenticated
  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace(`${ROUTES.LOGIN}?redirect=/book`);
    }
  }, [isInitializing, isAuthenticated, router]);

  // Pre-fill user values
  useEffect(() => {
    if (!isInitializing && isAuthenticated && user) {
      setValue('customerName', user.name);
      setValue('customerEmail', user.email);
    }
  }, [isInitializing, isAuthenticated, user, setValue]);

  useEffect(() => {
    const loadSvcs = async () => {
      setSvcLoading(true);
      try {
        const res = await servicesApi.getPublicActive({ limit: 100 });
        setServices(res.data ?? []);
        if (preselectedId && res.data?.some((s) => s.id === preselectedId)) {
          setValue('serviceId', preselectedId);
        }
      } catch (e) {
        setSvcError(getErrorMessage(e));
      } finally {
        setSvcLoading(false);
      }
    };
    void loadSvcs();
  }, [preselectedId, setValue]);

  const onSubmit = async (data: BookingFormData) => {
    setSubmitting(true);
    try {
      const res = await bookingsApi.create(data);
      setSuccess(res.data);
      toast.success('Booking submitted successfully!');
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  if (isInitializing || (!isAuthenticated && !success)) {
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Skeleton height={40} />
          <Skeleton height={120} />
          <Skeleton height={50} />
        </div>
      </div>
    );
  }

  if (success) {
    const svc = services.find((s) => s.id === success.serviceId);
    return (
      <div className={styles.successWrap}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}><CheckCircle size={32} /></div>
          <h1 className="aether-heading-md">Booking Submitted!</h1>
          <p className="aether-body">Your booking has been received and is awaiting confirmation.</p>
          <div className={styles.successDetails}>
            {[
              { label: 'Reference', value: success.id.slice(0, 8).toUpperCase() },
              { label: 'Service', value: svc?.title ?? success.serviceId },
              { label: 'Date', value: formatDate(success.bookingDate) },
              { label: 'Time', value: formatTime(success.bookingTime) },
              { label: 'Status', value: <span className="badge badge-pending">PENDING</span> },
            ].map(({ label, value }) => (
              <div key={label} className={styles.detailRow}>
                <span className={styles.detailLabel}>{label}</span>
                <span className={styles.detailValue}>{value}</span>
              </div>
            ))}
          </div>
          <div className={styles.successActions}>
            <Button variant="primary" onClick={() => setSuccess(null)} leftIcon={<Plus size={16} />}>
              Another Booking
            </Button>
            <Button variant="secondary" onClick={() => router.push(ROUTES.HOME)} leftIcon={<ArrowLeft size={16} />}>
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className="aether-container">
        <div className={styles.header}>
          <p className="aether-label">Book a Service</p>
          <h1 className="aether-heading-xl">Make a Booking</h1>
          <p className="aether-body">Select a service, date, and time to submit your booking under your EN2H account.</p>
        </div>

        <div className={styles.formWrap}>
          {svcLoading && <Skeleton height={48} />}
          {svcError && <ErrorState message={svcError} />}

          {!svcLoading && !svcError && (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
              <Select
                label="Service"
                required
                placeholder="Select a service"
                error={errors.serviceId?.message}
                {...register('serviceId')}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} — {formatDuration(s.duration)} — {formatCurrency(s.price)}
                  </option>
                ))}
              </Select>

              <div className={styles.twoCol}>
                <Input label="Full Name" type="text" required placeholder="Jane Smith" autoComplete="name" error={errors.customerName?.message} {...register('customerName')} readOnly />
                <Input label="Email" type="email" required placeholder="you@example.com" autoComplete="email" error={errors.customerEmail?.message} {...register('customerEmail')} readOnly />
              </div>

              <Input label="Phone Number" type="tel" required placeholder="+1 555 000 1234" autoComplete="tel" error={errors.customerPhone?.message} {...register('customerPhone')} />

              <div className={styles.twoCol}>
                <Input
                  label="Date"
                  type="date"
                  required
                  min={getTodayString()}
                  error={errors.bookingDate?.message}
                  {...register('bookingDate')}
                />
                <Input
                  label="Time"
                  type="time"
                  required
                  error={errors.bookingTime?.message}
                  {...register('bookingTime')}
                />
              </div>

              <TextArea label="Notes (optional)" placeholder="Any special requests or instructions..." rows={3} error={errors.notes?.message} {...register('notes')} />

              <Button type="submit" variant="primary" fullWidth isLoading={submitting} size="lg">
                Submit Booking
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--color-background)' }} />}>
      <BookPageInner />
    </Suspense>
  );
}
