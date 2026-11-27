"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { faqSection } from "@/content/home";
import styles from "./FaqAccordion.module.css";

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className={styles.section} aria-labelledby="faq-heading">
      <div className="container">
        <div className={styles.header}>
          <h2 id="faq-heading" className={styles.heading}>
            {faqSection.heading}
          </h2>
          <p className={styles.description}>{faqSection.description}</p>
        </div>

        <div className={styles.list}>
          {faqSection.items.map((item) => {
            const isOpen = openIds.includes(item.id);
            const panelId = `faq-panel-${item.id}`;
            return (
              <div key={item.id} className={styles.row}>
                <button
                  type="button"
                  className={styles.trigger}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                >
                  <span className={styles.question}>{item.question}</span>
                  <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ""}`} aria-hidden="true">
                    <Plus size={16} strokeWidth={1.8} />
                  </span>
                </button>

                {isOpen ? (
                  <div id={panelId} className={styles.answerWrap}>
                    <p className={styles.answer}>{item.answer}</p>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
