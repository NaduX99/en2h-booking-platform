import { Search, Calendar, UserCheck, CheckCircle } from 'lucide-react';
import styles from './HowItWorksSection.module.css';

const STEPS = [
  { num: '01', icon: Search, title: 'Choose a Service', body: 'Browse our available services and pick the one that fits your needs.' },
  { num: '02', icon: Calendar, title: 'Select Date & Time', body: 'Pick a convenient date and time slot that works for your schedule.' },
  { num: '03', icon: UserCheck, title: 'Enter Your Details', body: 'Provide your name, email, phone number, and any notes for the booking.' },
  { num: '04', icon: CheckCircle, title: 'Receive Confirmation', body: 'Your booking is submitted instantly. Staff will confirm your appointment.' },
];

export function HowItWorksSection() {
  return (
    <section className={`aether-section ${styles.section}`} id="how-it-works" aria-labelledby="hiw-heading">
      <div className="aether-container">
        <div className={styles.sectionHead}>
          <p className="aether-label">Simple Process</p>
          <h2 className="aether-heading-xl" id="hiw-heading">How It Works</h2>
          <p className="aether-body">Get booked in four easy steps. No account required.</p>
        </div>

        <div className="steps-grid">
          {STEPS.map(({ num, icon: Icon, title, body }) => (
            <div key={num} className={styles.step}>
              <div className={styles.stepNum}>{num}</div>
              <div className={styles.stepIconWrap} aria-hidden="true">
                <Icon size={22} />
              </div>
              <h3 className={styles.stepTitle}>{title}</h3>
              <p className={styles.stepBody}>{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
