import type { MetadataRoute } from "next"
import { articles } from "./lib/repository-articles"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://syunnjack.dev"
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/articles`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/videos`, changeFrequency: "weekly", priority: 0.8 },
    ...articles.map((article) => ({
      url: `${base}/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
