import { readFileSync } from "node:fs"

const data = JSON.parse(readFileSync("app/data/favorite-videos.json", "utf8"))
const ids = new Set()
const urls = new Set()
const errors = []

for (const video of data.videos) {
  if (ids.has(video.id)) errors.push(`YouTube IDが重複しています: ${video.id}`)
  if (urls.has(video.sourceUrl)) errors.push(`元動画URLが重複しています: ${video.sourceUrl}`)
  ids.add(video.id)
  urls.add(video.sourceUrl)
  for (const field of ["title", "author", "category", "description", "selectionReason", "sourceUrl", "embedUrl"]) {
    if (!video[field]) errors.push(`${video.id}: ${field}がありません`)
  }
  if (!data.categories.some((category) => category.slug === video.category)) {
    errors.push(`${video.id}: 未定義のカテゴリです (${video.category})`)
  }
}

console.log(`お気に入り動画: ${data.videos.length}本 / カテゴリ: ${data.categories.length}件`)
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}
