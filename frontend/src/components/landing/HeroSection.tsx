import Link from 'next/link';
import { ROUTES } from '@/lib/constants/navigation';
import { Strands } from '@/components/animations/Strands';
import { TextType } from '@/components/animations/TextType';
import styles from './HeroSection.module.css';
import TiltedCard from '@/components/animations/TiltedCard';
import ElectricBorder from '@/components/animations/ElectricBorder';

export function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Hero">
      {/* Ambient grid background */}
      <div className={styles.ambientBg} aria-hidden="true">
        <div className={styles.gridLines} />
        <div className={styles.glow1} />
        <div className={styles.glow2} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.5 }}>
          <Strands
            colors={['#C5A67C', '#050505', '#7A7A7A']}
            count={4}
            speed={0.4}
            amplitude={1.1}
            waviness={1.2}
            thickness={0.8}
            glow={2.0}
            taper={2.8}
            spread={1.2}
            intensity={0.5}
            saturation={1.2}
            opacity={0.65}
            scale={1.4}
          />
        </div>
      </div>

      <div className={`aether-container ${styles.content}`}>
        <div className={styles.textBlock}>
          <p className={`aether-label ${styles.label} animate-fade-in stagger-1`}>
            EN2H STUDIO · EST. MMXVIII
          </p>

          <h1 className={`aether-display ${styles.heading} animate-slide-up stagger-2`} style={{ minHeight: '140px', display: 'flex', alignItems: 'center' }}>
            <TextType 
              text={[
                "INTELLIGENCE IS OUR MEDIUM",
                "AEON RITUAL",
                "SIMPLE BOOKINGS.",
                "BETTER SERVICE."
              ]}
              typingSpeed={60}
              pauseDuration={2200}
              showCursor={true}
              cursorCharacter="·"
              textColors={['#C5A67C', '#FFFFFF', '#C5A67C', '#FFFFFF']}
            />
          </h1>

          <p className={`aether-body ${styles.body} animate-slide-up stagger-3`}>
            EN2H is a next-generation creative studio where artificial intelligence and human imagination build iconic services. Explore available slots, select a convenient timing, and book your session instantly.
          </p>

          <div className={`${styles.actions} animate-slide-up stagger-4`}>
            <Link href={ROUTES.BOOK} className="btn btn-primary btn-lg">
              Book a Service
            </Link>
            <Link href={ROUTES.SERVICES} className="btn btn-secondary btn-lg">
              Explore Services
            </Link>
          </div>

          <div className={`${styles.staffLink} animate-fade-in stagger-5`}>
            <Link href={ROUTES.LOGIN} className={styles.staffAnchor}>
              Staff login ↗
            </Link>
          </div>
        </div>

        {/* Booking preview card */}
        <div className={`${styles.previewCardWrapper} animate-scale-in stagger-3`} aria-hidden="true">
          <ElectricBorder
            color="#C5A67C"
            speed={0.8}
            chaos={0.08}
            borderRadius={1}
            style={{ width: '340px', height: '240px' }}
          >
            <TiltedCard
              imageSrc="/images/hero-card-bg.png"
              altText="EN2H Booking Preview Card"
              captionText="EN2H Creative Studio"
              containerHeight="240px"
              containerWidth="340px"
              imageHeight="240px"
              imageWidth="340px"
              rotateAmplitude={10}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className={styles.previewCardOverlay}>
                  <div className={styles.previewHeader}>
                    <span className="aether-label" style={{ color: 'var(--color-primary)' }}>New Booking</span>
                    <span className="badge badge-pending">PENDING</span>
                  </div>
                  <div className={styles.previewRows}>
                    {[
                      { label: 'Service', value: 'Software Consultation' },
                      { label: 'Date', value: 'Jul 15, 2026' },
                      { label: 'Time', value: '10:00 AM' },
                      { label: 'Duration', value: '1 hr' },
                    ].map(({ label, value }) => (
                      <div key={label} className={styles.previewRow}>
                        <span className={styles.previewLabel}>{label}</span>
                        <span className={styles.previewValue}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.previewFooter}>
                    <div className={styles.previewPulse} />
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>Awaiting confirmation</span>
                  </div>
                </div>
              }
            />
          </ElectricBorder>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={styles.scrollHint} aria-hidden="true">
        <div className={styles.scrollLine} />
      </div>
    </section>
  );
}
