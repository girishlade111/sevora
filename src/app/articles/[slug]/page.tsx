import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles } from "@/content/articles";
import { ArticleDetailView } from "@/components/articles/ArticleDetailView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return { title: "Article not found" };
  }
  return {
    title: article.title,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: "article",
      publishedTime: article.publishedAt,
      images: article.coverPath ? [{ url: article.coverPath }] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }
  return <ArticleDetailView article={article} />;
}
