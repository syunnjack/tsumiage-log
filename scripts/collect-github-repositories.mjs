import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { localizeRepositoryArticle } from "./repository-content-ja.mjs"

const owner = "syunnjack"
const outputPath = resolve("app/data/repositories.json")
const contentPolicy = JSON.parse(
  readFileSync(resolve("app/data/content-policy.json"), "utf8"),
)
const excludedRepositories = new Set(contentPolicy.excludedRepositories)
const fallbackPrivateRepositoryCount = Number(contentPolicy.privateRepositoryCount ?? 0)
const previousArticlesByName = new Map()
try {
  const previousData = JSON.parse(readFileSync(outputPath, "utf8"))
  for (const article of previousData.articles ?? []) {
    previousArticlesByName.set(article.name, article)
  }
} catch {
  // 初回収集ではキャッシュを利用しません。
}
// 公開対象から除外する成人向け・機密性の高い可能性があるキーワード
const forbiddenTerms = [
  /fanza/i, /\bdmm\b/i, /\badult\b/i, /\bmature\b/i, /\br18\b/i,
  /sexy/i, /gravure/i, /doujin/i, /\bbl[-_ ]?tl\b/i, /duga/i, /sokmil/i,
  /hey[-_ ]?douga/i, /mgs[-_ ]?video/i,
  /(^|[-_\s])av([-_\s]|$)/i,
  /風俗/, /アダルト/, /成人向け/, /同人/, /グラビア/, /部外秘/, /社外秘/,
  /機密/, /\bconfidential\b/i,
]

// より厳密なチェック：説明やREADMEに明確なアダルトキーワードがある場合のみスキップ
function containsForbiddenContent(...values) {
  const searchable = values.flat().filter(Boolean).join(" ")
  return forbiddenTerms.some((pattern) => pattern.test(searchable))
}

function gh(args, fallback = null) {
  try {
    return JSON.parse(
      execFileSync("gh", args, {
        encoding: "utf8",
        maxBuffer: 20 * 1024 * 1024,
        stdio: ["ignore", "pipe", "pipe"],
      }),
    )
  } catch {
    return fallback
  }
}

function getPrivateRepositoryCount() {
  const result = gh([
    "api",
    "graphql",
    "-f",
    "query=query($login:String!){repositoryOwner(login:$login){repositories(first:1,ownerAffiliations:OWNER,privacy:PRIVATE){totalCount}}}",
    "-F",
    `login=${owner}`,
  ])
  const count = result?.data?.repositoryOwner?.repositories?.totalCount
  return Number.isInteger(count) ? count : fallbackPrivateRepositoryCount
}

function decodeReadme(payload) {
  if (!payload?.content) return ""
  return Buffer.from(payload.content.replace(/\n/g, ""), "base64")
    .toString("utf8")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`![\]()|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 900)
}

function humanize(name) {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Repository descriptions are published as reader-facing copy. Keep source
// wording useful while avoiding labels that make completed content look unfinished.
function normalizeReaderCopy(value) {
  return typeof value === "string"
    ? value
        .replaceAll("試作版", "紹介版")
        .replaceAll("公開予定", "公開情報")
        .replaceAll("プレビュー", "確認")
    : value
}

function normalizeArticleCopy(article) {
  return {
    ...article,
    description: normalizeReaderCopy(article.description),
    readmeExcerpt: normalizeReaderCopy(article.readmeExcerpt),
    commits: article.commits.map((commit) => ({
      ...commit,
      message: normalizeReaderCopy(commit.message),
    })),
  }
}

// `gh repo list` can silently return only a partial owner inventory.  Read every
// public owner-repository page directly instead, so a transient CLI listing does
// not remove already published articles and their video assets.
const repositoryPages = gh([
  "api",
  `users/${owner}/repos?type=owner&per_page=100`,
  "--paginate",
  "--slurp",
], [])
const repositories = (Array.isArray(repositoryPages) ? repositoryPages.flat() : []).map(
  (repo) => ({
    ...repo,
    isPrivate: repo.private,
    isFork: repo.fork,
    isArchived: repo.archived,
    primaryLanguage: repo.language ? { name: repo.language } : null,
    updatedAt: repo.updated_at,
    url: repo.html_url,
    defaultBranchRef: repo.default_branch ? { name: repo.default_branch } : null,
    stargazerCount: repo.stargazers_count,
    forkCount: repo.forks_count,
  }),
)
const publicRepositoryCount = repositories.filter((repo) => !repo.isPrivate).length
const privateRepositoryCount = getPrivateRepositoryCount()

const publishable = repositories.filter(
  (repo) =>
    !repo.isPrivate &&
    !repo.isFork &&
    !repo.isArchived &&
    repo.defaultBranchRef?.name &&
    !excludedRepositories.has(repo.name),
)

const skippedRepositories = []
const candidates = publishable.map((repo, index) => {
  const previousArticle = previousArticlesByName.get(repo.name)
  const previousUpdatedAt = Date.parse(previousArticle?.updatedAt ?? "")
  const repositoryUpdatedAt = Date.parse(repo.updatedAt ?? "")
  if (
    previousArticle &&
    previousArticle.commits?.length > 0 &&
    Number.isFinite(previousUpdatedAt) &&
    Number.isFinite(repositoryUpdatedAt) &&
    previousUpdatedAt >= repositoryUpdatedAt
  ) {
    return previousArticle
  }

  process.stdout.write(
    `[${String(index + 1).padStart(3, "0")}/${publishable.length}] ${repo.name}\n`,
  )

  // The owner index already supplies the current language and metadata.  Only
  // read the README for a newly changed repository: it is the policy-relevant
  // content and avoids hundreds of redundant API calls on every hourly run.
  const readme = gh(["api", `repos/${owner}/${repo.name}/readme`], null)
  const commits = gh(
    [
      "api",
      `repos/${owner}/${repo.name}/commits?per_page=12&sha=${repo.defaultBranchRef.name}`,
    ],
    [],
  )

  const languageList = repo.primaryLanguage?.name ? [repo.primaryLanguage.name] : []
  const commitList = commits.slice(0, 12).map((entry) => ({
    sha: entry.sha.slice(0, 7),
    message: entry.commit.message.split("\n")[0].slice(0, 180),
    date: entry.commit.author?.date ?? entry.commit.committer?.date ?? null,
    url: entry.html_url,
  }))
  const files = []

  if (commitList.length === 0) {
    skippedRepositories.push(repo.name)
    process.stdout.write(`[SKIP] ${repo.name}: empty repository\n`)
    return null
  }

  const summary =
    repo.description ||
    decodeReadme(readme).split(/[。.!?]/)[0] ||
    `${humanize(repo.name)}の設計と実装を記録したプロジェクト`
  const readmeExcerpt =
    repo.name === "tsumiage-log" ? summary : decodeReadme(readme)

  return localizeRepositoryArticle({
    slug: repo.name.toLowerCase(),
    name: repo.name,
    displayName: humanize(repo.name),
    description: summary.slice(0, 220),
    readmeExcerpt,
    url: repo.url,
    defaultBranch: repo.defaultBranchRef.name,
    primaryLanguage: repo.primaryLanguage?.name ?? languageList[0] ?? "未分類",
    languages: languageList,
    files,
    commits: commitList,
    updatedAt: repo.updatedAt,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
  })
})

const collected = candidates.filter(Boolean).map(normalizeArticleCopy).filter((article) => {
  if (!article) return false
  const forbidden = containsForbiddenContent(
    article.name,
    article.description,
    article.readmeExcerpt,
    ...article.commits.map((commit) => commit.message),
  )
  if (forbidden) {
    skippedRepositories.push(article.name)
    process.stdout.write(`[SKIP] ${article.name}: content policy\n`)
    return false
  }
  return true
})

let generatedAt = new Date().toISOString()
try {
  const previousData = JSON.parse(readFileSync(outputPath, "utf8"))
  if (JSON.stringify(previousData.articles) === JSON.stringify(collected)) {
    generatedAt = previousData.generatedAt
  }
} catch {
  // 初回生成時は現在時刻を使用します。
}

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(
  outputPath,
  `${JSON.stringify(
    {
      generatedAt,
      owner,
      totalRepositories: publicRepositoryCount + privateRepositoryCount,
      publicRepositories: publicRepositoryCount,
      privateRepositories: privateRepositoryCount,
      skippedRepositories,
      articles: collected,
    },
    null,
    2,
  )}\n`,
)

console.log(`Collected ${collected.length} repositories into ${outputPath}`)
console.log(`Skipped ${skippedRepositories.length} repositories by content policy`)
