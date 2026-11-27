import { Circle, Ghost, Heart, MapPin, MousePointer2, Sparkles, Type } from "lucide-react";
import { benefitsSection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./BenefitsSection.module.css";

function DesignSystemPreview() {
  return (
    <div className={styles.previewCanvas} aria-hidden="true">
      <div className={styles.dsWorkspace}>
        <div className={styles.dsToolbar}>
          <span className={`${styles.dsToolBtn} ${styles.dsToolBtnActive}`}>
            <MousePointer2 size={14} strokeWidth={1.8} />
          </span>
          <span className={styles.dsToolBtn}>
            <Sparkles size={14} strokeWidth={1.8} />
          </span>
          <span className={styles.dsToolBtn}>
            <Circle size={14} strokeWidth={1.8} />
          </span>
          <span className={styles.dsToolBtn}>
            <Type size={14} strokeWidth={1.8} />
          </span>
        </div>

        <div className={styles.dsFrame}>
          <div className={styles.dsHandle} />
          <div className={styles.dsRow}>
            <span className={`${styles.dsGhostBadge} ${styles.dsGhostLight}`}>
              <Ghost size={13} />
            </span>
            <span className={`${styles.dsBtnChip} ${styles.dsChipPrimary}`}>Primary</span>
            <span className={`${styles.dsSwatchChip} ${styles.dsSwatchGray}`}>Gray</span>
          </div>
          <div className={styles.dsRow}>
            <span className={`${styles.dsGhostBadge} ${styles.dsGhostDark}`}>
              <Ghost size={13} />
            </span>
            <span className={`${styles.dsBtnChip} ${styles.dsChipSecondary}`}>Secondary</span>
            <span className={`${styles.dsSwatchChip} ${styles.dsSwatchYellow}`}>Yellow</span>
          </div>
          <div className={styles.dsRow}>
            <span className={`${styles.dsGhostBadge} ${styles.dsGhostOutline}`}>
              <Ghost size={13} />
            </span>
            <span className={`${styles.dsBtnChip} ${styles.dsChipOutline}`}>Outline</span>
            <span className={`${styles.dsSwatchChip} ${styles.dsSwatchDawn}`}>Dawn pink</span>
          </div>
          <div className={`${styles.dsRow} ${styles.dsRowFaded}`}>
            <span className={`${styles.dsGhostBadge} ${styles.dsGhostOutline}`}>
              <Ghost size={13} />
            </span>
            <span className={styles.dsChipGhost}>Ghost</span>
            <span className={`${styles.dsSwatchChip} ${styles.dsSwatchPink}`}>Pink</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <div className={styles.previewCanvas} aria-hidden="true">
      <div className={styles.analyticsWrap}>
        <svg
          viewBox="0 0 320 180"
          className={styles.analyticsChart}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="sevora-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#121218" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#121218" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          <line x1="64" y1="0" x2="64" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="128" y1="0" x2="128" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="192" y1="0" x2="192" y2="180" stroke="#e5e7eb" strokeWidth="1" />
          <line x1="256" y1="0" x2="256" y2="180" stroke="#e5e7eb" strokeWidth="1" />

          <path
            d="M 0 112 L 42 74 L 94 128 L 146 66 L 208 118 L 262 72 L 320 120 L 320 180 L 0 180 Z"
            fill="url(#sevora-chart-fill)"
          />
          <polyline
            points="0,112 42,74 94,128 146,66 208,118 262,72 320,120"
            fill="none"
            stroke="#c9cdd4"
            strokeWidth="1.5"
          />
          <polyline
            points="0,136 52,150 112,92 174,142 232,110 286,144 320,96"
            fill="none"
            stroke="#6e727c"
            strokeWidth="1.5"
          />
          <circle cx="146" cy="66" r="4" fill="#ffffff" stroke="#121218" strokeWidth="2" />
        </svg>

        <div className={styles.analyticsTooltip}>
          <div className={styles.tooltipDate}>Aug 3, 2026</div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>
              <span className={styles.dotMuted} />
              Unique Visitors
            </span>
            <strong className={styles.tooltipValue}>9,706</strong>
          </div>
          <div className={styles.tooltipRow}>
            <span className={styles.tooltipLabel}>
              <span className={styles.dotDark} />
              Total Pageviews
            </span>
            <strong className={styles.tooltipValue}>6,816</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function FramerExecutionPreview() {
  return (
    <div className={styles.previewCanvas} aria-hidden="true">
      <div className={styles.framerWrap}>
        <div className={styles.framerNotif}>
          <img
            src="/assets/images/testimonials/avatar-1.jpg"
            alt=""
            width={28}
            height={28}
            className={styles.framerNotifAvatar}
          />
          <div>
            <div className={styles.framerNotifTitle}>Just sent you a message!</div>
            <div className={styles.framerNotifMeta}>45 mins ago</div>
          </div>
        </div>

        <div className={styles.framerCard}>
          <div className={styles.framerBadges}>
            <span className={styles.badgeAvailable}>AVAILABLE</span>
            <span className={styles.badgeExpert}>FRAMER EXPERT</span>
            <span className={styles.framerHeart}>
              <Heart size={12} strokeWidth={2} />
            </span>
          </div>

          <div className={styles.framerAgencyRow}>
            <div className={styles.framerAgencyMark}>
              <img src="/assets/brand/sevora-mark.svg" alt="" width={20} height={20} />
            </div>
            <div>
              <div className={styles.framerAgencyName}>Codify Agency</div>
              <div className={styles.framerAgencyLocation}>
                <MapPin size={10} />
                <span>Los Angeles, CA</span>
              </div>
            </div>
          </div>

          <div className={styles.framerThumbGrid}>
            <img
              src="/assets/images/benefits/framer-execution-thumb.png"
              alt=""
              className={styles.framerThumbImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function BenefitsSection() {
  return (
    <section className={styles.section} aria-labelledby="benefits-heading">
      <div className="container">
        <div className={styles.header}>
          <SectionBadge>{benefitsSection.badge}</SectionBadge>
          <h2 id="benefits-heading" className={styles.heading}>
            {benefitsSection.heading}
          </h2>
          <p className={styles.description}>{benefitsSection.description}</p>
        </div>

        <div className={styles.grid}>
          {benefitsSection.cards.map((card) => (
            <article key={card.id} className={styles.card}>
              {card.previewType === "design-system" && <DesignSystemPreview />}
              {card.previewType === "analytics" && <AnalyticsPreview />}
              {card.previewType === "framer" && <FramerExecutionPreview />}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <p className={styles.cardDesc}>{card.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
