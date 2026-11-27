import Link from "next/link";
import type { ArticleRecord } from "@/types/content";
import styles from "./ArticleCard.module.css";

interface ArticleCardProps {
  article: ArticleRecord;
  priority?: boolean;
}

export function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className={styles.card}>
      <div className={styles.mediaWrap}>
        <img
          src={article.thumbnailPath}
          alt={article.coverAlt}
          loading={priority ? "eager" : "lazy"}
          className={styles.media}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min read</span>
        </div>
        <h2 className={styles.title}>{article.title}</h2>
      </div>
    </Link>
  );
}
