import { ArrowUpRight } from "lucide-react";
import type { ProjectRecord } from "@/types/content";
import styles from "./ProjectCard.module.css";

interface ProjectCardProps {
  project: ProjectRecord;
  priority?: boolean;
}

export function ProjectCard({ project, priority = false }: ProjectCardProps) {
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
        <h3 className={styles.title}>{project.name}</h3>
        <span className={styles.arrow} aria-hidden="true">
          <ArrowUpRight size={16} strokeWidth={1.8} />
        </span>
      </div>
    </a>
  );
}
