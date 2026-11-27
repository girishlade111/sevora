import type { Metadata } from "next";
import { AboutPageView } from "@/components/about/AboutPageView";

export const metadata: Metadata = {
  title: "About",
  description:
    "Independent digital designer creating refined identities, websites, and product experiences shaped by strategy, clarity, and thoughtful execution.",
};

export default function AboutPage() {
  return <AboutPageView />;
}
