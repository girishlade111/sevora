import type { Metadata } from "next";
import { ProjectsDirectory } from "@/components/projects/ProjectsDirectory";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A focused collection of brand, web, and product design projects shaped through strategy, clarity, and refined execution.",
};

export default function ProjectsPage() {
  return <ProjectsDirectory />;
}
