import { existsSync, readFileSync, readdirSync } from "node:fs"
import { resolve } from "node:path"

const outDirectory = resolve("out")
const videoData = JSON.parse(readFileSync(resolve("app/data/video-production.json"), "utf8"))
const repositoryData = JSON.parse(readFileSync(resolve("app/data/repositories.json"), "utf8"))
const publishedSlugs = videoData.videos
  .filter((video) => video.localVideoUrl)
  .map((video) => video.slug)

const failures = []
const readOutput = (...candidates) => {
  const target = candidates.map((candidate) => resolve(outDirectory, candidate)).find(existsSync)
  if (!target) throw new Error(`出力ファイルが見つかりません: ${candidates.join(", ")}`)
  return readFileSync(target, "utf8")
}
const count = (source, pattern) => source.match(pattern)?.length ?? 0
const promptDebris = /Repository\s+(?:Recommended\s+repository\s+name|Name)|Domain\s+candidates?|(?:Confirmed|Canonical)\s+domain/i

if (!existsSync(outDirectory)) failures.push("out/ がありません。先に npm run build を実行してください")

if (failures.length === 0) {
  const sitemap = readOutput("sitemap.xml", "sitemap.xml/index.html")
  const robots = readOutput("robots.txt", "robots.txt/index.html")
  const listing = readOutput("videos/index.html")
  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])

  for (const url of sitemapUrls) {
    const path = new URL(url).pathname
    if (path !== "/" && !path.endsWith("/")) failures.push(`サイトマップURLの末尾スラッシュ不足: ${url}`)
  }

  // 視聴ページは noindex なので、動画サイトマップは出さない（2026-08-25）。
  // 申告だけ残ると、載らないURLを検索エンジンに出し続けることになる。
  if (robots.includes("video-sitemap.xml")) {
    failures.push("robots.txt が動画サイトマップを指しています。視聴ページは noindex なので出さないこと")
  }
  if (count(listing, /<video\b/g) !== 0) failures.push("動画一覧に video 要素が残っています")

  for (const article of repositoryData.articles) {
    const articlePage = readOutput(`articles/${article.slug}/index.html`)
    if (promptDebris.test(articlePage)) failures.push(`${article.slug}: 公開HTMLに生成プロンプト由来の文言があります`)
  }

  const watchDirectories = existsSync(resolve(outDirectory, "videos"))
    ? readdirSync(resolve(outDirectory, "videos"), { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && publishedSlugs.includes(entry.name))
        .map((entry) => entry.name)
    : []
  if (watchDirectories.length !== publishedSlugs.length) {
    failures.push(`視聴ページ数が不一致です: ${watchDirectories.length}/${publishedSlugs.length}`)
  }

  for (const slug of publishedSlugs) {
    const watchPage = readOutput(`videos/${slug}/index.html`)
    if (count(watchPage, /<video\b/g) !== 1) failures.push(`${slug}: 視聴ページの video 要素が1件ではありません`)
    if (!watchPage.includes('"@type":"VideoObject"')) failures.push(`${slug}: VideoObject がありません`)
    if (!watchPage.includes(`rel="canonical" href="https://syunnjack.dev/videos/${slug}/"`)) {
      failures.push(`${slug}: canonical URLが正しくありません`)
    }
    if (!watchPage.includes('"thumbnailUrl"') || !watchPage.includes('"contentUrl"')) {
      failures.push(`${slug}: VideoObject の必須URLが不足しています`)
    }
  }

  // 視聴ページは **通常サイトマップに載せない**。本文が450〜530字の同じ雛形で、
  // AdSense に「有用性の低いコンテンツ」と判定された原因だったため、
  // 2026-08-24 にページ側を noindex にし、サイトマップを356件→26件に絞った
  // （app/sitemap.ts のコメント参照）。ここは「入っていないこと」を守る検査。
  const watchSitemapEntries = sitemapUrls.filter((url) => new URL(url).pathname.startsWith("/videos/") && !["/videos/", "/videos/favorites/"].includes(new URL(url).pathname)).length
  if (watchSitemapEntries !== 0) {
    failures.push(`通常サイトマップに視聴ページが${watchSitemapEntries}件入っています。noindex にしたページなので載せないこと`)
  }
}

if (failures.length > 0) {
  console.error("検索インデックス監査に失敗しました。")
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log(`検索インデックス監査: ${publishedSlugs.length}本の視聴ページとURL正規化を確認しました`)
