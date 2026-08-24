import type { Metadata } from "next"
import Link from "next/link"
import { manualArticles } from "../lib/manual-articles"
import { articles, articleStats, formatDate } from "../lib/repository-articles"

const pageTitle = "技術記事一覧 | 積み上げログ"
const pageDescription = "自主執筆した技術記事と、公開GitHubリポジトリの実装・コミット履歴に基づく技術解説を掲載します。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/articles/" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/articles/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
    { "@type": "ListItem", position: 2, name: "技術記事一覧", item: "https://syunnjack.dev/articles/" },
  ],
}

export default function ArticlesPage() {
  return <main className="archive-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="article-site-header">
      <Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>技術ブログ</small></span></Link>
      <Link href="/">ホームへ戻る</Link>
    </header>
    <section className="archive-hero">
      <p className="eyebrow"><span />開発記録</p>
      <h1>技術記事一覧</h1>
      <p>自分の経験から書いた記事と、公開リポジトリの実装記録をまとめています。</p>
      <dl><div><dt>読み物</dt><dd>{manualArticles.length}</dd></div><div><dt>制作物の記録</dt><dd>{articles.length}</dd></div><div><dt>確認したリポジトリ</dt><dd>{articleStats.totalRepositories}</dd></div></dl>
    </section>
    <section className="repository-grid" aria-label="技術記事">
      <h2 className="article-section-heading">読み物</h2>
      <p className="article-section-note">
        実際に手を動かして詰まった点と、その解き方を書いたものです。
      </p>
      {manualArticles.map((article, index) => <article className="repository-card manual-article-card" key={`manual-${article.slug}`}>
        <div className="repository-card-meta"><span>自主執筆 {String(index + 1).padStart(2, "0")}</span><span>{article.category}</span></div>
        <h3><Link href={`/articles/manual/${article.slug}/`}>{article.title}</Link></h3>
        <p>{article.description}</p>
        <div className="manual-tags">{article.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="repository-card-footer"><time>{formatDate(article.updatedAt)}</time><Link href={`/articles/manual/${article.slug}/`}>記事を読む →</Link></div>
      </article>)}
      <h2 className="article-section-heading">制作物の記録</h2>
      <p className="article-section-note">
        公開している GitHub リポジトリの README とコミット履歴から、
        構成と変更の流れを機械的にまとめたものです。読み物ではなく、
        何をどう作ったかの記録として置いています。
      </p>
      {articles.map((article, index) => <article className="repository-card" key={article.slug}>
        <div className="repository-card-meta"><span>リポジトリ {String(index + 1).padStart(3, "0")}</span><span>{article.primaryLanguage}</span></div>
        <h3><Link href={`/articles/${article.slug}/`}>{article.displayName}の設計と実装</Link></h3>
        <p>{article.description}</p>
        <div className="repository-card-footer"><time>{formatDate(article.updatedAt)}</time><Link href={`/articles/${article.slug}/`}>解説を読む →</Link></div>
      </article>)}
    </section>
  </main>
}
