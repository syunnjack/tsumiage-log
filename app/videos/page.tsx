import type { Metadata } from "next"
import Link from "next/link"
import { articles } from "../lib/repository-articles"
import videoProduction from "../data/video-production.json"

export const metadata: Metadata = {
  title: "技術解説動画 | 積み上げログ",
  description:
    "積み上げログの技術記事を、設計図やコードを見ながら学べる解説動画の公開予定一覧です。",
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
            <small>TSUMIAGE LOG</small>
          </span>
        </Link>
        <Link href="/">ホームへ戻る</Link>
      </header>

      <section className="archive-hero video-hero">
        <p className="eyebrow">
          <span />
          EXPLANATION VIDEOS
        </p>
        <h1>
          記事を、
          <br />
          動画でも。
        </h1>
        <p>
          設計図、画面、コード、コミットの変化を見ながら理解できる解説動画を、
          2026年8月から順次公開します。
        </p>
        <div className="video-release-note">
          <span>COMING IN</span>
          <strong>2026.08</strong>
          <p>公開後、このページから各動画を視聴できるようになります。</p>
        </div>
      </section>

      <section className="video-plan-section">
        <Link className="favorite-video-entry" href="/videos/favorites">
          <div>
            <p>CURATED FAVORITES</p>
            <h2>気に入った動画</h2>
            <span>技術、F1、お笑い、犬猫、音楽など、実際に見て印象に残った動画を紹介します。</span>
          </div>
          <strong>お気に入りを見る →</strong>
        </Link>

        <div className="original-video-panel">
          <div>
            <p className="eyebrow">
              <span />
              ORIGINAL SERIES
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
                <small>企画中</small>
              </article>
            ))}
          </div>
        </div>

        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
            ARTICLE VIDEO ROADMAP
            </p>
            <h2>記事解説の公開予定</h2>
          </div>
          <p>記事ごとに10〜15分程度の技術解説を予定しています。</p>
        </div>
        <div className="video-plan-grid">
          {articles.map((article, index) => (
            <article className="video-plan-card" id={article.slug} key={article.slug}>
              {article.slug === "rakuten02" && <><video className="published-video" controls preload="metadata" poster="/videos/rakuten02-tech-preview.png" aria-label="Rakuten02の技術解説 試作版"><source src="/videos/rakuten02-tech-preview.mp4" type="video/mp4" /></video><a className="youtube-published-link" href="https://youtu.be/mQ8Nl4Qk_io">YouTubeで見る（8月1日公開）↗</a></>}
              {videoProduction.videos.find((video) => video.slug === article.slug)?.localVideoUrl && <video className="published-video" controls preload="metadata" aria-label={`${article.displayName}の技術解説 試作版`}><source src={videoProduction.videos.find((video) => video.slug === article.slug)?.localVideoUrl ?? undefined} type="video/mp4" /></video>}
              <div className="video-placeholder" aria-hidden="true">
                <span>VIDEO {String(index + 1).padStart(3, "0")}</span>
                <i>▶</i>
                <small>2026.08—</small>
              </div>
              <p>{article.primaryLanguage}</p>
              <h2>{article.displayName}の技術解説</h2>
              <p>
                設計、使用技術、コミットによる実装の変化を画面とコードで解説します。
              </p>
              <div>
                <span>公開準備中</span>
                <Link href={`/articles/${article.slug}`}>先に記事を読む →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
