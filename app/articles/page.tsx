import type { Metadata } from "next"
import Link from "next/link"
import { articles, articleStats, formatDate } from "../lib/repository-articles"

export const metadata: Metadata = {
  title: "技術記事一覧 | 積み上げログ",
  description: "GitHubの公開リポジトリとコミット履歴を根拠に、設計、技術選定、実装の変遷を解説します。",
  alternates: { canonical: "/articles" },
}

export default function ArticlesPage() {
  return <main className="archive-page">
    <header className="article-site-header">
      <Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>TSUMIAGE LOG</small></span></Link>
      <Link href="/">ホームへ戻る</Link>
    </header>
    <section className="archive-hero">
      <p className="eyebrow"><span />REPOSITORY NOTES</p>
      <h1>技術記事一覧</h1>
      <p>公開リポジトリのコミット履歴を読み解き、プロジェクトごとの設計と実装を記録しています。</p>
      <dl><div><dt>公開記事</dt><dd>{articles.length}</dd></div><div><dt>確認したリポジトリ</dt><dd>{articleStats.totalRepositories}</dd></div></dl>
    </section>
    <section className="repository-grid" aria-label="技術記事">
      {articles.map((article, index) => <article className="repository-card" key={article.slug}>
        <div className="repository-card-meta"><span>{String(index + 1).padStart(3, "0")}</span><span>{article.primaryLanguage}</span></div>
        <h2><Link href={`/articles/${article.slug}`}>{article.displayName}の設計と実装</Link></h2>
        <p>{article.description}</p>
        <div className="repository-card-footer"><time>{formatDate(article.updatedAt)}</time><Link href={`/articles/${article.slug}`}>解説を読む →</Link></div>
      </article>)}
    </section>
  </main>
}
