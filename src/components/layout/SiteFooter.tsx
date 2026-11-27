import Link from "next/link";
import { siteConfig } from "@/config/site";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.outerWrapper}>
        <div className={styles.outerFrame}>
          <div className={styles.innerCard}>
            <div className={styles.topGrid}>
              <div className={styles.brandCol}>
                <Link href="/" className={styles.brand}>
                  <img
                    src={siteConfig.logoMarkPath}
                    alt=""
                    width={24}
                    height={24}
                    className={styles.brandMark}
                  />
                  <span className={styles.brandName}>{siteConfig.brandName}</span>
                </Link>
                <p className={styles.tagline}>{siteConfig.footerTagline}</p>
              </div>

              <div className={styles.navColumns}>
                <div className={styles.navCol}>
                  <h3 className={styles.colTitle}>Pages</h3>
                  <ul className={styles.linkList}>
                    {siteConfig.navLinks.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className={styles.footerLink}>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={styles.navCol}>
                  <h3 className={styles.colTitle}>Social</h3>
                  <ul className={styles.linkList}>
                    {siteConfig.socialLinks.map((item) => (
                      <li key={item.label}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.footerLink}
                        >
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.wordmarkStage} aria-hidden="true">
              <div className={styles.wordmarkMask}>
                <img
                  src={siteConfig.logoWordmarkShaderPath}
                  alt=""
                  className={styles.wordmarkImage}
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <div className={styles.bottomBar}>
            <div className={styles.bottomBarInner}>
              <p className={styles.copyright}>
                © Sevora Template | Created by{" "}
                <a
                  href={siteConfig.attribution.creatorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.attributionLink}
                >
                  {siteConfig.attribution.creatorName}
                </a>
              </p>
              <span className={styles.platformNote}>
                {siteConfig.attribution.independentNote}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
