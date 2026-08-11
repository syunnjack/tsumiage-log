import { existsSync, readFileSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

const repositoryData = JSON.parse(readFileSync(resolve("app/data/repositories.json"), "utf8"))
const policy = JSON.parse(readFileSync(resolve("app/data/content-policy.json"), "utf8"))
const excluded = new Set(policy.excludedRepositories)
const allowed = new Set(policy.allowedRepositories ?? [])
const forbidden = [/fanza/i, /\bdmm\b/i, /\badult\b/i, /\bmature\b/i, /\br18\b/i, /sexy/i, /gravure/i, /\bbl[- ]tl\b/i, /duga/i, /sokmil/i, /アダルト/, /成人向け/, /部外秘/, /社外秘/, /機密/]
const start = new Date("2026-08-02T10:00:00+09:00")
const outputPath = resolve("app/data/video-production.json")
const previous = existsSync(outputPath) ? JSON.parse(readFileSync(outputPath, "utf8")) : { videos: [] }
const previousBySlug = new Map(previous.videos.map((video) => [video.slug, video]))
const japaneseText = /[\u3040-\u30ff\u3400-\u9fff]/

function summarizeProject(article) {
  if (japaneseText.test(article.description)) return article.description
  return `${article.displayName}の目的、構成、実装を公開コードから確認できるプロジェクトです。`
}

function summarizeCommit(message) {
  if (/fix|bug|repair|resolve/i.test(message)) {
    return "直近のコミットでは、不具合修正と安定性向上が行われました。"
  }
  if (/add|implement|create|feature/i.test(message)) {
    return "直近のコミットでは、新機能の追加と実装強化が行われました。"
  }
  if (/scaffold|initial|\binit\b/i.test(message)) {
    return "直近のコミットでは、プロジェクトの初期構成と開発基盤が整備されました。"
  }
  if (/update|improve|refactor|optimi[sz]e/i.test(message)) {
    return "直近のコミットでは、構成の更新と保守性の改善が行われました。"
  }
  return "直近のコミットでは、実装の見直しと継続的な改善が行われました。"
}

const videos = repositoryData.articles
  .filter((article) => article.slug !== "rakuten02")
  .filter((article) => !excluded.has(article.name))
  .filter((article) => allowed.has(article.name) || !forbidden.some((term) => term.test(`${article.name} ${article.description} ${article.readmeExcerpt ?? ""}`)))
  .map((article, index) => {
    const publishAt = new Date(start.getTime() + index * 24 * 60 * 60 * 1000)
    const languages = article.languages.length ? article.languages.join("・") : article.primaryLanguage
    const latest = article.commits[0]?.message ?? "継続的な改善"
    const projectSummary = summarizeProject(article)
    const commitSummary = summarizeCommit(latest)
    const prior = previousBySlug.get(article.slug) ?? {}
    const scheduledPublishAt = ["scheduled", "published"].includes(prior.status) && prior.publishAt
      ? prior.publishAt
      : publishAt.toISOString()
    const localVideoUrl = `/videos/repositories/${article.slug}/${article.slug}-tech-preview.mp4`
    const localPptxUrl = `/videos/repositories/${article.slug}/${article.slug}-tech-preview.pptx`
    const rendered = existsSync(resolve("video-assets", "repositories", article.slug, `${article.slug}-tech-preview.mp4`))
    return {
      slug: article.slug,
      repository: article.name,
      title: `${article.displayName}の技術解説｜設計と実装を75秒で紹介`,
      description: projectSummary,
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
        projectSummary,
        "",
        `#技術解説 #個人開発 #${article.primaryLanguage.replace(/[^\p{L}\p{N}]/gu, "")}`,
      ].join("\n"),
      slides: [
        { title: `${article.displayName}の技術解説`, body: "設計・実装・コミットから学ぶ短時間の技術解説" },
        { title: "このプロジェクトは何を解決する？", body: projectSummary },
        { title: "技術スタック", body: `主要技術：${languages}\n役割を分け、保守しやすい構成を目指しています。` },
        { title: "リポジトリの読みどころ", body: `公開コード、README、コミット履歴から設計判断を確認できます。\n主なファイル：${article.files.slice(0, 3).join("、") || "主要なソースファイル"}` },
        { title: "コミットから分かる改善", body: commitSummary },
        { title: "詳しくは積み上げログへ", body: `記事： https://syunnjack.dev/articles/${article.slug}\n\n学び、作り、振り返る開発記録。` },
      ],
      publishAt: scheduledPublishAt,
      status: ["scheduled", "published"].includes(prior.status)
        ? prior.status
        : (rendered ? "rendered" : (prior.status ?? "queued")),
      localVideoUrl: rendered ? localVideoUrl : (prior.localVideoUrl ?? null),
      localPptxUrl: rendered ? localPptxUrl : (prior.localPptxUrl ?? null),
      youtubeUrl: prior.youtubeUrl ?? null,
      narration: [
        `今回は、${article.displayName}の技術構成を短く解説します。`,
        projectSummary,
        `主な技術は${languages}です。役割を分け、保守しやすい構成を目指しています。`,
        `リポジトリでは、${article.files.slice(0, 3).join("、") || "主要なソースファイル"}を中心に実装を確認できます。`,
        commitSummary,
        `詳しい設計とコミット履歴は、技術ブログ積み上げログの記事で紹介しています。`,
      ],
    }
  })

const payload = {
  policy: policy.policy,
  completed: [{ slug: "rakuten02", youtubeUrl: "https://youtu.be/mQ8Nl4Qk_io" }],
  queuedCount: videos.length,
  videos,
}
const previousPayload = { ...previous }
delete previousPayload.generatedAt
const unchanged = JSON.stringify(previousPayload) === JSON.stringify(payload)
const output = {
  generatedAt: unchanged && previous.generatedAt ? previous.generatedAt : new Date().toISOString(),
  ...payload,
}

writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8")
console.log(`Video production queue: ${videos.length} repositories`)
