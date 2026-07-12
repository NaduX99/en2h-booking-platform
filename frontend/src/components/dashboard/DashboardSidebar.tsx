'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, CalendarCheck, ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/lib/constants/navigation';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import styles from './DashboardSidebar.module.css';

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: ROUTES.DASHBOARD_SERVICES, label: 'Services', icon: Briefcase, exact: false },
  { href: ROUTES.DASHBOARD_BOOKINGS, label: 'Bookings', icon: CalendarCheck, exact: false },
];

interface SidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isStaff = user?.email.endsWith('@en2h.com') ?? false;
  const visibleItems = isStaff ? NAV_ITEMS : NAV_ITEMS.filter((item) => item.href === ROUTES.DASHBOARD);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className={styles.sidebar} aria-label="Dashboard navigation">
      <div className={styles.logo}>
        <span className={styles.logoMark}>EN2H</span>
        <span className={styles.logoDash}>Dashboard</span>
      </div>

      <nav className={styles.nav}>
        {visibleItems.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            className={`${styles.navItem} ${isActive(href, exact) ? styles.navItemActive : ''}`}
            aria-current={isActive(href, exact) ? 'page' : undefined}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        ))}

        <div className={styles.divider} aria-hidden="true" />

        <Link href={ROUTES.HOME} className={styles.navItem} onClick={onClose} target="_blank" rel="noopener noreferrer">
          <ExternalLink size={18} aria-hidden="true" />
          Public Site
        </Link>
      </nav>

      <div className={styles.userSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-label)', letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Theme</span>
          <ThemeToggle />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar} aria-hidden="true">
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user?.name}</p>
            <p className={styles.userEmail}>{user?.email}</p>
          </div>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={() => { void logout(); }}
          aria-label="Logout"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
