import type { Metadata } from "next"
import Link from "next/link"
import { articles } from "../lib/repository-articles"

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
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              VIDEO ROADMAP
            </p>
            <h2>公開予定</h2>
          </div>
          <p>記事ごとに10〜15分程度の技術解説を予定しています。</p>
        </div>
        <div className="video-plan-grid">
          {articles.map((article, index) => (
            <article className="video-plan-card" id={article.slug} key={article.slug}>
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
