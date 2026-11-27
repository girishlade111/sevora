"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Crown } from "lucide-react";
import { siteConfig } from "@/config/site";
import { pricingSection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./PricingSection.module.css";

export function PricingSection() {
  const [mode, setMode] = useState<"published" | "screenshot">(siteConfig.pricingMode);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("pricing") === "screenshot") {
      setMode("screenshot");
    }
  }, []);

  return (
    <section className={styles.section} aria-labelledby="pricing-heading">
      <div className="container">
        <div className={styles.header}>
          <SectionBadge>{pricingSection.badge}</SectionBadge>
          <h2 id="pricing-heading" className={styles.heading}>
            {pricingSection.heading}
          </h2>
          <p className={styles.description}>{pricingSection.description}</p>
        </div>

        <div className={styles.grid}>
          {pricingSection.packages.map((pkg) => {
            const isDark = pkg.variant === "dark";
            const rawPrice = mode === "screenshot" ? pkg.screenshotAmount : pkg.amount;
            const formattedPrice = `$${rawPrice.toLocaleString("en-US")}`;

            return (
              <article
                key={pkg.id}
                className={`${styles.card} ${isDark ? styles.darkCard : styles.lightCard}`}
              >
                <div className={styles.cardTop}>
                  <span className={`${styles.iconTile} ${isDark ? styles.iconTileDark : ""}`}>
                    {isDark ? (
                      <Crown size={17} strokeWidth={1.8} aria-hidden="true" />
                    ) : (
                      <img
                        src="/assets/images/benefits/framer-logo-badge.svg"
                        alt=""
                        width={17}
                        height={17}
                      />
                    )}
                  </span>

                  <h3 className={`${styles.pkgName} ${isDark ? styles.textInverse : ""}`}>
                    {pkg.name}
                  </h3>
                  <p className={`${styles.pkgDesc} ${isDark ? styles.textInverseMuted : ""}`}>
                    {pkg.description}
                  </p>

                  <div className={styles.priceRow}>
                    <span className={`${styles.priceValue} ${isDark ? styles.textInverse : ""}`}>
                      {formattedPrice}
                    </span>
                    <span className={`${styles.currency} ${isDark ? styles.textInverseMuted : ""}`}>
                      {pkg.currency}
                    </span>
                  </div>

                  <Link
                    href={pkg.ctaHref}
                    className={`${styles.ctaButton} ${isDark ? styles.ctaLight : styles.ctaDark}`}
                  >
                    {pkg.ctaLabel}
                  </Link>
                </div>

                <div className={`${styles.featuresBox} ${isDark ? styles.featuresBoxDark : ""}`}>
                  {isDark ? (
                    <img
                      src={siteConfig.fluidDarkTexturePath}
                      alt=""
                      aria-hidden="true"
                      className={styles.darkTexture}
                    />
                  ) : null}

                  <div className={styles.featuresInner}>
                    <h4 className={`${styles.featuresTitle} ${isDark ? styles.textInverse : ""}`}>
                      Added Features
                    </h4>
                    <ul className={styles.featureList}>
                      {pkg.features.map((feat) => (
                        <li
                          key={feat}
                          className={`${styles.featureItem} ${isDark ? styles.featureItemDark : ""}`}
                        >
                          <Check size={14} strokeWidth={2} aria-hidden="true" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
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
