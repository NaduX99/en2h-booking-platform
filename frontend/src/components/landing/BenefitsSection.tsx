import { Zap, Tag, Clock, Smartphone, Shield, BarChart3, CheckSquare } from 'lucide-react';
import styles from './BenefitsSection.module.css';

const BENEFITS = [
  { icon: Zap, title: 'Quick Booking', body: 'Submit a booking in under two minutes with no account required.' },
  { icon: Tag, title: 'Clear Pricing', body: 'See exact service pricing upfront — no hidden fees or surprises.' },
  { icon: Clock, title: 'Duration Transparency', body: 'Know exactly how long each service takes before you book.' },
  { icon: Smartphone, title: 'Mobile-Friendly', body: 'Book from any device with a fully responsive, touch-friendly flow.' },
  { icon: Shield, title: 'Slot Protection', body: 'Duplicate slot detection prevents double-bookings automatically.' },
  { icon: BarChart3, title: 'Staff Dashboard', body: 'Secure management portal for staff to oversee all bookings.' },
  { icon: CheckSquare, title: 'Status Management', body: 'Staff can confirm, complete, or cancel bookings with ease.' },
];

export function BenefitsSection() {
  return (
    <section className={`aether-section ${styles.section}`} aria-labelledby="benefits-heading">
      <div className="aether-container">
        <div className={styles.sectionHead}>
          <p className="aether-label">Why EN2H</p>
          <h2 className="aether-heading-xl" id="benefits-heading">Platform Benefits</h2>
        </div>

        <div className="benefits-grid">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <div key={title} className={styles.benefit}>
              <div className={styles.iconWrap} aria-hidden="true">
                <Icon size={20} />
              </div>
              <div>
                <h3 className={styles.benefitTitle}>{title}</h3>
                <p className={styles.benefitBody}>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
