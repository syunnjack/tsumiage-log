import type { MetadataRoute } from "next"
import { articles } from "./lib/repository-articles"
import { manualArticles } from "./lib/manual-articles"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://syunnjack.dev"
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/videos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/videos/favorites`, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/portfolio`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/profile`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/estimate`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.7 },
    ...articles.map((article) => ({
      url: `${base}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...manualArticles.map((article) => ({
      url: `${base}/articles/manual/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
