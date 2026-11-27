import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { heroData } from "@/content/home";
import { AnimatedNumber } from "@/components/primitives/AnimatedNumber";
import styles from "./HeroSection.module.css";

export function HeroSection() {
  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className="container">
        <div className={styles.stage}>
          <div className={styles.heroPanel}>
            <div className={styles.content}>
              <h1 id="hero-heading" className={styles.heading}>
                <span className={styles.line}>{heroData.headlineLeading}</span>
                <span className={styles.line}>
                  {heroData.headlineMiddle}{" "}
                  <span className={styles.mutedWord}>{heroData.headlineMuted}</span>
                </span>
              </h1>

              <p className={styles.description}>{heroData.description}</p>

              <div className={styles.ctaGroup}>
                <Link href={heroData.primaryCta.href} className={styles.primaryCta}>
                  <span>{heroData.primaryCta.label}</span>
                </Link>
                <Link href={heroData.secondaryCta.href} className={styles.secondaryCta}>
                  <span>{heroData.secondaryCta.label}</span>
                </Link>
              </div>

              <div className={styles.statsGrid}>
                {heroData.stats.map((stat) => (
                  <div key={stat.id} className={styles.statItem}>
                    <div className={styles.statValue}>
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </div>
                    <p className={styles.statLabel}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.portraitColumn}>
              <img
                src={heroData.portraitPath}
                alt={heroData.portraitAlt}
                width={2244}
                height={1904}
                fetchPriority="high"
                className={styles.portrait}
              />

              <Link href={heroData.availabilityCard.href} className={styles.availabilityCard}>
                <div className={styles.availabilityBody}>
                  <span className={styles.availabilityEyebrow}>
                    {heroData.availabilityCard.eyebrow}
                  </span>
                  <h2 className={styles.availabilityTitle}>
                    {heroData.availabilityCard.title}
                  </h2>
                  <p className={styles.availabilityDesc}>
                    {heroData.availabilityCard.description}
                  </p>
                </div>
                <span className={styles.availabilityArrow} aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={2} />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
