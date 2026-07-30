import { existsSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const repositories = JSON.parse(readFileSync("app/data/repositories.json", "utf8"))
const queue = JSON.parse(readFileSync("app/data/video-production.json", "utf8"))
const policy = JSON.parse(readFileSync("app/data/content-policy.json", "utf8"))
const assetRoot = join("video-assets", "repositories")
const errors = []
const japanese = /[ぁ-んァ-ヶ一-龠々]/
const excluded = new Set((policy.excludedRepositories ?? []).map((name) => name.toLowerCase()))
const expectedCount = repositories.articles.filter((article) => article.slug !== "rakuten02").length

if (queue.videos.length !== expectedCount) {
  errors.push(`動画キューは${expectedCount}件必要ですが、${queue.videos.length}件です`)
}

for (const video of queue.videos) {
  if (excluded.has(video.slug.toLowerCase())) {
    errors.push(`${video.slug}: 公開除外リポジトリが動画キューに含まれています`)
  }
  if (video.slides?.length !== 6 || video.narration?.length !== 6) {
    errors.push(`${video.slug}: スライドとナレーションは各6件必要です`)
  }
  for (const [index, slide] of (video.slides ?? []).entries()) {
    if (!japanese.test(`${slide.title ?? ""}${slide.body ?? ""}`)) {
      errors.push(`${video.slug}: スライド${index + 1}に日本語がありません`)
    }
  }
  for (const [index, narration] of (video.narration ?? []).entries()) {
    if (!japanese.test(narration ?? "")) {
      errors.push(`${video.slug}: ナレーション${index + 1}に日本語がありません`)
    }
  }

  if (video.status !== "queued") {
    for (const extension of ["mp4", "pptx"]) {
      const path = join(assetRoot, video.slug, `${video.slug}-tech-preview.${extension}`)
      if (!existsSync(path) || statSync(path).size === 0) {
        errors.push(`${video.slug}: ${extension.toUpperCase()}素材がありません`)
      }
    }
  }
}

const queued = queue.videos.filter((video) => video.status === "queued").length
console.log(`リポジトリ動画: ${queue.videos.length}本 / 制作待ち: ${queued}本 / 除外違反: 0件`)
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}
