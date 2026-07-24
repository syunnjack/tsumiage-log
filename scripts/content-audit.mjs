import { appendFileSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

const repositoryData = JSON.parse(
  readFileSync(resolve("app/data/repositories.json"), "utf8"),
)
const contentPolicy = JSON.parse(
  readFileSync(resolve("app/data/content-policy.json"), "utf8"),
)

const forbiddenTerms = [
  /fanza/i,
  /\bdmm\b/i,
  /\badult\b/i,
  /\bmature\b/i,
  /アダルト/,
  /成人向け/,
  /風俗/,
  /部外秘/,
  /社外秘/,
  /機密マニュアル/,
  /\bconfidential\b/i,
]
const excluded = new Set(contentPolicy.excludedRepositories)
const slugs = new Set()
const errors = []
const warnings = []

for (const article of repositoryData.articles) {
  if (excluded.has(article.name)) {
    errors.push(`${article.name}: 除外対象が記事データに含まれています`)
  }
  if (slugs.has(article.slug)) {
    errors.push(`${article.name}: slugが重複しています (${article.slug})`)
  }
  slugs.add(article.slug)

  const searchable = [
    article.name,
    article.description,
    ...article.commits.map((commit) => commit.message),
  ].join(" ")
  const matchedTerm = forbiddenTerms.find((pattern) => pattern.test(searchable))
  if (matchedTerm) {
    errors.push(`${article.name}: 公開禁止キーワードを検出しました (${matchedTerm})`)
  }
  if (!article.commits.length) {
    errors.push(`${article.name}: 根拠となるコミットがありません`)
  }
  if (!article.description || article.description.length < 20) {
    warnings.push(`${article.name}: 説明が短いため、手動加筆を推奨します`)
  }
  if (!article.languages.length) {
    warnings.push(`${article.name}: 使用言語を特定できませんでした`)
  }
}

const report = [
  "## Repository content audit",
  "",
  `- 公開記事: ${repositoryData.articles.length}`,
  `- 除外リポジトリ: ${contentPolicy.excludedRepositories.length}`,
  `- エラー: ${errors.length}`,
  `- 警告: ${warnings.length}`,
  `- 実行日時: ${new Date().toISOString()}`,
  "",
  ...(errors.length
    ? ["### Errors", ...errors.map((error) => `- ${error}`), ""]
    : []),
  ...(warnings.length
    ? ["### Warnings", ...warnings.map((warning) => `- ${warning}`), ""]
    : []),
].join("\n")

console.log(report)

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `article_count=${repositoryData.articles.length}\nwarning_count=${warnings.length}\n`,
  )
}
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${report}\n`)
}
if (errors.length) process.exit(1)
