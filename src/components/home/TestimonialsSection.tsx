import Link from "next/link";
import { Star, Users } from "lucide-react";
import { siteConfig } from "@/config/site";
import { testimonialsSection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./TestimonialsSection.module.css";

export function TestimonialsSection() {
  const [ethan, maya, liam] = testimonialsSection.items;

  return (
    <section className={styles.section} aria-labelledby="testimonials-heading">
      <div className="container">
        <div className={styles.topRow}>
          <div>
            <SectionBadge>{testimonialsSection.badge}</SectionBadge>
            <h2 id="testimonials-heading" className={styles.heading}>
              {testimonialsSection.heading}
            </h2>
          </div>
          <p className={styles.description}>{testimonialsSection.description}</p>
        </div>

        <div className={styles.grid}>
          {/* Column 1: Tall dark testimonial card */}
          <article className={styles.darkCard}>
            <img
              src={siteConfig.fluidDarkTexturePath}
              alt=""
              aria-hidden="true"
              className={styles.darkTexture}
            />
            <div className={styles.darkInner}>
              <div>
                <div className={styles.stars} role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className={styles.darkQuote}>{ethan.quote}</blockquote>
              </div>

              <div className={styles.authorFooter}>
                <div className={styles.authorInfo}>
                  <img
                    src={ethan.avatarPath}
                    alt={ethan.name}
                    width={40}
                    height={40}
                    className={styles.avatar}
                  />
                  <div>
                    <div className={styles.authorNameInverse}>{ethan.name}</div>
                    <div className={styles.authorRoleInverse}>{ethan.role}</div>
                  </div>
                </div>
                <a
                  href={ethan.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialTagInverse}
                >
                  {ethan.linkLabel}
                </a>
              </div>
            </div>
          </article>

          {/* Column 2: Maya Chen + Trust indicator */}
          <div className={styles.middleCol}>
            <article className={styles.lightCard}>
              <blockquote className={styles.lightQuote}>{maya.quote}</blockquote>
              <div className={styles.authorFooter}>
                <div className={styles.authorInfo}>
                  <img
                    src={maya.avatarPath}
                    alt={maya.name}
                    width={38}
                    height={38}
                    className={styles.avatar}
                  />
                  <div>
                    <div className={styles.authorName}>{maya.name}</div>
                    <div className={styles.authorRole}>{maya.role}</div>
                  </div>
                </div>
                <a
                  href={maya.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialTag}
                >
                  {maya.linkLabel}
                </a>
              </div>
            </article>

            <div className={styles.trustCard}>
              <Users size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>{testimonialsSection.trustLabel}</span>
            </div>
          </div>

          {/* Column 3: CTA button + Liam Carter */}
          <div className={styles.rightCol}>
            <Link href={testimonialsSection.ctaHref} className={styles.ctaBar}>
              {testimonialsSection.ctaLabel}
            </Link>

            <article className={`${styles.lightCard} ${styles.liamCard}`}>
              <blockquote className={styles.lightQuote}>{liam.quote}</blockquote>
              <div className={styles.authorFooter}>
                <div className={styles.authorInfo}>
                  <img
                    src={liam.avatarPath}
                    alt={liam.name}
                    width={38}
                    height={38}
                    className={styles.avatar}
                  />
                  <div>
                    <div className={styles.authorName}>{liam.name}</div>
                    <div className={styles.authorRole}>{liam.role}</div>
                  </div>
                </div>
                <a
                  href={liam.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialTag}
                >
                  {liam.linkLabel}
                </a>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
