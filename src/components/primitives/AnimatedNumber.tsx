"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
  decimals?: number;
}

export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1100,
  className = "",
  decimals = 0,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState<number>(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDeterministic =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).has("deterministic");

    if (prefersReduced || isDeterministic) {
      setDisplay(value);
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        setHasAnimated(true);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / durationMs);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          const current = value * eased;
          setDisplay(decimals > 0 ? Number(current.toFixed(decimals)) : Math.round(current));
          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            setDisplay(value);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, durationMs, decimals, hasAnimated]);

  const formatted = decimals > 0 ? display.toFixed(decimals) : String(display);

  return (
    <span ref={ref} className={`tabular-nums ${className}`.trim()}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
