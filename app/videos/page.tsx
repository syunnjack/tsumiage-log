import type { Metadata } from "next"
import Link from "next/link"
import { VideoPlayer } from "../components/VideoPlayer"
import { articles } from "../lib/repository-articles"
import { resolveVideoAssetUrl } from "../lib/video-assets"
import videoProduction from "../data/video-production.json"

const pageTitle = "技術解説動画 | 積み上げログ"
const pageDescription =
  "積み上げログの技術記事を、設計図、コード、コミットの変化とともに学べる技術解説動画の一覧です。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/videos" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/videos", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

export default function VideosPage() {
  const videoBySlug = new Map(videoProduction.videos.map((video) => [video.slug, video]))
  const videoEntries = articles
    .map((article) => {
      const production = videoBySlug.get(article.slug)
      return {
        article,
        videoUrl:
          article.slug === "rakuten02"
            ? "/videos/rakuten02-tech-preview.mp4"
            : resolveVideoAssetUrl(production?.localVideoUrl),
        youtubeUrl:
          article.slug === "rakuten02"
            ? "https://youtu.be/mQ8Nl4Qk_io"
            : production?.youtubeUrl,
      }
    })
  const publishedVideos = videoEntries
    .flatMap((entry) => entry.videoUrl ? [{ ...entry, videoUrl: entry.videoUrl }] : [])
  const articleOnlyCount = articles.length - publishedVideos.length

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "技術解説動画",
    description: pageDescription,
    url: "https://syunnjack.dev/videos",
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev" },
    numberOfItems: publishedVideos.length,
    hasPart: publishedVideos.map(({ article, videoUrl }) => ({
      "@type": "VideoObject",
      name: `${article.displayName}の技術解説`,
      description: article.description,
      contentUrl: videoUrl,
      thumbnailUrl: article.slug === "rakuten02" ? "https://syunnjack.dev/videos/rakuten02-tech-preview.png" : undefined,
      uploadDate: article.updatedAt,
      author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "動画", item: "https://syunnjack.dev/videos" },
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
        <Link className="favorite-video-entry" href="/videos/favorites">
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
          {videoEntries.map(({ article, videoUrl, youtubeUrl }, index) => (
            <article className={`video-plan-card${videoUrl ? " is-published" : " is-article-only"}`} id={article.slug} key={article.slug}>
              {videoUrl ? <VideoPlayer fallbackHref={`/articles/${article.slug}`} poster={article.slug === "rakuten02" ? "/videos/rakuten02-tech-preview.png" : undefined} src={videoUrl} title={`${article.displayName}の技術解説`} /> : (
                <div className="video-placeholder video-placeholder-article-only" role="status" aria-label={`${article.displayName}の動画は掲載されていません`}>
                  <span>動画 {String(index + 1).padStart(3, "0")}</span>
                  <i>記事のみ</i>
                  <small>動画なし</small>
                </div>
              )}
              {youtubeUrl ? <a className="youtube-published-link" href={youtubeUrl}>YouTubeで見る ↗</a> : null}
              <p>{article.primaryLanguage}</p>
              <h2>{article.displayName}の技術解説</h2>
              <p>
                設計、使用技術、コミットによる実装の変化を画面とコードで解説します。
              </p>
              <div>
                <span>設計・実装・改善</span>
                <Link href={`/articles/${article.slug}`}>技術記事を読む →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
