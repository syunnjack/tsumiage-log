import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const repositoryData = JSON.parse(readFileSync(resolve("app/data/repositories.json"), "utf8"))
const policy = JSON.parse(readFileSync(resolve("app/data/content-policy.json"), "utf8"))
const excluded = new Set(policy.excludedRepositories)
const allowed = new Set(policy.allowedRepositories ?? [])
const forbidden = [/fanza/i, /\bdmm\b/i, /\badult\b/i, /\bmature\b/i, /アダルト/, /成人向け/, /部外秘/, /社外秘/, /機密/]
const start = new Date("2026-08-02T10:00:00+09:00")
const outputPath = resolve("app/data/video-production.json")
const previous = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, "utf8")) : { videos: [] }
const previousBySlug = new Map(previous.videos.map((video) => [video.slug, video]))

const videos = repositoryData.articles
  .filter((article) => article.slug !== "rakuten02")
  .filter((article) => !excluded.has(article.name))
  .filter((article) => allowed.has(article.name) || !forbidden.some((term) => term.test(`${article.name} ${article.description} ${article.readmeExcerpt ?? ""}`)))
  .map((article, index) => {
    const publishAt = new Date(start.getTime() + index * 24 * 60 * 60 * 1000)
    const languages = article.languages.length ? article.languages.join("・") : article.primaryLanguage
    const latest = article.commits[0]?.message ?? "継続的な改善"
    const prior = previousBySlug.get(article.slug) ?? {}
    const localVideoUrl = `/videos/repositories/${article.slug}/${article.slug}-tech-preview.mp4`
    const localPptxUrl = `/videos/repositories/${article.slug}/${article.slug}-tech-preview.pptx`
    const rendered = existsSync(resolve(`public${localVideoUrl}`))
    return {
      slug: article.slug,
      repository: article.name,
      title: `${article.displayName}の技術解説｜設計と実装を75秒で紹介`,
      description: article.description,
      language: languages,
      articleUrl: `https://syunnjack.dev/articles/${article.slug}`,
      repositoryUrl: article.url,
      youtubeDescription: [
        "技術ブログ『積み上げログ』は、学び、作り、振り返る開発記録です。GitHubリポジトリの設計、使用技術、コミット履歴から得られた知見を、記事と動画で分かりやすく紹介します。",
        "",
        `この記事を読む： https://syunnjack.dev/articles/${article.slug}`,
        "ブログトップ： https://syunnjack.dev/",
        `GitHub： ${article.url}`,
        "",
        article.description,
        "",
        `#技術解説 #個人開発 #${article.primaryLanguage.replace(/[^\p{L}\p{N}]/gu, "")}`,
      ].join("\n"),
      publishAt: publishAt.toISOString(),
      status: rendered ? "rendered" : (prior.status ?? "queued"),
      localVideoUrl: rendered ? localVideoUrl : (prior.localVideoUrl ?? null),
      localPptxUrl: rendered ? localPptxUrl : (prior.localPptxUrl ?? null),
      youtubeUrl: prior.youtubeUrl ?? null,
      narration: [
        `今回は、${article.displayName}の技術構成を短く解説します。`,
        `${article.description}`,
        `主な技術は${languages}です。役割を分け、保守しやすい構成を目指しています。`,
        `リポジトリでは、${article.files.slice(0, 3).join("、") || "主要なソースファイル"}を中心に実装を確認できます。`,
        `最近の変更では、${latest}という改善が行われました。`,
        `詳しい設計とコミット履歴は、技術ブログ積み上げログの記事で紹介しています。`,
      ],
    }
  })

const output = {
  generatedAt: new Date().toISOString(),
  policy: policy.policy,
  completed: [{ slug: "rakuten02", youtubeUrl: "https://youtu.be/mQ8Nl4Qk_io" }],
  queuedCount: videos.length,
  videos,
}

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")
console.log(`Video production queue: ${videos.length} repositories`)
