import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { ClientLogoStrip } from "@/components/home/ClientLogoStrip";

export const metadata: Metadata = {
  title: "Hero Sections",
  description: "Published hero composition and layout reference.",
};

export default function HeroSectionsPage() {
  return (
    <>
      <HeroSection />
      <ClientLogoStrip />
    </>
  );
}
