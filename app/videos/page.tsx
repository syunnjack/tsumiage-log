import type { Metadata } from "next"
import Link from "next/link"
import { articles } from "../lib/repository-articles"
import { canonicalPath } from "../lib/site-url"
import { publishedVideos, videoWatchPath, videoWatchUrl } from "../lib/video-library"

const pageTitle = "技術解説動画 | 積み上げログ"
const pageDescription =
  "積み上げログの技術記事を、設計図、コード、コミットの変化とともに学べる技術解説動画の一覧です。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/videos/" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/videos/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

export default function VideosPage() {
  const articleOnlyCount = articles.length - publishedVideos.length

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "技術解説動画",
    description: pageDescription,
    url: "https://syunnjack.dev/videos/",
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev/" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: publishedVideos.length,
      itemListElement: publishedVideos.map(({ article }, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${article.displayName}の技術解説動画`,
        url: videoWatchUrl(article.slug),
      })),
    },
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
      { "@type": "ListItem", position: 2, name: "動画", item: "https://syunnjack.dev/videos/" },
    ],
  }

  return (
    <main className="videos-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="article-site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">つ</span>
          <span>
            <strong>積み上げログ</strong>
            <small>技術ブログ</small>
          </span>
        </Link>
        <Link href="/">ホームへ戻る</Link>
      </header>

      <section className="archive-hero video-hero">
        <p className="eyebrow">
          <span />
          技術解説動画
        </p>
        <h1>
          記事を、
          <br />
          動画でも。
        </h1>
        <p>
          設計図、画面、コード、コミットの変化を見ながら、
          実装の要点と判断の流れを短時間で理解できます。
        </p>
        <div className="video-release-note">
          <span>動画で学ぶ</span>
          <strong>{publishedVideos.length}本公開中</strong>
          <p>{articleOnlyCount > 0 ? `${articleOnlyCount}件は記事のみ掲載しています。動画がある項目だけ再生ボタンを表示します。` : `全${articles.length}プロジェクトの解説動画を公開しています。`}</p>
        </div>
      </section>

      <section className="video-plan-section">
        <Link className="favorite-video-entry" href="/videos/favorites/">
          <div>
            <p>おすすめ動画</p>
            <h2>気に入った動画</h2>
            <span>技術、F1、お笑い、犬猫、音楽など、実際に見て印象に残った動画を紹介します。</span>
          </div>
          <strong>お気に入りを見る →</strong>
        </Link>

        <div className="original-video-panel">
          <div>
            <p className="eyebrow">
              <span />
              オリジナルシリーズ
            </p>
            <h2>記事にとらわれない、動画だけの学び。</h2>
            <p>
              基礎解説、開発環境、学習方法、制作の裏側など、特定の記事に紐づかない動画も公開します。
            </p>
          </div>
          <div className="original-series-grid">
            {[
              ["01", "React・Web開発入門", "基礎から小さなアプリを完成させるシリーズ"],
              ["02", "Git・GitHub実践", "コミット、ブランチ、PRを実際の流れで解説"],
              ["03", "開発環境とツール", "Vite、エディタ、Lint、デプロイの整え方"],
              ["04", "学習と振り返り", "挫折を減らし、知識を定着させる学び方"],
              ["05", "制作の裏側", "企画から公開までの判断と失敗を記録"],
            ].map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <small>学習テーマ</small>
              </article>
            ))}
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
            記事解説動画
            </p>
            <h2>リポジトリ別の技術解説</h2>
          </div>
          <p>設計、技術選定、コミット履歴の要点をプロジェクトごとに確認できます。</p>
        </div>
        <div className="video-plan-grid">
          {publishedVideos.map(({ article, video }, index) => (
            <article className="video-plan-card is-published" id={article.slug} key={article.slug}>
              <Link className="video-watch-preview" href={videoWatchPath(article.slug)} aria-label={`${article.displayName}の技術解説動画を再生`}>
                <span>動画 {String(index + 1).padStart(3, "0")}</span>
                <strong aria-hidden="true">▶</strong>
                <small>約75秒で見る</small>
              </Link>
              {video.youtubeUrl ? <a className="youtube-published-link" href={video.youtubeUrl}>YouTubeで見る ↗</a> : null}
              <p>{article.primaryLanguage}</p>
              <h2>{article.displayName}の技術解説</h2>
              <p>
                設計、使用技術、コミットによる実装の変化を画面とコードで解説します。
              </p>
              <div>
                <span>設計・実装・改善</span>
                <Link href={canonicalPath(`/articles/${article.slug}`)}>技術記事を読む →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
