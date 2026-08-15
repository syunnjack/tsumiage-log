import repositoryData from "../data/repositories.json"
import contentPolicy from "../data/content-policy.json"

export type RepositoryArticle = {
  slug: string; name: string; displayName: string; description: string
  readmeExcerpt: string; url: string; defaultBranch: string
  primaryLanguage: string; languages: string[]; files: string[]
  commits: { sha: string; message: string; date: string | null; url: string }[]
  updatedAt: string; stars: number; forks: number
}

const excludedRepositories = new Set(contentPolicy.excludedRepositories)
const promptDebris = /\s+(?:Repository\s+(?:Recommended\s+repository\s+name|Name)|Domain\s+candidates?|(?:Confirmed|Canonical)\s+domain)\s*:?\s*[\s\S]*$/i
const cleanPublicCopy = (value: string) => value.replace(promptDebris, "").replace(/\s+/g, " ").trim()

export const articles = (repositoryData.articles as RepositoryArticle[])
  .filter((article) => !excludedRepositories.has(article.name))
  .map((article) => ({
    ...article,
    description: cleanPublicCopy(article.description),
    readmeExcerpt: cleanPublicCopy(article.readmeExcerpt),
  }))
export const articleStats = repositoryData
export const getArticle = (slug: string) =>
  articles.find((article) => article.slug === slug)
export const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(date))
    : "日付不明"

export function formatCommitMessage(message: string) {
  const normalized = message.toLowerCase()
  if (/[ぁ-んァ-ヶ一-龠々]/.test(message)) {
    return message
      .replace(/^add\s*[:：-]?\s*/i, "追加：")
      .replace(/^fix\s*[:：-]?\s*/i, "修正：")
      .replace(/^update\s*[:：-]?\s*/i, "更新：")
      .replace(/^improve\s*[:：-]?\s*/i, "改善：")
      .replace(/^remove\s*[:：-]?\s*/i, "削除：")
  }
  if (normalized.includes("initial")) return "プロジェクトの初期構成を作成"
  if (normalized.includes("readme") || normalized.includes("docs")) return "説明資料を更新"
  if (normalized.includes("test")) return "テストを追加・更新"
  if (normalized.includes("remove") || normalized.includes("delete")) return "不要な実装・設定を削除"
  if (normalized.includes("refactor")) return "コード構成を整理"
  if (normalized.includes("fix")) return "不具合や設定を修正"
  if (normalized.includes("improve") || normalized.includes("enhance")) return "実装と使いやすさを改善"
  if (normalized.includes("add") || normalized.includes("create")) return "機能・コンテンツを追加"
  if (normalized.includes("update") || normalized.includes("change")) return "実装・データを更新"
  if (normalized.includes("merge")) return "開発内容を統合"
  return "実装内容を更新"
}

export function inferArchitecture(article: RepositoryArticle) {
  const files = article.files.map((file) => file.toLowerCase())
  const result = []
  if (files.some((file) => file === "app" || file === "pages"))
    result.push("画面・ルーティング層")
  if (files.includes("components")) result.push("UIコンポーネント層")
  if (files.some((file) => ["api", "server", "worker", "services"].includes(file)))
    result.push("API・サーバー層")
  if (files.some((file) => ["db", "prisma", "drizzle", "supabase"].includes(file)))
    result.push("データ永続化層")
  if (files.includes("tests") || files.includes("test")) result.push("自動テスト")
  return result.length ? result : ["単一アプリケーション構成", "機能単位の責務分割"]
}
