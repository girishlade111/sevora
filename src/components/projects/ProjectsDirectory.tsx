"use client";

import { useMemo, useState } from "react";
import type { ProjectCategory } from "@/types/content";
import { PROJECT_CATEGORIES, projects } from "@/content/projects";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import { ProjectCard } from "@/components/projects/ProjectCard";
import styles from "./ProjectsDirectory.module.css";

const PAGE_SIZE = 10;

export function ProjectsDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>("All projects");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (selectedCategory === "All projects") return projects;
    return projects.filter((p) => p.categories.includes(selectedCategory));
  }, [selectedCategory]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: ProjectCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className={styles.section} aria-labelledby="projects-page-heading">
      <div className="container">
        <div className={styles.intro}>
          <SectionBadge>Projects</SectionBadge>
          <h1 id="projects-page-heading" className={styles.heading}>
            Selected work with clear direction
          </h1>
          <p className={styles.description}>
            A focused collection of brand, web, and product design projects shaped through
            strategy, clarity, and refined execution.
          </p>
        </div>

        <div className={styles.filterRow} role="tablist" aria-label="Filter projects by category">
          {PROJECT_CATEGORIES.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className={styles.grid}>
          {displayed.map((project, idx) => (
            <ProjectCard key={project.id} project={project} priority={idx < 4} />
          ))}
        </div>

        {hasMore ? (
          <div className={styles.loadMoreWrap}>
            <button
              type="button"
              className={styles.loadMoreBtn}
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            >
              Load More
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
