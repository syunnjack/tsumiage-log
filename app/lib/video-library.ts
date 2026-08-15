import videoProduction from "../data/video-production.json"
import { articles } from "./repository-articles"
import { absoluteSiteUrl, canonicalPath } from "./site-url"
import { resolveVideoAssetUrl } from "./video-assets"

const articleBySlug = new Map(articles.map((article) => [article.slug, article]))

export const publishedVideos = videoProduction.videos.flatMap((video) => {
  const article = articleBySlug.get(video.slug)
  const resolvedVideoUrl = resolveVideoAssetUrl(video.localVideoUrl)
  if (!article || !resolvedVideoUrl) return []

  return [{ article, video, videoUrl: resolvedVideoUrl }]
})

const publishedVideoBySlug = new Map(publishedVideos.map((entry) => [entry.article.slug, entry]))

export function getPublishedVideo(slug: string) {
  return publishedVideoBySlug.get(slug)
}

export function videoWatchPath(slug: string) {
  return canonicalPath(`/videos/${slug}`)
}

export function videoWatchUrl(slug: string) {
  return absoluteSiteUrl(videoWatchPath(slug))
}

export function videoThumbnailUrl(slug: string) {
  return slug === "rakuten02"
    ? `${absoluteSiteUrl("/videos")}rakuten02-tech-preview.png`
    : `${absoluteSiteUrl("/")}og.png`
}

export function absoluteVideoUrl(videoUrl: string) {
  return videoUrl.startsWith("http") ? videoUrl : `${absoluteSiteUrl("/")}${videoUrl.replace(/^\//, "")}`
}
