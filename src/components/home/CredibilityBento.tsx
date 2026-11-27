import { Star } from "lucide-react";
import { credibilitySection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import styles from "./CredibilityBento.module.css";

export function CredibilityBento() {
  return (
    <section className={styles.section} aria-labelledby="credibility-heading">
      <div className="container">
        <div className={styles.topRow}>
          <div className={styles.headingCol}>
            <SectionBadge>{credibilitySection.badge}</SectionBadge>
            <h2 id="credibility-heading" className={styles.heading}>
              {credibilitySection.heading}
            </h2>
          </div>
          <p className={styles.description}>{credibilitySection.description}</p>
        </div>

        <div className={styles.bentoGrid}>
          {/* Left column */}
          <div className={styles.colStack}>
            <div className={`${styles.lightCard} ${styles.avatarCard}`}>
              <div className={styles.avatarRow}>
                <div className={styles.avatars}>
                  {credibilitySection.avatars.map((src, idx) => (
                    <img
                      key={src}
                      src={src}
                      alt={`Client portrait ${idx + 1}`}
                      width={34}
                      height={34}
                      className={styles.avatarImg}
                    />
                  ))}
                </div>
                <span className={styles.clientsCount}>{credibilitySection.clientsCountLabel}</span>
              </div>
              <p className={styles.cardNote}>{credibilitySection.clientsDescription}</p>
            </div>

            <div className={`${styles.lightCard} ${styles.metricCard}`}>
              <div className={styles.bigMetric}>
                <AnimatedNumber
                  value={credibilitySection.satisfactionValue}
                  suffix={credibilitySection.satisfactionSuffix}
                />
              </div>
              <p className={styles.metricLabel}>{credibilitySection.satisfactionLabel}</p>
            </div>
          </div>

          {/* Middle column */}
          <div className={styles.colStack}>
            <div className={`${styles.lightCard} ${styles.metricCardTall}`}>
              <p className={styles.cardNote}>{credibilitySection.projectsDescription}</p>
              <div>
                <div className={styles.bigMetric}>
                  <AnimatedNumber
                    value={credibilitySection.projectsValue}
                    suffix={credibilitySection.projectsSuffix}
                  />
                </div>
                <p className={styles.metricLabel}>{credibilitySection.projectsLabel}</p>
              </div>
            </div>

            <div className={`${styles.lightCard} ${styles.statusCard}`}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>{credibilitySection.availabilityPill}</span>
            </div>
          </div>

          {/* Right dark card */}
          <div className={styles.darkCard}>
            <p className={styles.darkCopy}>{credibilitySection.ratingCardCopy}</p>
            <div className={styles.ratingBottom}>
              <span className={styles.ratingScore}>{credibilitySection.ratingScore}</span>
              <div>
                <div className={styles.stars} role="img" aria-label="4.9 out of 5 stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" aria-hidden="true" />
                  ))}
                </div>
                <p className={styles.ratingCaption}>{credibilitySection.ratingCaption}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
