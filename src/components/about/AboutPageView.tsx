import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Code2,
  Layers,
  Lightbulb,
  Mail,
  MapPin,
  PenTool,
  Pencil,
  Play,
  Search,
  Send,
  Sparkles,
  Star,
  Target,
  Users,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import {
  aboutApproachData,
  aboutHeroData,
  aboutPrinciplesData,
  aboutProjectCtaData,
  aboutStatsData,
  aboutStoryData,
  aboutToolsData,
} from "@/content/about";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./AboutPageView.module.css";

const STAT_ICONS = {
  star: Star,
  users: Users,
  send: Send,
};

const APPROACH_ICONS = {
  users: Users,
  lightbulb: Lightbulb,
  search: Search,
};

const PRINCIPLE_ICONS = {
  sparkles: Sparkles,
  pencil: Pencil,
  layers: Layers,
  target: Target,
};

const TOOL_CAT_ICONS = {
  pen: PenTool,
  code: Code2,
  play: Play,
};

export function AboutPageView() {
  const [framerCard, ...stackCards] = aboutToolsData.cards;

  return (
    <div className={styles.page}>
      {/* 1. About Hero */}
      <section className={styles.heroSection} aria-labelledby="about-hero-heading">
        <div className="container">
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <SectionBadge>{aboutHeroData.badge}</SectionBadge>
              <h1 id="about-hero-heading" className={styles.heroHeading}>
                {aboutHeroData.heading}
              </h1>
              <p className={styles.heroBio}>{aboutHeroData.bio}</p>
              <img
                src={aboutHeroData.signaturePath}
                alt="Sevora Vale signature"
                width={512}
                height={152}
                className={styles.heroSignature}
              />
            </div>

            <div className={styles.portraitStage}>
              <div className={styles.portraitFrame}>
                <img
                  src={aboutHeroData.portraitPath}
                  alt={aboutHeroData.portraitAlt}
                  width={2244}
                  height={2244}
                  fetchPriority="high"
                  className={styles.portraitImg}
                />
              </div>
              <img
                src={aboutHeroData.foregroundPropsPath}
                alt={aboutHeroData.foregroundPropsAlt}
                width={1227}
                height={917}
                className={styles.foregroundProps}
              />
            </div>
          </div>

          {/* 2. Profile Stats */}
          <div className={styles.statsGrid}>
            {aboutStatsData.map((stat) => {
              const Icon = STAT_ICONS[stat.iconName];
              return (
                <article key={stat.id} className={styles.statCard}>
                  <span className={styles.statIconTile}>
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className={styles.statBody}>
                    <h2 className={styles.statTitle}>{stat.title}</h2>
                    <div className={styles.statSubtitle}>{stat.subtitle}</div>
                    <p className={styles.statDesc}>{stat.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Approach */}
      <section className={styles.section} aria-labelledby="approach-heading">
        <div className="container">
          <div className={styles.approachGrid}>
            <div className={styles.approachLeft}>
              <SectionBadge>{aboutApproachData.badge}</SectionBadge>
              <h2 id="approach-heading" className={styles.sectionHeadingLeft}>
                {aboutApproachData.heading}
              </h2>
              <p className={styles.sectionDescLeft}>{aboutApproachData.description}</p>

              <div className={styles.approachSteps}>
                <div className={styles.approachLine} aria-hidden="true" />
                {aboutApproachData.steps.map((step, idx) => {
                  const Icon = APPROACH_ICONS[step.iconName];
                  return (
                    <div key={step.id} className={styles.approachStep}>
                      <span
                        className={`${styles.approachIcon} ${idx === 0 ? styles.approachIconActive : ""}`}
                      >
                        <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className={styles.approachStepTitle}>{step.title}</h3>
                        <p className={styles.approachStepDesc}>{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.approachPhotoWrap}>
              <img
                src={aboutApproachData.photoPath}
                alt={aboutApproachData.photoAlt}
                width={1254}
                height={1254}
                className={styles.approachPhoto}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Principles */}
      <section className={styles.section} aria-labelledby="principles-heading">
        <div className="container">
          <div className={styles.centeredHeader}>
            <SectionBadge>{aboutPrinciplesData.badge}</SectionBadge>
            <h2 id="principles-heading" className={styles.centeredHeading}>
              {aboutPrinciplesData.heading}
            </h2>
            <p className={styles.centeredDesc}>{aboutPrinciplesData.description}</p>
          </div>

          <div className={styles.principlesGrid}>
            {aboutPrinciplesData.items.map((item) => {
              const Icon = PRINCIPLE_ICONS[item.iconName];
              const isDark = Boolean(item.featured);
              return (
                <article
                  key={item.id}
                  className={`${styles.principleCard} ${isDark ? styles.principleCardDark : ""}`}
                >
                  <div className={styles.principleTop}>
                    <span
                      className={`${styles.principleIcon} ${isDark ? styles.principleIconDark : ""}`}
                    >
                      <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <span
                      className={`${styles.principleNum} ${isDark ? styles.textInverse : ""}`}
                    >
                      {item.number}
                    </span>
                  </div>
                  <div className={styles.principleDivider} />
                  <h3 className={`${styles.principleTitle} ${isDark ? styles.textInverse : ""}`}>
                    {item.title}
                  </h3>
                  <p className={`${styles.principleDesc} ${isDark ? styles.textInverseMuted : ""}`}>
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Tools */}
      <section className={styles.section} aria-labelledby="tools-heading">
        <div className="container">
          <div className={styles.toolsGrid}>
            <div className={styles.toolsLeft}>
              <SectionBadge>{aboutToolsData.badge}</SectionBadge>
              <h2 id="tools-heading" className={styles.sectionHeadingLeft}>
                {aboutToolsData.heading}
              </h2>
              <p className={styles.sectionDescLeft}>{aboutToolsData.description}</p>

              <div className={styles.toolCategories}>
                {aboutToolsData.categories.map((cat) => {
                  const Icon = TOOL_CAT_ICONS[cat.iconName];
                  return (
                    <div key={cat.id} className={styles.toolCatRow}>
                      <span className={styles.toolCatIcon}>
                        <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <div className={styles.toolCatText}>
                        <div className={styles.toolCatName}>{cat.category}</div>
                        <div className={styles.toolCatItems}>{cat.toolsLabel}</div>
                      </div>
                      <span className={styles.toolCatNum}>{cat.number}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.toolsComposition}>
              <div className={styles.toolsTiltPlane}>
                <a
                  href={framerCard.href || "https://www.framer.com"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.framerToolCard}
                >
                  <div className={styles.framerToolIcon}>
                    {framerCard.iconPath ? (
                      <img src={framerCard.iconPath} alt="" width={20} height={20} />
                    ) : null}
                  </div>
                  <div className={styles.framerToolBody}>
                    <h3 className={styles.toolCardTitle}>{framerCard.name}</h3>
                    <p className={styles.toolCardDesc}>{framerCard.description}</p>
                  </div>
                  <span className={styles.framerToolArrow} aria-hidden="true">
                    <ArrowUpRight size={15} strokeWidth={1.8} />
                  </span>
                </a>

                <div className={styles.toolStackCol}>
                  {stackCards.map((card) => (
                    <div key={card.id} className={styles.clayToolCard}>
                      <span className={styles.clayToolIcon}>
                        {card.iconPath ? (
                          <img src={card.iconPath} alt={card.name} width={24} height={24} />
                        ) : null}
                      </span>
                      <div>
                        <h3 className={styles.toolCardTitle}>{card.name}</h3>
                        <p className={styles.toolCardDesc}>{card.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Personal Story */}
      <section className={styles.section} aria-labelledby="story-heading">
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.storyMediaWrap}>
              <img
                src={aboutStoryData.workspacePhotoPath}
                alt={aboutStoryData.workspacePhotoAlt}
                width={1244}
                height={1265}
                className={styles.storyPhoto}
              />
              <div className={styles.sinceOverlay}>
                <span className={styles.sinceEyebrow}>{aboutStoryData.sinceEyebrow}</span>
                <div className={styles.sinceYear}>{aboutStoryData.sinceYear}</div>
                <p className={styles.sinceCaption}>{aboutStoryData.sinceCaption}</p>
              </div>
            </div>

            <div className={styles.storyContent}>
              <SectionBadge>{aboutStoryData.badge}</SectionBadge>
              <h2 id="story-heading" className={styles.sectionHeadingLeft}>
                {aboutStoryData.heading}
              </h2>

              <div className={styles.storyParagraphs}>
                {aboutStoryData.paragraphs.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              <div className={styles.storyAuthorRow}>
                <img
                  src={aboutStoryData.signaturePath}
                  alt="Sevora Vale signature"
                  width={512}
                  height={152}
                  className={styles.storySignature}
                />
                <div className={styles.storyAuthorDivider} aria-hidden="true" />
                <div>
                  <div className={styles.storyAuthorName}>{aboutStoryData.authorName}</div>
                  <div className={styles.storyAuthorRole}>{aboutStoryData.authorRole}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Project CTA */}
      <section className={styles.ctaSection} aria-labelledby="about-cta-heading">
        <div className="container">
          <div className={styles.ctaShell}>
            <div className={styles.ctaLeft}>
              <SectionBadge>{aboutProjectCtaData.badge}</SectionBadge>
              <h2 id="about-cta-heading" className={styles.ctaHeading}>
                {aboutProjectCtaData.heading}
              </h2>
              <p className={styles.ctaDesc}>{aboutProjectCtaData.description}</p>

              <div className={styles.ctaButtons}>
                <Link href={aboutProjectCtaData.primaryCta.href} className={styles.ctaPrimaryBtn}>
                  {aboutProjectCtaData.primaryCta.label}
                </Link>
                <Link href={aboutProjectCtaData.secondaryCta.href} className={styles.ctaSecondaryBtn}>
                  {aboutProjectCtaData.secondaryCta.label}
                </Link>
              </div>

              <div className={styles.ctaTagsDivider} />
              <div className={styles.ctaTags}>
                {aboutProjectCtaData.tags.map((tag, idx) => (
                  <span key={tag} className={styles.ctaTagItem}>
                    {idx > 0 ? <span className={styles.ctaTagDot} aria-hidden="true">·</span> : null}
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.ctaDarkPanel}>
              <img
                src={siteConfig.fluidDarkTexturePath}
                alt=""
                aria-hidden="true"
                className={styles.ctaDarkTexture}
              />
              <div className={styles.ctaDarkInner}>
                <div>
                  <h3 className={styles.ctaDarkTitle}>{aboutProjectCtaData.panelTitle}</h3>
                  <p className={styles.ctaDarkSubtitle}>{siteConfig.profile.bookingPeriod}</p>
                </div>

                <div className={styles.ctaInfoRows}>
                  <div className={styles.ctaInfoRow}>
                    <span className={styles.ctaInfoIcon}>
                      <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div>
                      <div className={styles.ctaInfoLabel}>Email</div>
                      <a href={`mailto:${siteConfig.profile.email}`} className={styles.ctaInfoVal}>
                        {siteConfig.profile.email}
                      </a>
                    </div>
                  </div>

                  <div className={styles.ctaInfoRow}>
                    <span className={styles.ctaInfoIcon}>
                      <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div>
                      <div className={styles.ctaInfoLabel}>Location</div>
                      <div className={styles.ctaInfoVal}>{siteConfig.profile.location}</div>
                    </div>
                  </div>

                  <div className={styles.ctaInfoRow}>
                    <span className={styles.ctaInfoIcon}>
                      <Clock size={15} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div>
                      <div className={styles.ctaInfoLabel}>{siteConfig.profile.responseTimeLabel}</div>
                      <div className={styles.ctaInfoVal}>{siteConfig.profile.responseTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
