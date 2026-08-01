import type { Metadata } from "next"
import Link from "next/link"
import { manualArticles } from "../lib/manual-articles"
import { articles, articleStats, formatDate } from "../lib/repository-articles"

export const metadata: Metadata = {
  title: "技術記事一覧 | 積み上げログ",
  description: "自主執筆した技術記事と、公開GitHubリポジトリの実装・コミット履歴に基づく技術解説を掲載します。",
  alternates: { canonical: "/articles" },
}

export default function ArticlesPage() {
  return <main className="archive-page">
    <header className="article-site-header">
      <Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>技術ブログ</small></span></Link>
      <Link href="/">ホームへ戻る</Link>
    </header>
    <section className="archive-hero">
      <p className="eyebrow"><span />開発記録</p>
      <h1>技術記事一覧</h1>
      <p>自分の経験から書いた記事と、公開リポジトリの実装記録をまとめています。</p>
      <dl><div><dt>公開記事</dt><dd>{articles.length + manualArticles.length}</dd></div><div><dt>自主執筆</dt><dd>{manualArticles.length}</dd></div><div><dt>確認したリポジトリ</dt><dd>{articleStats.totalRepositories}</dd></div></dl>
    </section>
    <section className="repository-grid" aria-label="技術記事">
      {manualArticles.map((article, index) => <article className="repository-card manual-article-card" key={`manual-${article.slug}`}>
        <div className="repository-card-meta"><span>自主執筆 {String(index + 1).padStart(2, "0")}</span><span>{article.category}</span></div>
        <h2><Link href={`/articles/manual/${article.slug}`}>{article.title}</Link></h2>
        <p>{article.description}</p>
        <div className="manual-tags">{article.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="repository-card-footer"><time>{formatDate(article.updatedAt)}</time><Link href={`/articles/manual/${article.slug}`}>記事を読む →</Link></div>
      </article>)}
      {articles.map((article, index) => <article className="repository-card" key={article.slug}>
        <div className="repository-card-meta"><span>リポジトリ {String(index + 1).padStart(3, "0")}</span><span>{article.primaryLanguage}</span></div>
        <h2><Link href={`/articles/${article.slug}`}>{article.displayName}の設計と実装</Link></h2>
        <p>{article.description}</p>
        <div className="repository-card-footer"><time>{formatDate(article.updatedAt)}</time><Link href={`/articles/${article.slug}`}>解説を読む →</Link></div>
      </article>)}
    </section>
  </main>
}
