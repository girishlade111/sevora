import {
  Crosshair,
  Headphones,
  Magnet,
  Palette,
  Shield,
  Trophy,
  Wand2,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { expertiseSection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./ExpertiseBento.module.css";

const EXPERTISE_ICONS = {
  zap: Zap,
  wand: Wand2,
  magnet: Magnet,
  palette: Palette,
  trophy: Trophy,
  crosshair: Crosshair,
  headphones: Headphones,
  shield: Shield,
};

export function ExpertiseBento() {
  return (
    <section className={styles.section} aria-labelledby="expertise-heading">
      <div className="container">
        <div className={styles.header}>
          <SectionBadge>{expertiseSection.badge}</SectionBadge>
          <h2 id="expertise-heading" className={styles.heading}>
            {expertiseSection.heading}
          </h2>
          <p className={styles.description}>{expertiseSection.description}</p>
        </div>

        <div className={styles.bentoGrid}>
          {expertiseSection.cards.map((card) => {
            const Icon = EXPERTISE_ICONS[card.iconName];
            const isDark = card.variant === "dark";
            const isWide = card.span === "wide";
            return (
              <article
                key={card.id}
                className={`${styles.card} ${isDark ? styles.darkCard : styles.lightCard} ${
                  isWide ? styles.wideCard : styles.singleCard
                }`}
              >
                {isDark ? (
                  <img
                    src={siteConfig.fluidDarkTexturePath}
                    alt=""
                    aria-hidden="true"
                    className={styles.darkTexture}
                  />
                ) : null}

                <div className={styles.cardContent}>
                  <span className={`${styles.iconTile} ${isDark ? styles.iconTileDark : ""}`}>
                    <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className={styles.textBlock}>
                    <h3 className={`${styles.cardTitle} ${isDark ? styles.textInverse : ""}`}>
                      {card.title}
                    </h3>
                    <p className={`${styles.cardDesc} ${isDark ? styles.textInverseMuted : ""}`}>
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
