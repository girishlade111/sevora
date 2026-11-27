import Link from "next/link";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.section} aria-labelledby="not-found-heading">
      <div className="container">
        <div className={styles.box}>
          <SectionBadge>404 error</SectionBadge>
          <h1 id="not-found-heading" className={styles.heading}>
            Page not found
          </h1>
          <p className={styles.description}>
            We&apos;re sorry, but the page you&apos;re looking for could not be found. It may have
            been moved, deleted, or never existed in the first place.
          </p>
          <Link href="/" className={styles.button}>
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
