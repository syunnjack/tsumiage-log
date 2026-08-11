import type { MetadataRoute } from "next"
import { articles } from "./lib/repository-articles"
import { manualArticles } from "./lib/manual-articles"
import { RECIPE_CATEGORY_IDS } from "@/lib/rakuten-recipe"

export const dynamic = "force-static"

const BASE = "https://syunnjack.dev"

// next.config.ts sets trailingSlash: true, so the canonical form of every URL ends with "/".
function url(pathname: string) {
  return pathname === "/" ? `${BASE}/` : `${BASE}${pathname}/`
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/beginner"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/articles"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/videos"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/videos/favorites"), changeFrequency: "weekly", priority: 0.75 },
    { url: url("/store"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/portfolio"), changeFrequency: "weekly", priority: 0.9 },
    { url: url("/profile"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/career-support"), changeFrequency: "monthly", priority: 0.85 },
    { url: url("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/estimate"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: url("/tools/recipe"), changeFrequency: "weekly", priority: 0.8 },
    ...RECIPE_CATEGORY_IDS.map((categoryId) => ({
      url: url(`/tools/recipe/${categoryId}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...articles.map((article) => ({
      url: url(`/articles/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...manualArticles.map((article) => ({
      url: url(`/articles/manual/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
