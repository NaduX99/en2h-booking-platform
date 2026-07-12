'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import styles from './Navbar.module.css';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`} role="banner">
        <div className={`aether-container ${styles.inner}`}>
          {/* Logo */}
          <Link href={ROUTES.HOME} className={styles.logo} onClick={close} aria-label="EN2H Home">
            <span className={styles.logoMark}>EN2H</span>
            <span className={styles.logoDot} aria-hidden="true">·</span>
            <span className={styles.logoSub}>Booking</span>
          </Link>

          {/* Desktop nav */}
          <nav className={styles.desktopNav} aria-label="Main navigation">
            <Link href={ROUTES.HOME} className={styles.navLink}>Home</Link>
            <Link href={ROUTES.SERVICES} className={styles.navLink}>Services</Link>
            <Link href="/#how-it-works" className={styles.navLink}>How It Works</Link>
          </nav>

          {/* Desktop actions */}
          <div className={styles.desktopActions}>
            <ThemeToggle />
            <Link href={ROUTES.BOOK} className="btn btn-primary btn-sm">Book Now</Link>
            {isAuthenticated ? (
              <>
                <Link href={ROUTES.DASHBOARD} className="btn btn-secondary btn-sm">{user?.name ?? 'Dashboard'}</Link>
                <button className="btn btn-ghost btn-sm" onClick={() => void logout()}>Logout</button>
              </>
            ) : (
              <>
                <Link href={ROUTES.LOGIN} className="btn btn-secondary btn-sm">Login</Link>
                <Link href={ROUTES.REGISTER} className="btn btn-ghost btn-sm">Register</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          className={styles.mobileOverlay}
          onClick={close}
          aria-hidden="true"
        />
      )}
      <nav
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileLinks}>
          <Link href={ROUTES.HOME} className={styles.mobileLink} onClick={close}>Home</Link>
          <Link href={ROUTES.SERVICES} className={styles.mobileLink} onClick={close}>Services</Link>
          <Link href="/#how-it-works" className={styles.mobileLink} onClick={close}>How It Works</Link>
          <hr className="aether-divider" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingInline: 'var(--space-4)', marginBlock: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>Theme</span>
            <ThemeToggle />
          </div>
          <hr className="aether-divider" />
          <Link href={ROUTES.BOOK} className="btn btn-primary btn-full" onClick={close}>Book Now</Link>
          {isAuthenticated ? (
            <>
              <Link href={ROUTES.DASHBOARD} className="btn btn-secondary btn-full" onClick={close}>Dashboard</Link>
              <button className="btn btn-ghost btn-full" onClick={() => { void logout(); close(); }}>Logout</button>
            </>
          ) : (
            <>
              <Link href={ROUTES.LOGIN} className="btn btn-secondary btn-full" onClick={close}>Login</Link>
              <Link href={ROUTES.REGISTER} className="btn btn-ghost btn-full" onClick={close}>Register</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
