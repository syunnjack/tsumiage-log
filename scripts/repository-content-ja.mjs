const japanesePattern = /[ぁ-んァ-ヶ一-龠々]/

export function hasJapaneseText(value) {
  return japanesePattern.test(value ?? "")
}

export function leadingEnglishLength(value) {
  const index = (value ?? "").search(japanesePattern)
  return index === -1 ? Number.POSITIVE_INFINITY : index
}

function technologyLabel(article) {
  const languages = article.languages?.filter(Boolean) ?? []
  if (languages.length) return languages.slice(0, 3).join("、")
  if (article.primaryLanguage && article.primaryLanguage !== "未分類") {
    return article.primaryLanguage
  }
  return "公開リポジトリの構成"
}

export function localizeRepositoryArticle(article) {
  const description = hasJapaneseText(article.description)
    ? article.description
    : `${article.displayName}は、${technologyLabel(article)}を中心に設計・実装したプロジェクトです。`
  const sourceExcerpt =
    leadingEnglishLength(article.readmeExcerpt) > 120
      ? article.readmeExcerpt.slice(leadingEnglishLength(article.readmeExcerpt)).trim()
      : article.readmeExcerpt
  const readmeExcerpt = hasJapaneseText(sourceExcerpt)
    ? sourceExcerpt
    : `${description} 公開されているファイル構成とコミット履歴から、使用技術の役割、実装の分け方、改善の過程を確認できます。`

  return { ...article, description, readmeExcerpt }
}
