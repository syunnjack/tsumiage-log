import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"

const pageTitle = "販売プラットフォーム | 積み上げログ"
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
    name: "販売プラットフォーム",
    description: pageDescription,
    url: "https://syunnjack.dev/store",
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
      { "@type": "ListItem", position: 2, name: "販売プラットフォーム", item: "https://syunnjack.dev/store" },
    ],
  }
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "決済方法は何に対応していますか？",
        acceptedAnswer: { "@type": "Answer", text: "限定動画（PPV）はBOOTHでの購入に対応します。BOOTHが対応する各種決済方法（クレジットカード、PayPal、キャリア決済など）がご利用いただけます。" },
      },
      {
        "@type": "Question",
        name: "購入形式はどのような形ですか？",
        acceptedAnswer: { "@type": "Answer", text: "動画ごとの単品購入（PPV）です。サブスクリプションではなく、見たい動画だけを都度購入する形式です。" },
      },
      {
        "@type": "Question",
        name: "無料で見られる部分はありますか？",
        acceptedAnswer: { "@type": "Answer", text: "はい。限定動画は導入部分を無料でご覧いただけます。プロジェクト紹介動画は全編無料で公開しています。" },
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
          販売プラットフォーム
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
                aria-label={`${video.title}の無料プレビュー`}
              >
                <source src={resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`)} type="video/mp4" />
              </video>
              <div className="store-video-body">
                <span className="store-video-badge">無料プレビュー公開中</span>
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
