"use client";

import { useMemo, useState } from "react";
import type { ArticleCategory } from "@/types/content";
import { ARTICLE_CATEGORIES, articles } from "@/content/articles";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import { ArticleCard } from "@/components/articles/ArticleCard";
import styles from "./ArticlesDirectory.module.css";

const PAGE_SIZE = 9;

export function ArticlesDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>("All articles");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const filtered = useMemo(() => {
    if (selectedCategory === "All articles") return articles;
    return articles.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const displayed = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleCategoryChange = (cat: ArticleCategory) => {
    setSelectedCategory(cat);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section className={styles.section} aria-labelledby="articles-page-heading">
      <div className="container">
        <div className={styles.intro}>
          <SectionBadge>Journal</SectionBadge>
          <h1 id="articles-page-heading" className={styles.heading}>
            Thoughts on design, process, and clarity
          </h1>
          <p className={styles.description}>
            A collection of ideas, notes, and practical reflections on design systems, websites,
            creative direction, and digital craft.
          </p>
        </div>

        <div className={styles.filterRow} role="tablist" aria-label="Filter articles by category">
          {ARTICLE_CATEGORIES.map((category) => {
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
          {displayed.map((article, idx) => (
            <ArticleCard key={article.id} article={article} priority={idx < 3} />
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
