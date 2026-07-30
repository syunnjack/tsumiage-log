import { readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const [, , slug, ...titleParts] = process.argv
const title = titleParts.join(" ").trim()
if (!slug || !title || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error('使い方: npm run manual:new -- article-slug "記事タイトル"')
  process.exit(1)
}

const path = resolve("app/data/manual-articles.json")
const data = JSON.parse(readFileSync(path, "utf8"))
if (data.articles.some((article) => article.slug === slug)) {
  console.error(`${slug}: 同じslugの記事が存在します`)
  process.exit(1)
}
const now = new Date().toISOString()
data.articles.unshift({
  slug,
  title,
  description: "この記事の内容が検索結果だけで伝わるように、概要を80〜120文字で記載します。",
  category: "学習記録",
  tags: ["技術ブログ"],
  publishedAt: now,
  updatedAt: now,
  published: false,
  sections: [
    { heading: "結論", body: ["最初に、この記事で伝えたい結論を書きます。"] },
    { heading: "背景と課題", body: ["なぜ取り組んだのか、どこで困ったのかを書きます。"] },
    { heading: "試したことと結果", body: ["実装、検証、失敗、判断理由を具体的に書きます。"] },
    { heading: "振り返り", body: ["学んだことと、次に改善したいことを書きます。"] }
  ]
})
writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`)
console.log(`下書きを作成しました: ${slug}`)
