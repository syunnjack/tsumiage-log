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
  sections: ManualArticleSection[]
}

export const manualArticles = (manualArticleData.articles as ManualArticle[])
  .filter((article) => article.published)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const getManualArticle = (slug: string) =>
  manualArticles.find((article) => article.slug === slug)
