import { execFileSync } from "node:child_process"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

const owner = "syunnjack"
const outputPath = resolve("app/data/repositories.json")
const contentPolicy = JSON.parse(
  readFileSync(resolve("app/data/content-policy.json"), "utf8"),
)
const excludedRepositories = new Set(contentPolicy.excludedRepositories)

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

const repositories = gh([
  "repo",
  "list",
  owner,
  "--limit",
  "200",
  "--json",
  "name,description,isPrivate,isFork,isArchived,primaryLanguage,updatedAt,url,defaultBranchRef,stargazerCount,forkCount",
], [])

const publishable = repositories.filter(
  (repo) =>
    !repo.isPrivate &&
    !repo.isFork &&
    !repo.isArchived &&
    repo.defaultBranchRef?.name &&
    !excludedRepositories.has(repo.name),
)

const collected = publishable.map((repo, index) => {
  process.stdout.write(
    `[${String(index + 1).padStart(3, "0")}/${publishable.length}] ${repo.name}\n`,
  )

  const commits = gh(
    [
      "api",
      `repos/${owner}/${repo.name}/commits`,
      "-f",
      "per_page=12",
      "-f",
      `sha=${repo.defaultBranchRef.name}`,
      "--method",
      "GET",
    ],
    [],
  )
  const languages = gh(["api", `repos/${owner}/${repo.name}/languages`], {})
  const contents = gh(["api", `repos/${owner}/${repo.name}/contents`], [])
  const readme = gh(["api", `repos/${owner}/${repo.name}/readme`], null)

  const languageList = Object.entries(languages)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
    .slice(0, 6)

  const commitList = commits.slice(0, 12).map((entry) => ({
    sha: entry.sha.slice(0, 7),
    message: entry.commit.message.split("\n")[0].slice(0, 180),
    date: entry.commit.author?.date ?? entry.commit.committer?.date ?? null,
    url: entry.html_url,
  }))

  const files = Array.isArray(contents)
    ? contents
        .map((entry) => entry.name)
        .filter((name) => !name.startsWith("."))
        .slice(0, 20)
    : []

  const summary =
    repo.description ||
    decodeReadme(readme).split(/[。.!?]/)[0] ||
    `${humanize(repo.name)}の設計と実装を記録したプロジェクト`

  return {
    slug: repo.name.toLowerCase(),
    name: repo.name,
    displayName: humanize(repo.name),
    description: summary.slice(0, 220),
    readmeExcerpt: decodeReadme(readme),
    url: repo.url,
    defaultBranch: repo.defaultBranchRef.name,
    primaryLanguage: repo.primaryLanguage?.name ?? languageList[0] ?? "未分類",
    languages: languageList,
    files,
    commits: commitList,
    updatedAt: repo.updatedAt,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
  }
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
      totalRepositories: repositories.length,
      publicRepositories: repositories.filter((repo) => !repo.isPrivate).length,
      articles: collected,
    },
    null,
    2,
  )}\n`,
)

console.log(`Collected ${collected.length} repositories into ${outputPath}`)
