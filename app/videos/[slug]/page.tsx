import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { VideoPlayer } from "../../components/VideoPlayer"
import { formatDate } from "../../lib/repository-articles"
import {
  absoluteVideoUrl,
  getPublishedVideo,
  publishedVideos,
  videoThumbnailUrl,
  videoWatchPath,
  videoWatchUrl,
} from "../../lib/video-library"

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false
export const generateStaticParams = () => publishedVideos.map(({ article }) => ({ slug: article.slug }))

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const entry = getPublishedVideo((await params).slug)
  if (!entry) return {}

  const { article, video } = entry
  const title = `${article.displayName} 技術解説動画｜${article.primaryLanguage}の構成と改善`
  const description = `${article.displayName}の目的、使用技術、設計、コミットによる改善を短い動画で解説します。動画の下から詳しい技術記事と公開リポジトリも確認できます。`
  const url = videoWatchPath(article.slug)
  const image = videoThumbnailUrl(article.slug)

  // 動画ページは本文が450〜530字しかなく、168本が同じ雛形で並ぶ。
  // AdSense に「有用性の低いコンテンツ」と判定された（2026-08-21）ため、
  // 検索エンジンには載せない。動画自体は /videos から辿れる。
  return {
    title: `${title} | 積み上げログ`,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: url },
    openGraph: { title, description, type: "video.other", url, images: [image], videos: [absoluteVideoUrl(entry.videoUrl)] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
    keywords: [...video.tags.slice(0, 8), article.displayName, article.primaryLanguage],
  }
}

export default async function VideoWatchPage({ params }: Props) {
  const entry = getPublishedVideo((await params).slug)
  if (!entry) notFound()

  const { article, video, videoUrl } = entry
  const watchUrl = videoWatchUrl(article.slug)
  // このページは noindex（AdSense 対策で168本まとめて外した／2026-08-21）。
  // 検索に載せられないページに VideoObject を出しても Google は動画を確認できず、
  // Search Console の「動画が視聴ページに表示されない」が消えないまま残る。
  // 構造化データは出さず、プレイヤーだけ置く。動画は /videos/ から辿れる。
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
      { "@type": "ListItem", position: 2, name: "技術解説動画", item: "https://syunnjack.dev/videos/" },
      { "@type": "ListItem", position: 3, name: `${article.displayName}の技術解説`, item: watchUrl },
    ],
  }

  return (
    <main className="video-watch-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <header className="article-site-header">
        <Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>技術ブログ</small></span></Link>
        <Link href="/videos/">動画一覧へ</Link>
      </header>
      <article className="video-watch-content">
        <header>
          <p className="eyebrow"><span />技術解説動画</p>
          <h1>{article.displayName}の技術解説</h1>
          <p>{article.description}</p>
        </header>
        <VideoPlayer
          className="video-watch-player"
          fallbackHref={`/articles/${article.slug}/`}
          poster={article.slug === "rakuten02" ? "/videos/rakuten02-tech-preview.png" : "/og.png"}
          preload="metadata"
          src={videoUrl}
          title={`${article.displayName}の技術解説`}
        />
        <div className="video-watch-meta">
          <span>{article.primaryLanguage}</span>
          <span>更新: {formatDate(article.updatedAt)}</span>
          <span>約75秒</span>
        </div>
        <section>
          <h2>この動画で分かること</h2>
          <ul>
            <li>{article.displayName}が解決する課題と目的</li>
            <li>{article.primaryLanguage}を中心にした技術構成と役割分担</li>
            <li>公開コミットから読み取れる実装と改善の流れ</li>
          </ul>
        </section>
        <section className="video-watch-links">
          <h2>詳しい設計と一次情報</h2>
          <p>動画の要点を、構成・コミット履歴・FAQとあわせて技術記事で確認できます。</p>
          <div>
            <Link className="button primary" href={`/articles/${article.slug}/`}>技術記事を読む →</Link>
            <a className="button secondary" href={article.url}>GitHubリポジトリを見る ↗</a>
          </div>
        </section>
      </article>
    </main>
  )
}
