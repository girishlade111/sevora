"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/config/site";
import { SectionBadge } from "@/components/primitives/SectionBadge";
import { CustomSelect } from "@/components/contact/CustomSelect";
import styles from "./ContactPageView.module.css";

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  budgetRange?: string;
  message?: string;
  form?: string;
}

export function ContactPageView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverNote, setServerNote] = useState("");

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    if (name.trim().length < 2) {
      next.name = "Please enter your name.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Please enter a valid email address.";
    }
    if (!projectType) {
      next.projectType = "Please select a project type.";
    }
    if (!budgetRange) {
      next.budgetRange = "Please select a budget range.";
    }
    if (message.trim().length < 10) {
      next.message = "Please share a few details about your project (at least 10 characters).";
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          projectType,
          budgetRange,
          message: message.trim(),
          website: honeypot,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrors({ form: data.error || "Unable to submit inquiry. Please try again." });
        return;
      }

      setStatus("success");
      setServerNote(data.message || "Inquiry received.");
      setName("");
      setEmail("");
      setProjectType("");
      setBudgetRange("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrors({ form: "Network error while sending inquiry. Please try again." });
    }
  };

  return (
    <section className={styles.section} aria-labelledby="contact-heading">
      <div className="container">
        <div className={styles.intro}>
          <SectionBadge>Contact</SectionBadge>
          <h1 id="contact-heading" className={styles.heading}>
            Let&apos;s talk about your next project
          </h1>
          <p className={styles.description}>
            Have a brand, website or product idea in mind? Share a few details and I&apos;ll get
            back to you soon.
          </p>
        </div>

        <div className={styles.twoCol}>
          {/* Left Form Card */}
          <div className={styles.formCard}>
            <form onSubmit={handleSubmit} noValidate className={styles.form}>
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className={styles.honeypot}
                aria-hidden="true"
              />

              <div className={styles.field}>
                <label htmlFor="contact-name" className={styles.label}>
                  Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-err" : undefined}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                />
                {errors.name ? (
                  <p id="contact-name-err" className={styles.errorText} role="alert">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div className={styles.field}>
                <label htmlFor="contact-email" className={styles.label}>
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="jane@framer.com"
                  required
                  maxLength={160}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-err" : undefined}
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                />
                {errors.email ? (
                  <p id="contact-email-err" className={styles.errorText} role="alert">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <CustomSelect
                id="contact-project-type"
                label="Project type"
                placeholder="Select..."
                options={siteConfig.contactOptions.projectTypes}
                value={projectType}
                required
                error={errors.projectType}
                onChange={(val) => {
                  setProjectType(val);
                  if (errors.projectType) setErrors((p) => ({ ...p, projectType: undefined }));
                }}
              />

              <CustomSelect
                id="contact-budget-range"
                label="Budget range"
                placeholder="Select..."
                options={siteConfig.contactOptions.budgetRanges}
                value={budgetRange}
                required
                error={errors.budgetRange}
                onChange={(val) => {
                  setBudgetRange(val);
                  if (errors.budgetRange) setErrors((p) => ({ ...p, budgetRange: undefined }));
                }}
              />

              <div className={styles.field}>
                <label htmlFor="contact-message" className={styles.label}>
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your project..."
                  required
                  maxLength={3000}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (errors.message) setErrors((p) => ({ ...p, message: undefined }));
                  }}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-err" : undefined}
                  className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
                />
                {errors.message ? (
                  <p id="contact-message-err" className={styles.errorText} role="alert">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {errors.form ? (
                <div className={styles.formAlertError} role="alert">
                  {errors.form}
                </div>
              ) : null}

              {status === "success" ? (
                <div className={styles.formAlertSuccess} role="status">
                  <CheckCircle2 size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{serverNote}</span>
                </div>
              ) : null}

              <button
                type="submit"
                disabled={status === "submitting"}
                className={styles.submitButton}
              >
                {status === "submitting" ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          {/* Right Availability Panel */}
          <aside className={styles.darkPanel} aria-label="Availability and contact details">
            <img
              src={siteConfig.fluidDarkTexturePath}
              alt=""
              aria-hidden="true"
              className={styles.darkTexture}
            />
            <div className={styles.darkFade} aria-hidden="true" />

            <div className={styles.darkInner}>
              <div className={styles.panelTop}>
                <span className={styles.circleArrow} aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={2} />
                </span>
                <h2 className={styles.panelTitle}>{siteConfig.profile.availabilityStatus}</h2>
                <p className={styles.panelSubtitle}>{siteConfig.profile.availabilitySubtitle}</p>
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <Mail size={15} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <div className={styles.infoLabel}>Email</div>
                    <a href={`mailto:${siteConfig.profile.email}`} className={styles.infoValue}>
                      {siteConfig.profile.email}
                    </a>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <MapPin size={15} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <div className={styles.infoLabel}>Location</div>
                    <div className={styles.infoValue}>{siteConfig.profile.location}</div>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.infoIcon}>
                    <Clock size={15} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <div className={styles.infoLabel}>{siteConfig.profile.responseTimeLabel}</div>
                    <div className={styles.infoValue}>{siteConfig.profile.responseTime}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
