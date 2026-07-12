'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, DollarSign, ArrowRight } from 'lucide-react';
import { servicesApi } from '@/lib/api/services.api';
import { ServiceItem } from '@/types/service.types';
import { formatCurrency } from '@/lib/formatters/currency';
import { formatDuration } from '@/lib/formatters/duration';
import { CardSkeleton } from '@/components/common/Skeleton';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ROUTES } from '@/lib/constants/navigation';
import { ScrollStack, ScrollStackItem } from '@/components/animations/ScrollStack';
import styles from './ServicesPreviewSection.module.css';

export function ServicesPreviewSection() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await servicesApi.getPublicActive({ limit: 6 });
      setServices(res.data ?? []);
    } catch (e) {
      setError((e as Error).message ?? 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      void load();
    });
  }, []);

  return (
    <section className={`aether-section ${styles.section}`} id="services-preview" aria-labelledby="services-preview-heading">
      <div className="aether-container">
        <div className={styles.sectionHead}>
          <p className="aether-label">Select a Medium</p>
          <h2 className="aether-heading-xl" id="services-preview-heading" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>INTELLIGENCE SERVICES</h2>
          <p className="aether-body">Explore the active creative layers available for scheduling. Select a session below.</p>
        </div>

        {loading && (
          <div className="services-grid">
            {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => void load()} />
        )}

        {!loading && !error && services.length === 0 && (
          <EmptyState title="No services yet" description="Check back soon for available services." />
        )}

        {!loading && !error && services.length > 0 && (
          <div className={styles.stackWrapper}>
            <ScrollStack useWindowScroll={true} itemDistance={60} itemScale={0.025} itemStackDistance={24} stackPosition="15%" baseScale={0.92} blurAmount={0.8}>
              {services.map((svc) => (
                <ScrollStackItem key={svc.id} itemClassName={styles.serviceCard}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle} style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{svc.title}</h3>
                  </div>
                  <p className={styles.cardDesc}>{svc.description}</p>
                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <Clock size={14} aria-hidden="true" />
                      {formatDuration(svc.duration)}
                    </span>
                    <span className={styles.metaItem}>
                      <DollarSign size={14} aria-hidden="true" />
                      {formatCurrency(svc.price)}
                    </span>
                  </div>
                  <div className={styles.cardActions}>
                    <Link href={`${ROUTES.BOOK}?serviceId=${svc.id}`} className="btn btn-primary btn-sm">
                      Book Now
                    </Link>
                  </div>
                </ScrollStackItem>
              ))}
            </ScrollStack>
          </div>
        )}

        <div className={styles.viewAll}>
          <Link href={ROUTES.SERVICES} className="btn btn-secondary">
            View All Services <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
