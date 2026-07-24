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
export const articles = (repositoryData.articles as RepositoryArticle[]).filter(
  (article) => !excludedRepositories.has(article.name),
)
export const articleStats = repositoryData
export const getArticle = (slug: string) =>
  articles.find((article) => article.slug === slug)
export const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(new Date(date))
    : "日付不明"

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
