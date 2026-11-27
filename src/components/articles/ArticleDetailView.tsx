import Link from "next/link";
import type { ArticleRecord } from "@/types/content";
import { AUTHORS, articles } from "@/content/articles";
import { ArticleCard } from "@/components/articles/ArticleCard";
import styles from "./ArticleDetailView.module.css";

interface ArticleDetailViewProps {
  article: ArticleRecord;
}

export function ArticleDetailView({ article }: ArticleDetailViewProps) {
  const author = AUTHORS[article.authorId];
  const related = article.relatedArticleIds
    .map((id) => articles.find((a) => a.id === id))
    .filter((a): a is ArticleRecord => Boolean(a));

  return (
    <article className={styles.page}>
      <div className="container">
        <header className={styles.header}>
          <Link href="/articles" className={styles.backPill}>
            All Articles
          </Link>

          <h1 className={styles.title}>{article.title}</h1>
          {article.excerpt ? <p className={styles.excerpt}>{article.excerpt}</p> : null}

          <div className={styles.metaRow}>
            {author ? (
              <div className={styles.author}>
                <img
                  src={author.avatarPath}
                  alt={author.name}
                  width={24}
                  height={24}
                  className={styles.authorAvatar}
                />
                <span className={styles.authorName}>{author.name}</span>
              </div>
            ) : null}
            <span className={styles.metaItem}>{article.category}</span>
            <span className={styles.metaItem}>{article.readingMinutes} min read</span>
            <time className={styles.metaItem}>{article.publishedAt}</time>
          </div>
        </header>

        <div className={styles.coverWrap}>
          <img
            src={article.coverPath}
            alt={article.coverAlt}
            fetchPriority="high"
            className={styles.coverImg}
          />
        </div>

        <div className={styles.richBody}>
          {article.body.map((block, idx) => {
            if (block.type === "h2") {
              return <h2 key={idx}>{block.text}</h2>;
            }
            if (block.type === "h3") {
              return <h3 key={idx}>{block.text}</h3>;
            }
            if (block.type === "ul") {
              return (
                <ul key={idx}>
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ul>
              );
            }
            if (block.type === "ol") {
              return (
                <ol key={idx}>
                  {block.items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item}</li>
                  ))}
                </ol>
              );
            }
            if (block.type === "quote") {
              return <blockquote key={idx}>{block.text}</blockquote>;
            }
            return <p key={idx}>{block.text}</p>;
          })}
        </div>

        {related.length > 0 ? (
          <section className={styles.relatedSection} aria-labelledby="related-articles-heading">
            <h2 id="related-articles-heading" className={styles.relatedHeading}>
              Related articles
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((rel) => (
                <ArticleCard key={rel.id} article={rel} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </article>
  );
}
