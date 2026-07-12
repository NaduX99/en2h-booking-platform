import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen } from 'lucide-react';
import { ROUTES } from '@/lib/constants/navigation';
import styles from './StaffPortalSection.module.css';

const FEATURES = [
  { icon: BookOpen, label: 'Booking Management', desc: 'View, confirm, complete, or cancel customer bookings.' },
  { icon: LayoutDashboard, label: 'Service Management', desc: 'Create, edit, and activate or deactivate services.' },
  { icon: Users, label: 'Dashboard Overview', desc: 'Monitor booking stats and recent activity at a glance.' },
];

export function StaffPortalSection() {
  return (
    <section className={`aether-section ${styles.section}`} id="staff-portal" aria-labelledby="staff-heading">
      <div className="aether-container">
        <div className={styles.grid}>
          <div className={styles.text}>
            <p className="aether-label">Staff Area</p>
            <h2 className="aether-heading-xl" id="staff-heading">Staff Portal</h2>
            <p className="aether-body" style={{ fontSize: '1.0625rem', maxWidth: '480px' }}>
              The EN2H staff portal gives your team full control over services and bookings. Manage everything from one secure dashboard.
            </p>
            <div className={styles.authActions}>
              <Link href={ROUTES.LOGIN} className="btn btn-primary">Staff Login</Link>
              <Link href={ROUTES.REGISTER} className="btn btn-secondary">Register Account</Link>
            </div>
          </div>

          <div className={styles.features}>
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className={styles.feature}>
                <div className={styles.featureIcon} aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div>
                  <p className={styles.featureLabel}>{label}</p>
                  <p className={styles.featureDesc}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
