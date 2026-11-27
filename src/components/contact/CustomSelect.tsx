"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./CustomSelect.module.css";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  options: readonly SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function CustomSelect({
  id,
  label,
  placeholder = "Select...",
  options,
  value,
  onChange,
  error,
  required = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => {
    const idx = options.findIndex((o) => o.value === value);
    return idx >= 0 ? idx : 0;
  });
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listboxId = useId();
  const labelId = useId();
  const errorId = useId();

  const selectedOption = options.find((o) => o.value === value);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((prev) => (prev + 1) % options.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      }
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActiveIndex(options.length - 1);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      const opt = options[activeIndex];
      if (opt) {
        onChange(opt.value);
        setOpen(false);
        buttonRef.current?.focus();
      }
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      const lower = e.key.toLowerCase();
      const matchIdx = options.findIndex((o) => o.label.toLowerCase().startsWith(lower));
      if (matchIdx >= 0) {
        setActiveIndex(matchIdx);
        if (!open) setOpen(true);
      }
    }
  };

  return (
    <div ref={rootRef} className={styles.field}>
      <label id={labelId} htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>

      <div className={styles.controlWrap}>
        <button
          ref={buttonRef}
          id={id}
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${labelId} ${id}`}
          aria-controls={listboxId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${styles.trigger} ${error ? styles.triggerError : ""}`}
          onClick={() => setOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
        >
          <span className={selectedOption ? styles.valueText : styles.placeholderText}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown
            size={16}
            strokeWidth={1.8}
            className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
            aria-hidden="true"
          />
        </button>

        {open ? (
          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={labelId}
            className={styles.listbox}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === activeIndex;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  className={`${styles.option} ${isHighlighted ? styles.optionActive : ""} ${
                    isSelected ? styles.optionSelected : ""
                  }`}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                    buttonRef.current?.focus();
                  }}
                >
                  <span>{opt.label}</span>
                  {isSelected ? <Check size={14} strokeWidth={2} aria-hidden="true" /> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>

      {error ? (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
