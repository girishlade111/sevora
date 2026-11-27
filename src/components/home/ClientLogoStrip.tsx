import { clientLogos } from "@/content/home";
import styles from "./ClientLogoStrip.module.css";

export function ClientLogoStrip() {
  const repeated = [...clientLogos, ...clientLogos];

  return (
    <section className={styles.section} aria-label="Selected client partners">
      <div className="container">
        <div className={styles.marqueeWrap}>
          <div className={styles.marqueeTrack}>
            {repeated.map((logo, idx) => (
              <div
                key={`${logo.id}-${idx}`}
                className={styles.logoItem}
                aria-hidden={idx >= clientLogos.length}
              >
                <img
                  src={logo.path}
                  alt={idx < clientLogos.length ? logo.name : ""}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logoImg}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
