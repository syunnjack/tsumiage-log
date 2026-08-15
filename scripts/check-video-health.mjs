import { readFileSync } from "node:fs"

const production = JSON.parse(readFileSync("app/data/video-production.json", "utf8"))
const revision = process.env.VIDEO_ASSET_REVISION?.trim() || process.env.GITHUB_SHA?.trim() || "main"
const cdnBase = `https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@${revision}/video-assets`
const concurrency = 8

const targets = [
  { slug: "rakuten02", url: "https://syunnjack.dev/videos/rakuten02-tech-preview.mp4" },
  ...production.videos
    .filter((video) => video.slug !== "rakuten02" && video.localVideoUrl)
    .map((video) => ({
      slug: video.slug,
      url: video.localVideoUrl.startsWith("/videos/repositories/")
        ? `${cdnBase}${video.localVideoUrl.slice("/videos".length)}`
        : video.localVideoUrl,
    })),
]

const results = []
let cursor = 0

async function check({ slug, url }) {
  let lastError = "unknown error"

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { Range: "bytes=0-1", "User-Agent": "tsumiage-log-video-health/1.0" },
        redirect: "follow",
        signal: AbortSignal.timeout(20_000),
      })
      const contentType = response.headers.get("content-type") ?? ""
      await response.body?.cancel()
      if (response.ok && contentType.startsWith("video/")) {
        return { slug, url, ok: true, status: response.status, contentType }
      }
      lastError = `HTTP ${response.status} / ${contentType || "content-typeなし"}`
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
    }

    if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1_000))
  }

  return { slug, url, ok: false, error: lastError }
}

async function worker() {
  while (cursor < targets.length) {
    const target = targets[cursor]
    cursor += 1
    results.push(await check(target))
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()))

const failures = results.filter((result) => !result.ok)
console.log(`動画URL確認: ${results.length}本 / 正常: ${results.length - failures.length}本 / 異常: ${failures.length}本`)

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure.slug}: ${failure.error}\n  ${failure.url}`).join("\n"))
  process.exit(1)
}
