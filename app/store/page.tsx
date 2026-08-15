import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"
import { boothItemUrl, boothShopUrl, fanboxUrl } from "../lib/store-links"

const pageTitle = "ストア | 積み上げログ"
const pageDescription =
  "個人向けのBOOTH商品・note・Zennの記事と、企業向けの業務自動化・システム開発支援をまとめた積み上げログのストアです。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/store/" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/store/", images: ["/og.png"] },
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

const businessProducts = [
  {
    name: "SUKIMA INSIGHT",
    category: "分析SaaS",
    repository: "sukima-insight",
    description: "GitHubリポジトリとWeb・PWA・モバイルアプリのアクセス、CTR、CVR、売上、改善施策を横断管理します。",
    features: ["KPI・ファネル比較", "マルチテナント集計API", "GitHubリポジトリ同期"],
  },
  {
    name: "miseoshi",
    category: "店舗DX・会員管理",
    repository: "miseoshi-app",
    description: "モバイル会員証、来店スタンプ、会員ランク、クーポン、店舗向け会員管理を一つの基盤で提供します。",
    features: ["モバイル会員証", "来店・スタンプ管理", "業態に合わせた設定"],
  },
  {
    name: "miseoshi 順番受付",
    category: "店舗受付システム",
    repository: "miseoshi-web",
    description: "店舗検索、待ち時間表示、スマートフォンでの順番受付、受付後の進行確認を一連の流れにします。",
    features: ["リアルタイム待ち時間", "スマホ順番受付", "受付状況の進行表示"],
  },
  {
    name: "Wait Time Alert",
    category: "施設向けSaaS",
    repository: "wait-time-alert",
    description: "病院・役所・民間施設の待ち時間や整理券情報を通知し、利用者の待機負担と受付対応を改善します。",
    features: ["待ち時間通知", "整理券・QR連携構想", "LINE・メール・Slack通知"],
  },
  {
    name: "Subsidy Alert Hub",
    category: "情報収集・期限通知",
    repository: "subsidy-alert-hub",
    description: "補助金、助成金、公募、自治体募集の期限をまとめ、対象情報の見逃し防止と相談導線を支援します。",
    features: ["募集情報の集約", "期限アラート", "法人プラン対応構想"],
  },
  {
    name: "Local Alert Radar",
    category: "地域情報自動配信",
    repository: "local-alert-radar",
    description: "開店・閉店・移転・休業・求人・災害などの地域情報を集約し、LINEやXへの配信につなげます。",
    features: ["地域情報の集約", "LINE・X配信構想", "店舗掲載・地域PR導線"],
  },
] as const

export default function StorePage() {
  const allVideos = storeData.videos as StoreVideo[]
  const ppvVideos = allVideos.filter((video): video is PpvVideo => video.kind === "ppv")
  const demoVideos = allVideos.filter((video): video is DemoVideo => video.kind === "demo")

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "ストア",
    description: pageDescription,
    url: "https://syunnjack.dev/store/",
    author: {
      "@type": "Person",
      name: "知多丸",
      url: "https://syunnjack.dev/profile/",
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
      { "@type": "ListItem", position: 2, name: "ストア", item: "https://syunnjack.dev/store/" },
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
          学びと仕事を、
          <br />
          技術でもっと前へ。
        </h1>
        <p>
          個人で学びや開発を進めたい方には、BOOTHの商品とnote・Zennの記事を。
          業務改善を進めたい企業・事業者の方には、自動化やシステム開発の支援をご案内します。
        </p>
        <div className="store-audience-links" aria-label="ストア内メニュー">
          <a href="#personal">個人向けの商品・記事</a>
          <a href="#business">企業向けの業務支援</a>
        </div>
      </section>

      <section id="personal" className="store-audience-section store-personal-section" aria-labelledby="personal-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />個人向け</p>
            <h2 id="personal-heading">購入する・学ぶ・実装に活かす</h2>
          </div>
          <p>すぐに使える商品と、開発や学習に役立つ記事を、目的に合わせて選べます。</p>
        </div>
        <div className="store-channel-grid">
          <article className="store-channel-card store-channel-booth">
            <span className="store-media-label">BOOTH</span>
            <h3>動画・ツールを購入する</h3>
            <p>限定解説動画や買い切りのソフトウェアを販売しています。商品ごとの無料紹介も確認できます。</p>
            <a href={boothShopUrl} target="_blank" rel="noopener noreferrer">BOOTHストアを見る <span aria-hidden="true">↗</span></a>
          </article>
          {/* pixivFANBOX は未設定のあいだ出さない。開設前のリンクは行き止まりになるため */}
          {fanboxUrl && (
            <article className="store-channel-card store-channel-fanbox">
              <span className="store-media-label">pixivFANBOX</span>
              <h3>毎月の更新を支える</h3>
              <p>開発の記録を続けるための月額支援です。支援者の方には、記事や動画にする前の途中経過をお届けします。</p>
              <a href={fanboxUrl} target="_blank" rel="noopener noreferrer me">FANBOXで支援する <span aria-hidden="true">↗</span></a>
            </article>
          )}
          <article className="store-channel-card store-channel-note">
            <span className="store-media-label">note</span>
            <h3>経験や試行錯誤を読む</h3>
            <p>個人開発や学習を続ける中で得た気づき、取り組みの背景を読みやすく紹介しています。</p>
            <a href="https://note.com/chitamaru" target="_blank" rel="noopener noreferrer me">noteで記事を読む <span aria-hidden="true">↗</span></a>
          </article>
          <article className="store-channel-card store-channel-zenn">
            <span className="store-media-label">Zenn</span>
            <h3>実装に役立つ技術記事を読む</h3>
            <p>使用した技術、実装時の判断、つまずきと解決方法など、エンジニア向けの知見をまとめています。</p>
            <a href="https://zenn.dev/chitamaru" target="_blank" rel="noopener noreferrer me">Zennで技術記事を読む <span aria-hidden="true">↗</span></a>
          </article>
        </div>
      </section>

      <div className="store-subsection-heading">
        <p className="eyebrow"><span />BOOTHの商品</p>
        <h2>限定動画・ソフトウェア</h2>
        <p>紹介内容を確認してから、BOOTHで商品を購入できます。</p>
      </div>

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
                href={boothItemUrl(8713795) ?? boothShopUrl}
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
                href={boothItemUrl(8713799) ?? boothShopUrl}
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

      <section id="business" className="store-audience-section store-business-section" aria-labelledby="business-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />企業・事業者向け</p>
            <h2 id="business-heading">業務自動化・システム開発を支援</h2>
          </div>
          <p>全リポジトリを確認し、法人・店舗・施設の業務改善に活用できる既存システムを選定しました。</p>
        </div>
        <div className="store-business-grid">
          {businessProducts.map((product, index) => (
            <article key={product.repository}>
              <div className="store-business-card-heading">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <small>{product.category}</small>
              </div>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <ul>
                {product.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="store-business-card-actions">
                <Link href={`/articles/${product.repository}/`}>技術・機能を確認する</Link>
                <Link className="store-business-purchase" href={`/estimate?service=${encodeURIComponent(product.name)}`}>
                  導入見積りへ進む
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="store-business-cta">
          <div>
            <strong>既存システムを業務に合わせて導入・調整します。</strong>
            <p>見積依頼は非公開フォームで受け付け、要件・導入範囲・費用を個別にご案内します。</p>
          </div>
          <div className="store-business-actions">
            <Link className="store-buy-button" href="/estimate">見積りを依頼する</Link>
            <Link className="store-secondary-button" href="/contact">相談・問い合わせをする</Link>
          </div>
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
