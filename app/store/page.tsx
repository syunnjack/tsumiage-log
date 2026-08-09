import type { Metadata } from "next"
import Link from "next/link"
import storeData from "../data/store-videos.json"
import { resolveVideoAssetUrl } from "../lib/video-assets"

const pageTitle = "販売プラットフォーム | 積み上げログ"
const pageDescription =
  "積み上げログの限定動画コンテンツを、単品PPV（都度課金）でBOOTHから購入できる販売プラットフォームです。導入部分は無料でご覧いただけます。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/store" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/store", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

export default function StorePage() {
  const videos = storeData.videos

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "販売プラットフォーム",
    description: pageDescription,
    url: "https://syunnjack.dev/store",
    isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev" },
    numberOfItems: videos.length,
    hasPart: videos.map((video) => ({
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      contentUrl: resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.mp4`),
      thumbnailUrl: resolveVideoAssetUrl(`/videos/store/${video.slug}/${video.slug}-preview.png`),
      uploadDate: "2026-08-09",
      author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
      isAccessibleForFree: false,
      hasPart: {
        "@type": "Clip",
        name: `${video.title}（無料プレビュー）`,
        isAccessibleForFree: true,
      },
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
        acceptedAnswer: { "@type": "Answer", text: "BOOTHでの購入に対応します。BOOTHが対応する各種決済方法（クレジットカード、PayPal、キャリア決済など）がご利用いただけます。" },
      },
      {
        "@type": "Question",
        name: "購入形式はどのような形ですか？",
        acceptedAnswer: { "@type": "Answer", text: "動画ごとの単品購入（PPV）です。サブスクリプションではなく、見たい動画だけを都度購入する形式です。" },
      },
      {
        "@type": "Question",
        name: "無料で見られる部分はありますか？",
        acceptedAnswer: { "@type": "Answer", text: "はい。各作品の導入部分は無料でご覧いただけます。続きをご覧になりたい方は、BOOTHでの購入にご案内します。" },
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
          BOOTHでの単品購入（PPV）でお楽しみいただけます。
        </p>
        <div className="store-payment-note">
          <span>決済</span>
          <strong>BOOTH</strong>
          <span>購入形式</span>
          <strong>PPV（単品購入）</strong>
        </div>
      </section>

      <section className="store-video-grid">
        {videos.map((video) => (
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
