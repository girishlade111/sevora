import { ArrowUpRight } from "lucide-react";
import type { ProjectRecord } from "@/types/content";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectRecord;
  priority?: boolean;
  headingAs?: "h2" | "h3";
}

export function ProjectCard({
  project,
  priority = false,
  headingAs = "h3",
}: ProjectCardProps) {
  const HeadingTag = headingAs;
  return (
    <a
      href={project.externalUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      <div className={styles.mediaWrap}>
        <img
          src={project.thumbnailPath}
          alt={project.imageAlt}
          loading={priority ? "eager" : "lazy"}
          className={styles.media}
        />
      </div>
      <div className={styles.meta}>
        <HeadingTag className={styles.title}>{project.name}</HeadingTag>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.8} />
        </span>
      </div>
    </a>
  );
}
