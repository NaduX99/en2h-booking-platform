'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DashboardSidebar } from './DashboardSidebar';
import styles from './MobileDashboardMenu.module.css';

interface Props { pageTitle: string; }

export function MobileDashboardMenu({ pageTitle }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={styles.topBar}>
        <button
          className={styles.menuBtn}
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls="mobile-sidebar"
        >
          <Menu size={22} />
        </button>
        <span className={styles.pageTitle}>{pageTitle}</span>
      </div>

      {open && (
        <>
          <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
          <div id="mobile-sidebar" className={styles.drawer} role="dialog" aria-label="Dashboard navigation">
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
            <DashboardSidebar onClose={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
