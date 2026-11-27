import { HeroSection } from "@/components/home/HeroSection";
import { ClientLogoStrip } from "@/components/home/ClientLogoStrip";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { FeaturedProjectsSection } from "@/components/home/FeaturedProjectsSection";
import { CredibilityBento } from "@/components/home/CredibilityBento";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { ExpertiseBento } from "@/components/home/ExpertiseBento";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { PricingSection } from "@/components/home/PricingSection";
import { FaqAccordion } from "@/components/home/FaqAccordion";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ClientLogoStrip />
      <BenefitsSection />
      <FeaturedProjectsSection />
      <CredibilityBento />
      <ServicesSection />
      <ProcessTimeline />
      <ExpertiseBento />
      <TestimonialsSection />
      <PricingSection />
      <FaqAccordion />
    </>
  );
}
