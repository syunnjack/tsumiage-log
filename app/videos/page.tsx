import type { Metadata } from "next"
import Link from "next/link"
import { articles } from "../lib/repository-articles"
import { resolveVideoAssetUrl } from "../lib/video-assets"
import videoProduction from "../data/video-production.json"

export const metadata: Metadata = {
  title: "技術解説動画 | 積み上げログ",
  description:
    "積み上げログの技術記事を、設計図、コード、コミットの変化とともに学べる技術解説動画の一覧です。",
  alternates: { canonical: "/videos" },
}

export default function VideosPage() {
  return (
    <main className="videos-page">
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
          <strong>{articles.length}プロジェクト</strong>
          <p>記事と動画を行き来しながら、設計、実装、改善のつながりを確認できます。</p>
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
          {articles.map((article, index) => (
            <article className="video-plan-card" id={article.slug} key={article.slug}>
              {article.slug === "rakuten02" && <><video className="published-video" controls preload="metadata" poster="/videos/rakuten02-tech-preview.png" aria-label="Rakuten02の技術解説"><source src="/videos/rakuten02-tech-preview.mp4" type="video/mp4" /></video><a className="youtube-published-link" href="https://youtu.be/mQ8Nl4Qk_io">YouTubeで見る ↗</a></>}
              {videoProduction.videos.find((video) => video.slug === article.slug)?.localVideoUrl && <video className="published-video" controls preload="none" aria-label={`${article.displayName}の技術解説`}><source src={resolveVideoAssetUrl(videoProduction.videos.find((video) => video.slug === article.slug)?.localVideoUrl)} type="video/mp4" /></video>}
              <div className="video-placeholder" aria-hidden="true">
                <span>動画 {String(index + 1).padStart(3, "0")}</span>
                <i>▶</i>
                <small>設計・コード</small>
              </div>
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
