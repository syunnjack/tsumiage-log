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
  sections: ManualArticleSection[]
}

export const manualArticles = (manualArticleData.articles as ManualArticle[])
  .filter((article) => article.published)
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const getManualArticle = (slug: string) =>
  manualArticles.find((article) => article.slug === slug)
