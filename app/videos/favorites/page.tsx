import type { Metadata } from "next"
import Link from "next/link"
import favoriteVideoData from "../../data/favorite-videos.json"

export const metadata: Metadata = {
  title: "気に入った動画 | 積み上げログ",
  description:
    "技術、学習、F1・モータースポーツなど、実際に見て気に入った動画を選定理由とともに紹介します。",
  alternates: { canonical: "/videos/favorites" },
  openGraph: {
    title: "気に入った動画 | 積み上げログ",
    description: "実際に見て気に入った動画を、テーマと選定理由から探せます。",
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
          技術や学習に役立つ動画だけでなく、F1、映像、趣味など、
          実際に視聴して人に紹介したいと思った動画を掲載します。
          公開後も内容を見直し、古くなった情報には注記します。
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
                <p>{String(index + 1).padStart(2, "0")} / F1・モータースポーツ</p>
                <h2>{video.title}</h2>
                <a href={video.authorUrl}>{video.author} ↗</a>
                <p>{video.description}</p>
                <div>
                  <strong>気に入った理由</strong>
                  <p>{video.selectionReason}</p>
                </div>
                <a className="youtube-source-link" href={video.sourceUrl}>
                  YouTubeで元動画を見る ↗
                </a>
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
          <li><span>01</span><div><strong>正確さ</strong><p>公式資料や実際の挙動と照らして、誤解を招く説明がないか確認します。</p></div></li>
          <li><span>02</span><div><strong>分かりやすさ</strong><p>前提、手順、理由が整理され、視聴後に説明できる内容を選びます。</p></div></li>
          <li><span>03</span><div><strong>実践性</strong><p>見て終わらず、自分のコードや学習に応用できる動画を優先します。</p></div></li>
          <li><span>04</span><div><strong>透明性</strong><p>紹介理由と対象者を明記し、広告や利害関係がある場合は表示します。</p></div></li>
        </ol>
      </section>
    </main>
  )
}
