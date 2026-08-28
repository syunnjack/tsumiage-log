import type { MetadataRoute } from "next"
import { manualArticles } from "./lib/manual-articles"
import { absoluteSiteUrl } from "./lib/site-url"

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
    { url: absoluteSiteUrl("/sites"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteSiteUrl("/profile"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteSiteUrl("/career-support"), changeFrequency: "monthly", priority: 0.85 },
    { url: absoluteSiteUrl("/services"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteSiteUrl("/estimate"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteSiteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteSiteUrl("/privacy"), changeFrequency: "yearly", priority: 0.5 },
    // リポジトリ記事（172本）はサイトマップに入れない。
    // README とコミットから機械的に作ったもので、同じ雛形が並ぶため
    // 検索エンジンに出す価値が薄い。ページ側でも noindex にしてある。
    // 制作物の一覧としては /portfolio から辿れる。
    ...manualArticles.map((article) => ({
      url: absoluteSiteUrl(`/articles/manual/${article.slug}`),
      lastModified: new Date(article.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    // 動画の個別ページ（168本）も入れない。本文が450〜530字しかなく、
    // 同じ雛形が並ぶため。動画は /videos の一覧から辿れる。
  ]
}
