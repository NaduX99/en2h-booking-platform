'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GuestGate } from '@/components/auth/GuestGate';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/navigation';
import { LoginFormData } from '@/lib/validation/auth.schemas';
import { DotField } from '@/components/animations/DotField';
import styles from './AuthPage.module.css';

function LoginPageInner() {
  const { login, isSubmitting } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || ROUTES.DASHBOARD;

  const handleSubmit = async (data: LoginFormData) => {
    await login(data);
    router.push(redirect);
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
            <h1 className="aether-heading-lg">Account Login</h1>
            <p className="aether-body" style={{ fontSize: '0.9375rem', textAlign: 'center' }}>
              Sign in to your EN2H account to book and manage sessions.
            </p>
          </div>

          <LoginForm onSubmit={handleSubmit} isLoading={isSubmitting} />

          <div className={styles.links}>
            <p className="aether-body" style={{ fontSize: '0.875rem', textAlign: 'center' }}>
              No account?{' '}
              <Link href={ROUTES.REGISTER} className={styles.link}>Register here</Link>
            </p>
            <Link href={ROUTES.HOME} className={styles.backLink}>← Back to Home</Link>
          </div>
        </div>
      </div>
    </GuestGate>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100dvh', background: 'var(--color-background)' }} />}>
      <LoginPageInner />
    </Suspense>
  );
}
