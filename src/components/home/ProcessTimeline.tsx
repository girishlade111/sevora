"use client";

import { useEffect, useRef, useState } from "react";
import { Award, Layers, Lightbulb, Search, Terminal, Users } from "lucide-react";
import { processSection } from "@/content/home";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./ProcessTimeline.module.css";

const PHASE_ICONS = {
  users: Users,
  lightbulb: Lightbulb,
  terminal: Terminal,
  award: Award,
  layers: Layers,
  search: Search,
};

export function ProcessTimeline() {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const onScroll = () => {
      const center = window.innerHeight * 0.48;
      let closestIdx = 0;
      let closestDist = Infinity;
      itemRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        const dist = Math.abs(mid - center);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = idx;
        }
      });
      setActiveIndex(closestIdx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className={styles.section} aria-labelledby="process-heading">
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.stickyCol}>
            <SectionBadge>{processSection.badge}</SectionBadge>
            <h2 id="process-heading" className={styles.heading}>
              {processSection.heading}
            </h2>
            <p className={styles.description}>{processSection.description}</p>
          </div>

          <div className={styles.timelineCol}>
            <div className={styles.connectorLine} aria-hidden="true" />
            {processSection.phases.map((phase, idx) => {
              const Icon = PHASE_ICONS[phase.iconName];
              const isActive = idx === activeIndex;
              return (
                <div
                  key={phase.id}
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  className={`${styles.phaseCard} ${isActive ? styles.phaseCardActive : ""}`}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <span className={`${styles.iconCircle} ${isActive ? styles.iconCircleActive : ""}`}>
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div className={styles.phaseText}>
                    <h3 className={styles.phaseTitle}>{phase.title}</h3>
                    <p className={styles.phaseDesc}>{phase.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
