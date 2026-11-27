import type { Metadata } from "next";
import { ContactPageView } from "@/components/contact/ContactPageView";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Have a brand, website or product idea in mind? Share a few details and get in touch.",
};

export default function ContactPage() {
  return <ContactPageView />;
}
