import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const [slug, status, youtubeUrl = ""] = process.argv.slice(2)
if (!slug || !status) throw new Error("Usage: node scripts/update-video-status.mjs <slug> <status> [youtubeUrl]")

const path = resolve("app/data/video-production.json")
const data = JSON.parse(readFileSync(path, "utf8"))
const video = data.videos.find((entry) => entry.slug === slug)
if (!video) throw new Error(`Unknown video slug: ${slug}`)

video.status = status
if (youtubeUrl) video.youtubeUrl = youtubeUrl
video.updatedAt = new Date().toISOString()
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, "utf8")
console.log(`${slug}: ${status}${youtubeUrl ? ` (${youtubeUrl})` : ""}`)
