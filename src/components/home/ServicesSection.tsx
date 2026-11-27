"use client";

import { useEffect, useRef, useState } from "react";
import { Code2, Compass, Sparkles } from "lucide-react";
import { servicesSection } from "@/content/home";
import styles from "./ServicesSection.module.css";

const SERVICE_ICONS = {
  code: Code2,
  sparkles: Sparkles,
  compass: Compass,
};

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualLock, setManualLock] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || manualLock) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const onScroll = () => {
      if (window.innerWidth < 900) return;
      const rect = el.getBoundingClientRect();
      const totalScrollable = el.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), totalScrollable);
      const progress = scrolled / totalScrollable;

      if (progress < 0.34) {
        setActiveIndex(0);
      } else if (progress < 0.68) {
        setActiveIndex(1);
      } else {
        setActiveIndex(2);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [manualLock]);

  const handleSelect = (idx: number) => {
    setManualLock(true);
    setActiveIndex(idx);
  };

  return (
    <section
      ref={containerRef}
      className={styles.section}
      aria-labelledby="services-heading"
    >
      <div className={styles.stickyViewport}>
        <div className="container">
          <div className={styles.header}>
            <h2 id="services-heading" className={styles.heading}>
              {servicesSection.heading}
            </h2>
            <p className={styles.description}>{servicesSection.description}</p>
          </div>

          <div className={styles.layout}>
            <div className={styles.selectorList} role="tablist" aria-label="Services">
              {servicesSection.services.map((service, idx) => {
                const Icon = SERVICE_ICONS[service.iconName];
                const isActive = idx === activeIndex;
                return (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`service-panel-${service.id}`}
                    className={`${styles.serviceCard} ${isActive ? styles.serviceCardActive : ""}`}
                    onClick={() => handleSelect(idx)}
                  >
                    <span className={`${styles.iconBox} ${isActive ? styles.iconBoxActive : ""}`}>
                      <Icon size={17} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                    <div className={styles.serviceContent}>
                      <h3 className={styles.serviceTitle}>{service.title}</h3>
                      <p className={styles.serviceDesc}>{service.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={styles.graphicStage} id={`service-panel-${servicesSection.services[activeIndex].id}`} role="tabpanel">
              {servicesSection.graphicPaths.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`${servicesSection.services[idx]?.title ?? "Service"} isometric interface diagram`}
                  className={`${styles.graphicImg} ${idx === activeIndex ? styles.graphicActive : styles.graphicHidden}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
