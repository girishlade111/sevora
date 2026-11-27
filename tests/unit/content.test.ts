import { describe, expect, it } from "vitest";
import { PROJECT_CATEGORIES, projects } from "@/content/projects";
import { ARTICLE_CATEGORIES, articles } from "@/content/articles";
import { faqSection, pricingSection, servicesSection } from "@/content/home";

describe("Sevora content collections", () => {
  it("contains all 27 verified projects with unique slugs and valid thumbnails", () => {
    expect(projects).toHaveLength(27);
    const slugs = new Set(projects.map((p) => p.slug));
    expect(slugs.size).toBe(27);
    expect(projects.filter((p) => p.featured)).toHaveLength(6);
    for (const p of projects) {
      expect(p.thumbnailPath).toMatch(/^\/assets\//);
      expect(p.externalUrl).toMatch(/^https:\/\//);
    }
    expect(PROJECT_CATEGORIES).toHaveLength(6);
  });

  it("contains all 12 verified articles including legacy 2023 slug", () => {
    expect(articles).toHaveLength(12);
    const legacy = articles.find((a) => a.slug === "10-web-design-trends-to-watch-in-2023");
    expect(legacy).toBeDefined();
    expect(legacy?.title).toBe("Web Design Trends Shaping 2026");
    expect(legacy?.publishedAt).toBe("November 22, 2023");
    for (const a of articles) {
      expect(a.coverPath).toMatch(/^\/assets\//);
      expect(a.body.length).toBeGreaterThan(0);
      expect(a.relatedArticleIds.length).toBe(3);
    }
    expect(ARTICLE_CATEGORIES).toHaveLength(4);
  });

  it("exposes verified services, pricing discrepancy fixtures, and 8 FAQs", () => {
    expect(servicesSection.services).toHaveLength(3);
    expect(pricingSection.packages).toHaveLength(2);
    expect(pricingSection.packages[0].amount).toBe(1000);
    expect(pricingSection.packages[0].screenshotAmount).toBe(1200);
    expect(pricingSection.packages[1].amount).toBe(2400);
    expect(pricingSection.packages[1].screenshotAmount).toBe(2800);
    expect(faqSection.items).toHaveLength(8);
  });
});
