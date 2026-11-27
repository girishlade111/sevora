export type ProjectCategory =
  | "All projects"
  | "AI"
  | "Business"
  | "One page"
  | "Portfolio"
  | "Online course";

export interface ProjectRecord {
  id: string;
  slug: string;
  name: string;
  categories: Exclude<ProjectCategory, "All projects">[];
  thumbnailPath: string;
  externalUrl: string;
  internalRoute: string | null;
  featured: boolean;
  order: number;
  imageAlt: string;
  referenceVersion: string;
  licenseStatus: string;
  verificationStatus: "VERIFIED" | "BROWSER-MEASURED";
}

export type ArticleCategory =
  | "All articles"
  | "Web design"
  | "Product design"
  | "UI Design";

export type RichTextBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "quote"; text: string };

export interface ArticleRecord {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  authorId: string;
  category: Exclude<ArticleCategory, "All articles">;
  readingMinutes: number;
  publishedAt: string;
  updatedAt: string | null;
  coverPath: string;
  thumbnailPath: string;
  coverAlt: string;
  body: RichTextBlock[];
  relatedArticleIds: string[];
  order: number;
  contentRights: string;
  verificationStatus: "VERIFIED" | "BROWSER-MEASURED";
}

export interface AuthorProfile {
  id: string;
  name: string;
  role: string;
  avatarPath: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: "code" | "sparkles" | "compass";
  graphicStateIndex: number;
  order: number;
}

export interface ProcessPhase {
  id: string;
  step: number;
  title: string;
  description: string;
  iconName: "users" | "lightbulb" | "terminal" | "award" | "layers" | "search";
}

export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  iconName: "zap" | "wand" | "magnet" | "palette" | "trophy" | "crosshair" | "headphones" | "shield";
  variant: "light" | "dark";
  span: "single" | "wide";
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatarPath: string;
  linkLabel: string;
  externalUrl: string;
  variant: "dark" | "light";
}

export interface PricingPackage {
  id: string;
  name: string;
  description: string;
  amount: number;
  screenshotAmount: number;
  currency: string;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
  variant: "light" | "dark";
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface PrincipleItem {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: "sparkles" | "pencil" | "layers" | "target";
  featured?: boolean;
}

export interface ToolCategoryItem {
  id: string;
  number: string;
  category: string;
  toolsLabel: string;
  iconName: "pen" | "code" | "play";
}

export interface FloatingToolCardData {
  id: string;
  name: string;
  description: string;
  iconPath: string | null;
  href: string | null;
  featured?: boolean;
}
