'use client';

import { AuthGate } from '@/components/auth/AuthGate';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { MobileDashboardMenu } from '@/components/dashboard/MobileDashboardMenu';
import styles from './layout.module.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <div className={styles.shell}>
        {/* Desktop sidebar */}
        <div className={styles.desktopSidebar}>
          <DashboardSidebar />
        </div>

        {/* Mobile top bar */}
        <div className={styles.mobilebar}>
          <MobileDashboardMenu pageTitle="Dashboard" />
        </div>

        {/* Main content */}
        <main className={styles.main} id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>
    </AuthGate>
  );
}
