import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"
import { localizeRepositoryArticle } from "./repository-content-ja.mjs"

const dataPath = resolve("app/data/repositories.json")
const data = JSON.parse(readFileSync(dataPath, "utf8"))
let localized = 0

data.articles = data.articles.map((article) => {
  const next = localizeRepositoryArticle(article)
  if (
    next.description !== article.description ||
    next.readmeExcerpt !== article.readmeExcerpt
  ) {
    localized += 1
  }
  return next
})

writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`)
console.log(`リポジトリ記事の日本語化: ${localized}件`)
