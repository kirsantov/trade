import { HeroSection } from '@/components/layout/hero-section';
import { InfoBanner } from '@/components/layout/info-banner';
import { ServicesGrid } from '@/components/layout/services-grid';

export default function Home() {
  return (
    <>
      <HeroSection />
      <InfoBanner />
      <ServicesGrid />
    </>
  );
}
