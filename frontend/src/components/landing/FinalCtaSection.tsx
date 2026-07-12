import Link from 'next/link';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './FinalCtaSection.module.css';

export function FinalCtaSection() {
  return (
    <section className={`aether-section ${styles.section}`} aria-labelledby="cta-heading">
      <div className={styles.ambientBg} aria-hidden="true">
        <div className={styles.glow} />
      </div>
      <div className={`aether-container ${styles.content}`}>
        <p className="aether-label">Ready?</p>
        <h2 className="aether-heading-xl" id="cta-heading">
          Book your service<br />today.
        </h2>
        <p className="aether-body" style={{ maxWidth: '460px', textAlign: 'center', fontSize: '1.0625rem' }}>
          No account required. Simple, fast, and transparent.
        </p>
        <div className={styles.actions}>
          <Link href={ROUTES.BOOK} className="btn btn-primary btn-lg">Book Now</Link>
          <Link href={ROUTES.SERVICES} className="btn btn-secondary btn-lg">Browse Services</Link>
        </div>
      </div>
    </section>
  );
}
