import type { Metadata } from "next"
import Link from "next/link"
import favoriteVideoData from "../../data/favorite-videos.json"

export const metadata: Metadata = {
  title: "気に入った動画 | 積み上げログ",
  description:
    "技術、F1、お笑い、犬猫の癒やし、好きな楽曲など、実際に見て気に入った動画を選定理由とともに紹介します。",
  alternates: { canonical: "/videos/favorites" },
  openGraph: {
    title: "気に入った動画 | 積み上げログ",
    description: "技術、F1、お笑い、犬猫、音楽から、実際に見て気に入った動画を探せます。",
    url: "/videos/favorites",
    images: ["/og.png"],
  },
}

export default function FavoriteVideosPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "気に入った動画",
    description:
      "syunnjackが実際に見て役立った技術動画を、選定理由とともに紹介するコレクション。",
    url: "https://syunnjack.dev/videos/favorites",
    isPartOf: {
      "@type": "WebSite",
      name: "積み上げログ",
      url: "https://syunnjack.dev",
    },
    numberOfItems: favoriteVideoData.videos.length,
    hasPart: favoriteVideoData.videos.map((video) => ({
      "@type": "VideoObject",
      name: video.title,
      description: video.description,
      thumbnailUrl: video.thumbnailUrl,
      embedUrl: video.embedUrl,
      contentUrl: video.sourceUrl,
      author: { "@type": "Person", name: video.author, url: video.authorUrl },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "動画", item: "https://syunnjack.dev/videos" },
      { "@type": "ListItem", position: 3, name: "気に入った動画", item: "https://syunnjack.dev/videos/favorites" },
    ],
  }

  return (
    <main className="favorite-videos-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <header className="article-site-header">
        <Link className="brand" href="/">
          <span className="brand-mark">つ</span>
          <span><strong>積み上げログ</strong><small>TSUMIAGE LOG</small></span>
        </Link>
        <Link href="/videos">動画ページへ戻る</Link>
      </header>

      <section className="favorite-video-hero">
        <nav aria-label="パンくずリスト">
          <Link href="/">ホーム</Link><span>/</span>
          <Link href="/videos">動画</Link><span>/</span>
          <span>気に入った動画</span>
        </nav>
        <p className="eyebrow"><span />CURATED FAVORITES</p>
        <h1>気に入った<br />動画</h1>
        <p>
          再生数だけでは選びません。実際に見て印象に残った動画を、
          「どこが気に入ったか」「何を楽しめるか」とともに紹介します。
        </p>
      </section>

      <section className="favorite-answer">
        <p>QUICK ANSWER</p>
        <h2>このカテゴリで紹介する動画は？</h2>
        <p>
          技術や学習に役立つ動画だけでなく、F1、お笑い、犬・猫、音楽など、
          実際に視聴して人に紹介したいと思った動画を掲載します。
          内容が古くなった場合は、そのことが分かる注記を添えます。
        </p>
      </section>

      <section className="favorite-video-list-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />SELECTED VIDEOS</p>
            <h2>お気に入り動画</h2>
          </div>
          <p>埋め込みで視聴でき、YouTubeの元動画にも移動できます。</p>
        </div>
        <div className="favorite-video-list">
          {favoriteVideoData.videos.map((video, index) => (
            <article id={`video-${video.id}`} key={video.id}>
              <div className="favorite-video-embed">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
              <div className="favorite-video-copy">
                <p>
                  {String(index + 1).padStart(2, "0")} /{" "}
                  {favoriteVideoData.categories.find(
                    (category) => category.slug === video.category,
                  )?.name ?? "お気に入り"}
                </p>
                <h2>{video.title}</h2>
                <a href={video.authorUrl}>{video.author} ↗</a>
                <p>{video.description}</p>
                <div>
                  <strong>気に入った理由</strong>
                  <p>{video.selectionReason}</p>
                </div>
                {"sourceNote" in video && video.sourceNote && (
                  <p className="video-source-note">{video.sourceNote}</p>
                )}
                <a className="youtube-source-link" href={video.sourceUrl}>
                  YouTubeで元動画を見る ↗
                </a>
                {"ctaUrl" in video && video.ctaUrl && (
                  <div className="video-service-cta">
                    <a
                      href={video.ctaUrl}
                      rel={"isAffiliate" in video && video.isAffiliate ? "sponsored noopener" : "noopener"}
                    >
                      {"ctaLabel" in video ? video.ctaLabel : "関連サービスを見る"} ↗
                    </a>
                    <small>
                      {"isAffiliate" in video && video.isAffiliate
                        ? "PR：リンク経由の申込みで運営者に報酬が発生する場合があります。"
                        : "現在は通常の公式サイトリンクです。広告リンクではありません。"}
                    </small>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="favorite-category-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />BROWSE BY TOPIC</p>
            <h2>テーマから探す</h2>
          </div>
          <p>動画は準備ができ次第、それぞれのテーマへ追加します。</p>
        </div>
        <div className="favorite-category-grid">
          {favoriteVideoData.categories.map((category, index) => {
            const count = favoriteVideoData.videos.filter(
              (video: { category?: string }) => video.category === category.slug,
            ).length
            return (
              <article id={category.slug} key={category.slug}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
                <strong>{count} VIDEOS</strong>
              </article>
            )
          })}
        </div>
      </section>

      <section className="selection-policy">
        <p className="section-kicker">SELECTION POLICY</p>
        <h2>動画の選定基準</h2>
        <ol>
          <li><span>01</span><div><strong>実際に視聴</strong><p>タイトルだけで選ばず、実際に見て気に入った動画を掲載します。</p></div></li>
          <li><span>02</span><div><strong>紹介理由</strong><p>面白かった点、癒やされた点、学べたことなど、自分の言葉で理由を添えます。</p></div></li>
          <li><span>03</span><div><strong>正規の配信元</strong><p>楽曲や番組は、公式チャンネルや権利者が認めた配信元を優先します。</p></div></li>
          <li><span>04</span><div><strong>透明性</strong><p>制作者と元動画へリンクし、広告や利害関係がある場合は明記します。</p></div></li>
        </ol>
      </section>
    </main>
  )
}
