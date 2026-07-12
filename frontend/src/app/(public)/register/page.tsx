'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GuestGate } from '@/components/auth/GuestGate';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/navigation';
import { RegisterFormData } from '@/lib/validation/auth.schemas';
import { DotField } from '@/components/animations/DotField';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const { register, isSubmitting } = useAuth();
  const router = useRouter();

  const handleSubmit = async (data: RegisterFormData) => {
    await register(data);
    router.push(ROUTES.LOGIN);
  };

  return (
    <GuestGate>
      <div className={styles.page}>
        <div className={styles.ambientBg} aria-hidden="true">
          <div className={styles.glow} />
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={65}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
          />
        </div>

        <div className={styles.card}>
          <div className={styles.brand}>
            <span className={styles.logoMark}>EN2H</span>
            <p className={styles.brandSub}>Booking Platform</p>
          </div>

          <div className={styles.heading}>
            <h1 className="aether-heading-lg">Create Account</h1>
            <p className="aether-body" style={{ fontSize: '0.9375rem', textAlign: 'center' }}>
              Register to create an account for booking and tracking services.
            </p>
          </div>

          <RegisterForm onSubmit={handleSubmit} isLoading={isSubmitting} />

          <div className={styles.links}>
            <p className="aether-body" style={{ fontSize: '0.875rem', textAlign: 'center' }}>
              Already have an account?{' '}
              <Link href={ROUTES.LOGIN} className={styles.link}>Login</Link>
            </p>
            <Link href={ROUTES.HOME} className={styles.backLink}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </GuestGate>
  );
}
