import manualArticleData from "../data/manual-articles.json"

export type ManualArticleSection = {
  heading: string
  body: string[]
  code?: { language: string; content: string }
}

export type ManualArticle = {
  slug: string
  title: string
  description: string
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  published: boolean
  thumbnail?: string
  /** codoc の管理画面で発行される枠のID。設定した記事にだけ支援欄が出る */
  codocEntryId?: string
  /** 記事末尾に出す関連記事の slug。連載として読ませたい順に並べる */
  related?: string[]
  sections: ManualArticleSection[]
}

export const manualArticles = (manualArticleData.articles as ManualArticle[])
  .filter((article) => article.published)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const getManualArticle = (slug: string) =>
  manualArticles.find((article) => article.slug === slug)

/**
 * 記事末尾に出す関連記事。
 *
 * related に slug を並べてあればその順で返す。無ければ同じカテゴリから
 * 新しい順に補う。**自分自身と、非公開の記事は入らない。**
 */
export const relatedManualArticles = (article: ManualArticle, limit = 4) => {
  const picked: ManualArticle[] = []
  const seen = new Set([article.slug])

  for (const slug of article.related ?? []) {
    const found = manualArticles.find((item) => item.slug === slug)
    if (found && !seen.has(found.slug)) {
      picked.push(found)
      seen.add(found.slug)
    }
  }

  for (const item of manualArticles) {
    if (picked.length >= limit) break
    if (seen.has(item.slug) || item.category !== article.category) continue
    picked.push(item)
    seen.add(item.slug)
  }

  return picked.slice(0, limit)
}
