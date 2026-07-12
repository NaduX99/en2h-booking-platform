import type { Metadata } from 'next';
import { HeroSection } from '@/components/landing/HeroSection';
import { ServicesPreviewSection } from '@/components/landing/ServicesPreviewSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { BenefitsSection } from '@/components/landing/BenefitsSection';
import { StaffPortalSection } from '@/components/landing/StaffPortalSection';
import { DecoGallerySection } from '@/components/landing/DecoGallerySection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';

export const metadata: Metadata = {
  title: 'EN2H Booking Platform — Simple bookings. Better service.',
  description: 'Explore available services, choose a convenient date and time, and submit your booking in a few simple steps.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesPreviewSection />
      <HowItWorksSection />
      <BenefitsSection />
      <DecoGallerySection />
      <StaffPortalSection />
      <FinalCtaSection />
    </>
  );
}
