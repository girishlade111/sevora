import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles } from "@/content/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const staticRoutes = ["/", "/about", "/projects", "/articles", "/contact", "/hero-sections"];
  const articleRoutes = articles.map((a) => `/articles/${a.slug}`);

  return [...staticRoutes, ...articleRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));
}
