import type { ReactNode } from "react";
import styles from "./SectionBadge.module.css";

interface SectionBadgeProps {
  children: ReactNode;
  icon?: ReactNode;
}

export function SectionBadge({ children, icon }: SectionBadgeProps) {
  return (
    <span className={styles.badge}>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span>{children}</span>
    </span>
  );
}
