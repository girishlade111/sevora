import { featuredProjectsSection } from "@/content/home";
import { projects } from "@/content/projects";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import { ProjectCard } from "@/components/projects/ProjectCard";
import styles from "./FeaturedProjectsSection.module.css";

export function FeaturedProjectsSection() {
  const featured = projects.filter((p) => p.featured).slice(0, 6);

  return (
    <section className={styles.section} aria-labelledby="featured-projects-heading">
      <div className="container">
        <div className={styles.header}>
          <SectionBadge>{featuredProjectsSection.badge}</SectionBadge>
          <h2 id="featured-projects-heading" className={styles.heading}>
            {featuredProjectsSection.heading}
          </h2>
          <p className={styles.description}>{featuredProjectsSection.description}</p>
        </div>

        <div className={styles.grid}>
          {featured.map((project, index) => (
            <ProjectCard key={project.id} project={project} priority={index < 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
