import type { MetadataRoute } from "next"
import { articles } from "./lib/repository-articles"
import { manualArticles } from "./lib/manual-articles"
import { absoluteSiteUrl } from "./lib/site-url"
import { publishedVideos, videoWatchUrl } from "./lib/video-library"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteSiteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteSiteUrl("/beginner"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteSiteUrl("/articles"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteSiteUrl("/videos"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteSiteUrl("/videos/favorites"), changeFrequency: "weekly", priority: 0.75 },
    { url: absoluteSiteUrl("/store"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteSiteUrl("/crowdsourcing"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteSiteUrl("/portfolio"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteSiteUrl("/profile"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteSiteUrl("/career-support"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteSiteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteSiteUrl("/estimate"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteSiteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    ...articles.map((article) => ({
      url: absoluteSiteUrl(`/articles/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...manualArticles.map((article) => ({
      url: absoluteSiteUrl(`/articles/manual/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...publishedVideos.map(({ article }) => ({
      url: videoWatchUrl(article.slug),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ]
}
