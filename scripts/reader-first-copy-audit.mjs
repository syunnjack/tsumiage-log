import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { hasJapaneseText, leadingEnglishLength } from "./repository-content-ja.mjs"

const appDirectory = path.resolve("app")
// repositories.json is excluded: its readmeExcerpt fields quote other repos'
// own READMEs verbatim, so a phrase like "準備中" there describes that repo's
// code, not lazy copy on this site. Checking it here blocked every scheduled
// run whenever any collected README happened to contain a banned word.
const publicDataFiles = [
  "app/data/favorite-videos.json",
  "app/data/manual-articles.json",
  "app/data/video-production.json",
]
const prohibitedExpressions = [
  "試作版",
  "プレビュー",
  "公開準備中",
  "公開予定",
  "企画中",
  "準備中",
  "制作待ち",
  "COMING SOON",
  "COMING IN",
  "VIDEO EXPLANATION / PREVIEW",
  "順次公開",
  "公開後",
  "予定しています",
  "予定一覧",
  "準備ができ次第",
  "VIDEO EXPLANATION",
  "VIDEO LEARNING GUIDE",
  "REPOSITORY DEEP DIVE",
  "DEVELOPMENT NOTES",
  "ORIGINAL NOTE",
  "EXPLANATION VIDEOS",
  "LEARN WITH VIDEO",
  "CURATED FAVORITES",
  "ORIGINAL SERIES",
  "ARTICLE VIDEO LIBRARY",
  "QUICK ANSWER",
  "SELECTED VIDEOS",
  "BROWSE BY TOPIC",
  "SELECTION POLICY",
  "LEARNING IN PUBLIC",
  "BUILD / REFLECT / REPEAT",
  "SCROLL TO EXPLORE",
  "LATEST NOTES",
  "MY JOURNEY",
  "FEATURED PROJECT",
  "ABOUT THIS LOG",
]
const unfinishedReaderLabels = /試作版|公開予定|プレビュー/

async function collectSourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)
      if (entry.isDirectory()) {
        if (entry.name === "data") return []
        return collectSourceFiles(entryPath)
      }
      return /\.(?:tsx|ts)$/.test(entry.name) ? [entryPath] : []
    }),
  )
  return files.flat()
}

const violations = []

function inspectText(source, filePath) {
  for (const expression of prohibitedExpressions) {
    let searchFrom = 0
    while (searchFrom < source.length) {
      const index = source.indexOf(expression, searchFrom)
      if (index === -1) break
      const line = source.slice(0, index).split("\n").length
      violations.push(`${path.relative(process.cwd(), filePath)}:${line} ${expression}`)
      searchFrom = index + expression.length
    }
  }
}

for (const filePath of await collectSourceFiles(appDirectory)) {
  const source = await readFile(filePath, "utf8")
  inspectText(source, filePath)
}

for (const relativePath of publicDataFiles) {
  const filePath = path.resolve(relativePath)
  inspectText(await readFile(filePath, "utf8"), filePath)
}

const repositoryData = JSON.parse(
  await readFile(path.resolve("app/data/repositories.json"), "utf8"),
)
for (const article of repositoryData.articles) {
  if (!hasJapaneseText(article.description)) {
    violations.push(`app/data/repositories.json ${article.name}: 説明文が日本語ではありません`)
  }
  if (article.readmeExcerpt && !hasJapaneseText(article.readmeExcerpt)) {
    violations.push(`app/data/repositories.json ${article.name}: 本文概要が日本語ではありません`)
  }
  if (leadingEnglishLength(article.description) > 60) {
    violations.push(`app/data/repositories.json ${article.name}: 説明文が長い英語から始まっています`)
  }
  if (leadingEnglishLength(article.readmeExcerpt) > 120) {
    violations.push(`app/data/repositories.json ${article.name}: 本文概要が長い英語から始まっています`)
  }
  if (unfinishedReaderLabels.test(`${article.description}\n${article.readmeExcerpt}`)) {
    violations.push(`app/data/repositories.json ${article.name}: 未完成に見える読者向け表現があります`)
  }
}

if (violations.length > 0) {
  console.error("読者に不要な制作・公開都合の表現が見つかりました。")
  for (const violation of violations) console.error(`- ${violation}`)
  process.exit(1)
}

console.log("読者向け表現監査: 違反 0件")
