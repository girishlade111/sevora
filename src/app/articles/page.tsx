import type { Metadata } from "next";
import { ArticlesDirectory } from "@/components/articles/ArticlesDirectory";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "A collection of ideas, notes, and practical reflections on design systems, websites, creative direction, and digital craft.",
};

export default function ArticlesPage() {
  return <ArticlesDirectory />;
}
