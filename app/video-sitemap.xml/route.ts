import {
  absoluteVideoUrl,
  publishedVideos,
  videoThumbnailUrl,
  videoWatchUrl,
} from "../lib/video-library"

export const dynamic = "force-static"

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
}

export function GET() {
  const entries = publishedVideos.map(({ article, video, videoUrl }) => `  <url>
    <loc>${escapeXml(videoWatchUrl(article.slug))}</loc>
    <video:video>
      <video:thumbnail_loc>${escapeXml(videoThumbnailUrl(article.slug))}</video:thumbnail_loc>
      <video:title>${escapeXml(video.title)}</video:title>
      <video:description>${escapeXml(`${article.displayName}の目的、使用技術、設計、コミットによる改善を短時間で解説します。`)}</video:description>
      <video:content_loc>${escapeXml(absoluteVideoUrl(videoUrl))}</video:content_loc>
      <video:publication_date>${escapeXml(article.updatedAt)}</video:publication_date>
    </video:video>
  </url>`)

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${entries.join("\n")}
</urlset>
`

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  })
}
