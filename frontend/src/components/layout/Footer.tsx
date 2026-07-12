import Link from 'next/link';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`aether-container ${styles.inner}`}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>EN2H</span>
          <p className={styles.tagline}>Simple bookings. Better service.</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link href={ROUTES.HOME} className={styles.link}>Home</Link>
          <Link href={ROUTES.SERVICES} className={styles.link}>Services</Link>
          <Link href={ROUTES.BOOK} className={styles.link}>Book Now</Link>
          <Link href={ROUTES.LOGIN} className={styles.link}>Login</Link>
          <Link href={ROUTES.REGISTER} className={styles.link}>Register</Link>
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} EN2H Booking Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
