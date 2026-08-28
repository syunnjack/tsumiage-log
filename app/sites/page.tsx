import type { Metadata } from "next"
import BusinessPage from "../components/BusinessPage"

const title = "運営サイト一覧 | 積み上げログ"
const description = "個人で開発・運営しているWebサイトの一覧です。地図から探すサービス、比較サイト、おでかけ支援、読みものまで、公開中のものをまとめています。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/sites/" },
  openGraph: { title, description, type: "website", url: "/sites/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
}

type Site = { name: string; url: string; description: string }
type Group = { heading: string; lead: string; sites: Site[] }

const groups: Group[] = [
  {
    heading: "地図から探す",
    lead: "現在地や地名から、目的の場所を引けるようにしたサービスです。",
    sites: [
      { name: "近くナビ", url: "https://chikaku-navi.jp/", description: "いる場所から、必要な場所をすぐ引く。喫煙所やゲームセンターなどを横断で探せます。" },
      { name: "サウナ・銭湯マップ", url: "https://sauna-map.jp/", description: "全国のサウナと銭湯を、現在地と都道府県から探せます。" },
      { name: "保育園マップ", url: "https://hoiku-map.jp/", description: "保育園・幼稚園を地図から探すサイトです。" },
      { name: "学習塾マップ", url: "https://juku-map.net/", description: "小学生から大学受験まで、通える範囲の学習塾を地図で探せます。" },
      { name: "葬儀社マップ", url: "https://sougisha-map.jp/", description: "葬儀社を現在地から探せます。費用の考え方も扱っています。" },
      { name: "結婚式場マップ", url: "https://kekkonshikijo-map.jp/", description: "全国の結婚式場を地図から探せます。" },
      { name: "レンタルスペースマップ", url: "https://rental-space-map.jp/", description: "レンタルスペースと公民館を、現在地から探せます。" },
      { name: "ゲーセンマップ", url: "https://gesenmap.jp/", description: "全国のゲームセンターを、系列と地域から探せます。毎月自動で更新しています。" },
      { name: "24時間営業マップ", url: "https://midnightspot.jp/", description: "深夜でも開いている店舗を地図から探せます。" },
      { name: "フードトラックマップ", url: "https://foodtruck-map.jp/", description: "移動販売車が今日どこにいるかを探せます。" },
      { name: "喫煙OKバーナビ", url: "https://workbar.jp/", description: "全国の主要都市で、喫煙できるバーを探せます。" },
      { name: "ペット日和", url: "https://petbiyori.net/", description: "ひとりでも入りやすい猫カフェ・ドッグカフェを探せます。" },
    ],
  },
  {
    heading: "比べて決める",
    lead: "条件を並べて、判断できる形にすることを目的にしたサイトです。",
    sites: [
      { name: "ふるさと納税比較", url: "https://furusato-hikaku.net/", description: "総務省の現況調査をもとに、自治体ごとの実データで比べられます。" },
      { name: "引越し業者相見積もり口コミ", url: "https://hikkoshi-hikaku.jp/", description: "「引越安心マーク」を取得している事業者を掲載しています。" },
      { name: "キャンプ場比較", url: "https://camp-hikaku.jp/", description: "空き状況と口コミからキャンプ場を比べられます。" },
      { name: "暮らしとビジネスの比較ポータル", url: "https://kurabe-kurashi.jp/", description: "地域とジャンルの組み合わせで、比較の入口をまとめています。" },
    ],
  },
  {
    heading: "おでかけ・遠征",
    lead: "移動の前後で困ることを減らすためのサービスです。",
    sites: [
      { name: "海街道", url: "https://umikaido.jp/", description: "三重・愛知・静岡の海辺と、旧東海道沿いを歩くための案内です。" },
      { name: "遠征ルート宿泊ナビ", url: "https://triproutestay.jp/", description: "到着時刻から、泊まれる場所と経路を組み立てます。" },
      { name: "イベント遠征アラート", url: "https://eventtripalert.jp/", description: "ライブやスポーツの会場と、最寄り駅からの動き方をまとめています。" },
      { name: "観光地の駐車場アラート", url: "https://tourismparking.jp/", description: "観光地の駐車場を、混雑を前提に選べるようにしています。" },
      { name: "待ち時間アラート", url: "https://waittimealert.jp/", description: "病院・役所・施設の待ち時間を扱っています。" },
      { name: "どこで見る？", url: "https://dokodemiru.jp/", description: "映画やドラマが、どの配信サービスで見られるかを調べられます。" },
    ],
  },
  {
    heading: "学ぶ・働く",
    lead: "資格と仕事に関わるサイトです。",
    sites: [
      { name: "IT合格トレーナー", url: "https://it-goukaku.jp/", description: "IT系の資格の問題を、資格ごとに解けます。" },
      { name: "資格試験ガイド", url: "https://examdate.jp/", description: "主要な資格試験の制度と主催団体を、公式情報からまとめています。" },
      { name: "福祉の求人アラート", url: "https://welfarejob.jp/", description: "障害者雇用と福祉の仕事を扱っています。" },
      { name: "GoalPilot", url: "https://goalpilot.jp/", description: "続かなくなった目標を、戻すためのアプリです。" },
    ],
  },
  {
    heading: "くらしの読みもの",
    lead: "調べたことを、記事の形にまとめているサイトです。",
    sites: [
      { name: "ハロウィンアクセサリー研究室", url: "https://halloween-event.com/", description: "ハロウィンとコスプレの小物を、痛くならないか・落ちないか・写真に写るかで選ぶサイトです。" },
      { name: "片づけ研究所", url: "https://katazukekenkyujo.com/", description: "実家の片づけ、生前整理、不用品の扱いをまとめています。" },
      { name: "要領のいい終活", url: "https://yooryo-shukatsu.com/", description: "相続・遺言・生前整理の手順を整理しています。" },
      { name: "くらしの節約データ", url: "https://enjoy-setsuyaku.jp/", description: "家計調査のデータから、都市ごとの支出を見られます。" },
      { name: "47めし", url: "https://47meshi.net/", description: "農林水産省「うちの郷土料理」をもとに、47都道府県の郷土料理を並べています。" },
      { name: "よろず掲示板", url: "https://yorozu-bbs.jp/", description: "誰でも匿名で書き込める掲示板です。" },
    ],
  },
]

const allSites = groups.flatMap((group) => group.sites)

const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "運営サイト一覧",
  description,
  url: "https://syunnjack.dev/sites/",
  isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev/" },
  numberOfItems: allSites.length,
  hasPart: allSites.map((site) => ({ "@type": "WebSite", name: site.name, description: site.description, url: site.url })),
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
    { "@type": "ListItem", position: 2, name: "運営サイト一覧", item: "https://syunnjack.dev/sites/" },
  ],
}

export default function SitesPage() {
  return (
    <BusinessPage
      eyebrow="SITES"
      title="運営しているサイト"
      lead={`個人で作って、運営しているサイトです。公開中の${allSites.length}件を並べています。`}
      schemas={[collectionSchema, breadcrumbSchema]}
    >
      {groups.map((group) => (
        <section className="business-section" key={group.heading}>
          <div className="section-heading">
            <div>
              <h2>{group.heading}</h2>
            </div>
            <p>{group.lead}</p>
          </div>
          <div className="work-grid">
            {group.sites.map((site) => (
              <article key={site.url}>
                <h2>{site.name}</h2>
                <p>{site.description}</p>
                <a href={site.url} target="_blank" rel="noopener">
                  サイトを開く →
                </a>
              </article>
            ))}
          </div>
        </section>
      ))}
      <section className="business-section">
        <div className="section-heading">
          <div>
            <h2>運営者について</h2>
          </div>
          <p>上記のサイトは、いずれも個人で開発・運営しているものです。</p>
        </div>
        <p>
          更新の記録は<a href="/articles/">記事一覧</a>に、開発の話は X（
          <a href="https://x.com/syunnjackdev" rel="me noopener" target="_blank">@syunnjackdev</a>
          ）に書いています。お問い合わせは<a href="/contact/">こちら</a>から受け付けています。
        </p>
      </section>
    </BusinessPage>
  )
}
