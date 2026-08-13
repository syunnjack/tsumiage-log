import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"

const pageTitle = "ストア | 積み上げログ"
const pageDescription =
  "積み上げログの限定動画コンテンツ（BOOTHでの単品PPV購入）と、公開プロジェクトの紹介動画をまとめた販売・紹介プラットフォームです。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/store" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/store", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

interface StoreSlide {
  title: string
  body: string
}

interface StoreVideoBase {
  slug: string
  title: string
  description: string
  language: string
  repositoryUrl: string
  articleUrl: string
  freePreviewSlideCount: number
  slides: StoreSlide[]
  narration: string[]
}

interface PpvVideo extends StoreVideoBase {
  kind: "ppv"
  priceNote: string | null
  boothUrl: string | null
}

interface DemoVideo extends StoreVideoBase {
  kind: "demo"
  ctaLabel: string
  ctaUrl: string
}

type StoreVideo = PpvVideo | DemoVideo

export default function StorePage() {
  const allVideos = storeData.videos as StoreVideo[]
  const ppvVideos = allVideos.filter((video): video is PpvVideo => video.kind === "ppv")
  const demoVideos = allVideos.filter((video): video is DemoVideo => video.kind === "demo")

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ストア",
    description: pageDescription,
    url: "https://syunnjack.dev/store",
    author: {
      "@type": "Person",
      name: "知多丸",
      url: "https://syunnjack.dev/profile",
      sameAs: [
        "https://github.com/syunnjack",
        "https://note.com/chitamaru",
        "https://zenn.dev/chitamaru",
      ],
    },
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev" },
    numberOfItems: allVideos.length,
    hasPart: allVideos.map((video) => ({
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      contentUrl: resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`),
      thumbnailUrl: resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`),
      uploadDate: "2026-08-09",
      author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
      isAccessibleForFree: video.kind === "demo",
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "ストア", item: "https://syunnjack.dev/store" },
    ],
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "決済方法は何に対応していますか？",
        acceptedAnswer: { "@type": "Answer", text: "動画コンテンツ・ソフトウェア製品ともにBOOTHでの購入に対応します。クレジットカード、PayPay、コンビニ払い、キャリア決済など、BOOTHが対応する各種決済方法がご利用いただけます。" },
      },
      {
        "@type": "Question",
        name: "購入形式はどのような形ですか？",
        acceptedAnswer: { "@type": "Answer", text: "動画は単品PPV購入、ソフトウェア製品は買い切りです。サブスクリプション不要で、一度購入したソフトウェアは永続利用できます。" },
      },
      {
        "@type": "Question",
        name: "無料で見られる部分はありますか？",
        acceptedAnswer: { "@type": "Answer", text: "限定動画は導入部分を無料でご覧いただけます。時短レシピ支援アプリは /tools/recipe で無料お試し版を公開中です。" },
      },
      {
        "@type": "Question",
        name: "ソフトウェア製品の動作環境は？",
        acceptedAnswer: { "@type": "Answer", text: "SEO管理ダッシュボード ProはGoogleアカウントとNext.js環境が必要です。時短レシピ支援アプリは楽天APIキーとNext.js環境（Vercelなど）が必要です。" },
      },
    ],
  }

  return (
    <main className="store-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

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

      <section className="archive-hero store-hero">
        <p className="eyebrow">
          <span />
          ストア
        </p>
        <h1>
          導入は無料。
          <br />
          続きはPPVで。
        </h1>
        <p>
          積み上げログの限定動画コンテンツです。各作品の導入部分は無料でご覧いただけ、続きは
          BOOTHでの単品購入（PPV）でお楽しみいただけます。あわせて、公開プロジェクトの紹介動画も掲載しています。
        </p>
        <div className="store-payment-note">
          <span>決済</span>
          <strong>BOOTH</strong>
          <span>購入形式</span>
          <strong>PPV（単品購入）</strong>
        </div>
      </section>

      {ppvVideos.length > 0 && (
        <section className="store-video-grid">
          {ppvVideos.map((video) => (
            <article className="store-video-card" key={video.slug}>
              <video
                className="store-preview-video"
                controls
                preload="none"
                poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                aria-label={`${video.title}の無料紹介動画`}
              >
                <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
              </video>
              <div className="store-video-body">
                <span className="store-video-badge">無料紹介動画を公開中</span>
                <h2>{video.title}</h2>
                <p>{video.description}</p>

                {video.boothUrl && (
                  <a className="store-buy-button" href={video.boothUrl} target="_blank" rel="noopener noreferrer">
                    続きをBOOTHで購入する（PPV）
                  </a>
                )}
                {video.boothUrl && video.priceNote && <p className="store-price-note">{video.priceNote}</p>}
              </div>
            </article>
          ))}
        </section>
      )}

      {demoVideos.length > 0 && (
        <section className="store-demo-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                <span />
                プロジェクト紹介動画
              </p>
              <h2>公開プロジェクトを動画で紹介</h2>
            </div>
            <p>全編無料でご覧いただけます。気になったサービスは、紹介先のリンクからチェックできます。</p>
          </div>
          <div className="store-video-grid">
            {demoVideos.map((video) => (
              <article className="store-video-card" key={video.slug}>
                <video
                  className="store-preview-video"
                  controls
                  preload="none"
                  poster={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`)}
                  aria-label={`${video.title}の紹介動画`}
                >
                  <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
                </video>
                <div className="store-video-body">
                  <span className="store-video-badge store-video-badge-free">全編無料公開中</span>
                  <h2>{video.title}</h2>
                  <p>{video.description}</p>

                  {video.ctaUrl && (
                    <a className="store-buy-button" href={video.ctaUrl} target="_blank" rel="noopener noreferrer sponsored">
                      {video.ctaLabel ?? "サービスを見る"}
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ソフトウェア製品セクション */}
      <section className="store-demo-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              ソフトウェア製品
            </p>
            <h2>使えるツールをBOOTHで販売中</h2>
          </div>
          <p>買い切りの開発ツール・Webアプリです。BOOTHにて購入後すぐにご利用いただけます。</p>
        </div>
        <div className="store-video-grid">

          {/* SEO管理ダッシュボード Pro */}
          <article className="store-video-card">
            <div style={{ background: 'linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px 12px 0 0' }}>
              <div style={{ textAlign: 'center', color: 'white', padding: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔍</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>SEO管理ダッシュボード Pro</div>
                <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '6px' }}>Search Console + GA4 を一画面で</div>
              </div>
            </div>
            <div className="store-video-body">
              <span className="store-video-badge">ソフトウェア 買い切り</span>
              <h2>SEO管理ダッシュボード Pro</h2>
              <p>
                GoogleアカウントでログインするだけでSearch ConsoleとGA4の全プロパティを一画面に表示。
                サイトマップ送信・測定IDコピー・プロパティへの直接リンクが即座に行えます。
                100サイト以上を管理する方の作業時間を大幅に削減します。
              </p>
              <ul style={{ fontSize: '13px', color: '#555', marginTop: '12px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                <li>✅ 全SCプロパティを自動取得・一覧表示</li>
                <li>✅ GA4測定IDをワンクリックでコピー</li>
                <li>✅ サイトマップの確認・送信がその場で完結</li>
                <li>✅ Google OAuthによる安全な認証</li>
              </ul>
              <a
                className="store-buy-button"
                href="https://wangan-base.booth.pm/items/8713795"
                target="_blank"
                rel="noopener noreferrer"
              >
                BOOTHで購入する — ¥3,800
              </a>
              <p className="store-price-note">買い切り価格 ¥3,800（税込）| Google OAuthの設定が必要です</p>
            </div>
          </article>

          {/* 時短レシピ支援アプリ */}
          <article className="store-video-card">
            <div style={{ background: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px 12px 0 0' }}>
              <div style={{ textAlign: 'center', color: 'white', padding: '24px' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍳</div>
                <div style={{ fontSize: '18px', fontWeight: 'bold' }}>時短レシピ支援アプリ</div>
                <div style={{ fontSize: '13px', opacity: 0.85, marginTop: '6px' }}>30件の時短レシピ × 条件検索</div>
              </div>
            </div>
            <div className="store-video-body">
              <span className="store-video-badge">Webアプリ 買い切り</span>
              <h2>時短レシピ支援アプリ</h2>
              <p>
                10分前後で作れる時短レシピを、調理時間・調理器具・洗い物の少なさから探せます。
                材料、手順、カロリー、費用目安をまとめて確認できます。
              </p>
              <ul style={{ fontSize: '13px', color: '#555', marginTop: '12px', lineHeight: '2', listStyle: 'none', padding: 0 }}>
                <li>✅ 30件の時短レシピを収録</li>
                <li>✅ 時間・器具・カテゴリ・タグで検索</li>
                <li>✅ 材料・手順・カロリー・費用目安を表示</li>
                <li>✅ Recipe構造化データ・サイトマップ対応</li>
              </ul>
              <a
                className="store-buy-button"
                href="https://wangan-base.booth.pm/items/8713799"
                target="_blank"
                rel="noopener noreferrer"
              >
                BOOTHで購入する — ¥580
              </a>
              <p className="store-price-note">
                買い切り価格 ¥580（税込）|{" "}
                <Link href="/tools/recipe" style={{ color: '#f97316', textDecoration: 'underline' }}>無料で試す →</Link>
              </p>
            </div>
          </article>

        </div>
      </section>

      <section className="store-media-section" aria-labelledby="store-media-heading">
        <div className="section-heading">
          <p className="eyebrow">
            <span />
            外部メディア
          </p>
          <h2 id="store-media-heading">note・Zennでも発信しています</h2>
          <p>商品を選ぶ前の情報収集や、技術・開発の背景を知りたい方に向けた記事を公開しています。</p>
        </div>
        <div className="store-media-grid">
          <article className="store-media-card store-media-card-note">
            <span className="store-media-label">note</span>
            <h3>開発の経験や発信の試行錯誤を読む</h3>
            <p>
              個人開発や学習を続ける中で得た気づき、取り組みの背景、試行錯誤を読みやすく紹介しています。
            </p>
            <a href="https://note.com/chitamaru" target="_blank" rel="noopener noreferrer me">
              noteで記事を読む <span aria-hidden="true">↗</span>
            </a>
          </article>
          <article className="store-media-card store-media-card-zenn">
            <span className="store-media-label">Zenn</span>
            <h3>実装に役立つ技術記事を読む</h3>
            <p>
              開発で使った技術、実装時の判断、つまずきと解決方法など、エンジニア向けの知見をまとめています。
            </p>
            <a href="https://zenn.dev/chitamaru" target="_blank" rel="noopener noreferrer me">
              Zennで技術記事を読む <span aria-hidden="true">↗</span>
            </a>
          </article>
        </div>
      </section>

      <section className="store-faq">
        <h2>よくある質問</h2>
        <div className="store-faq-grid">
          {faqSchema.mainEntity.map((qa) => (
            <article key={qa.name}>
              <h3>{qa.name}</h3>
              <p>{qa.acceptedAnswer.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
