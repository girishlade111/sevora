"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 148);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href="/" className={styles.brand} aria-label={`${siteConfig.brandName} home`}>
            <img
              src={siteConfig.logoMarkPath}
              alt=""
              width={24}
              height={24}
              className={styles.brandMark}
            />
            <span className={styles.brandName}>{siteConfig.brandName}</span>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            {siteConfig.navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link href={siteConfig.headerCta.href} className={styles.ctaButton}>
              <span>{siteConfig.headerCta.label}</span>
              <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>

            <button
              type="button"
              className={styles.menuButton}
              aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </header>

      {/* Scroll-activated floating desktop capsule matching live reference */}
      <div
        className={`${styles.flyoutWrap} ${scrolled ? styles.flyoutVisible : ""}`}
        aria-hidden={!scrolled}
      >
        <div className={styles.flyoutCapsule}>
          <Link
            href="/"
            className={styles.brand}
            tabIndex={scrolled ? 0 : -1}
            aria-label={`${siteConfig.brandName} home`}
          >
            <img
              src={siteConfig.logoMarkPath}
              alt=""
              width={24}
              height={24}
              className={styles.brandMark}
            />
            <span className={styles.brandName}>{siteConfig.brandName}</span>
          </Link>

          <nav className={styles.flyoutNav} aria-label="Floating navigation">
            {siteConfig.navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={scrolled ? 0 : -1}
                className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href={siteConfig.headerCta.href}
            tabIndex={scrolled ? 0 : -1}
            className={styles.ctaButton}
          >
            <span>{siteConfig.headerCta.label}</span>
            <ArrowUpRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen ? (
        <div id="mobile-navigation-drawer" className={styles.mobileDrawer}>
          <nav className={styles.mobileNav} aria-label="Mobile navigation">
            {siteConfig.navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${isActive(item.href) ? styles.mobileLinkActive : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={siteConfig.headerCta.href}
              className={styles.mobileCta}
              onClick={() => setMobileOpen(false)}
            >
              <span>{siteConfig.headerCta.label}</span>
              <ArrowUpRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          </nav>
        </div>
      ) : null}
    </>
  );
}
