'use client';

import React from 'react';
import { DomeGallery } from '@/components/animations/DomeGallery';

export function DecoGallerySection() {
  return (
    <section className="aether-section" style={{ background: 'var(--color-background)', position: 'relative', overflow: 'hidden', paddingBlock: 'var(--space-20)' }}>
      <div className="aether-container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <p className="aether-label">Visual Exhibition</p>
          <h2 className="aether-heading-xl" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)', textTransform: 'uppercase' }}>EN2H Gallery</h2>
          <p className="aether-body" style={{ maxWidth: '600px', marginInline: 'auto' }}>
            A structured visual gallery of interactive booking mediums. Click and drag the dome to explore the archive.
          </p>
        </div>
        <div style={{ height: '550px', width: '100%', position: 'relative', border: '1px solid var(--color-border)', background: 'rgba(255, 255, 255, 0.01)' }}>
          <DomeGallery />
        </div>
      </div>
    </section>
  );
}
