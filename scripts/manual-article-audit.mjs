import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const { articles } = JSON.parse(readFileSync(resolve("app/data/manual-articles.json"), "utf8"))
const errors = []
const slugs = new Set()
for (const article of articles) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug ?? "")) errors.push(`${article.slug ?? "(未設定)"}: slugの形式が不正です`)
  if (slugs.has(article.slug)) errors.push(`${article.slug}: slugが重複しています`)
  slugs.add(article.slug)
  for (const key of ["title", "description", "category", "publishedAt", "updatedAt"]) {
    if (!article[key]) errors.push(`${article.slug}: ${key}が未設定です`)
  }
  if (!Array.isArray(article.tags) || !article.tags.length) errors.push(`${article.slug}: tagsを1件以上設定してください`)
  if (!Array.isArray(article.sections) || !article.sections.length) errors.push(`${article.slug}: sectionsを1件以上設定してください`)
}
console.log(`手書き記事: ${articles.length}本 / 公開: ${articles.filter((article) => article.published).length}本`)
if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"))
  process.exit(1)
}
