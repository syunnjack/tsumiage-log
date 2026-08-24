import type { Metadata } from "next"
import Link from "next/link"
import BusinessPage from "../components/BusinessPage"

const title = "プロフィール・経歴・実績 | 積み上げログ"
const description =
  "syunnjackの学習歴、開発経験、得意分野、運営サイトの一覧を紹介します。公開データを使った検索サイトを中心に、実際に動いているものだけを載せています。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/profile/" },
  openGraph: { title, description, type: "profile", url: "/profile/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
}

// 実際に稼働しているものだけを載せる。作りかけや停止中のものは書かない。
const sites = [
  { url: "https://47meshi.net/", name: "47めし", note: "農林水産省「うちの郷土料理」から47都道府県の1,365品。都道府県と食材から探せる" },
  { url: "https://gesenmap.jp/", name: "ゲーセンマップ", note: "GiGO・バンナム・イオンファンタジー・タイトーの公式情報から全国1,700店。毎月自動更新" },
  { url: "https://sauna-map.jp/", name: "サウナ・銭湯マップ", note: "OpenStreetMap由来の5,790件。現在地から探せる" },
  { url: "https://hoiku-map.jp/", name: "保育園マップ", note: "全国の保育園・幼稚園を地図から探せる" },
  { url: "https://kekkonshikijo-map.jp/", name: "結婚式場マップ", note: "OpenStreetMapと運営会社の公式情報から。掲載サイトのデータは使わない" },
  { url: "https://foodtruck-map.jp/", name: "フードトラックマップ", note: "自治体の公開情報から出店場所を収集。公式の出典つきで掲載" },
  { url: "https://furusato-hikaku.net/", name: "ふるさと納税比較", note: "楽天ウェブサービスから返礼品を毎日同期。総務省の現況調査から自治体ページを生成" },
  { url: "https://hikkoshi-hikaku.jp/", name: "引越し業者相見積もり口コミ", note: "全日本トラック協会「引越安心マーク」認定の339社" },
  { url: "https://tourismparking.jp/", name: "観光地の駐車場アラート", note: "78スポットを公式出典つきで収録。推測の数値は載せない" },
  { url: "https://it-goukaku.jp/", name: "IT合格トレーナー", note: "IT資格の問題演習。資格ごとに問題を用意" },
  { url: "https://kurabe-kurashi.jp/", name: "暮らしとビジネスの比較ポータル", note: "車・住宅補助金からビジネスツールまで" },
  { url: "https://goalpilot.jp/", name: "GoalPilot", note: "続かない目標を戻す仕組みを試すアプリ" },
]

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "syunnjack",
  url: "https://syunnjack.dev/profile/",
  sameAs: ["https://github.com/syunnjack"],
  description,
  knowsAbout: ["React", "Next.js", "Vite", "Laravel", "GitHub Actions", "SEO", "Web開発", "公開データの活用"],
  worksFor: { "@type": "Organization", name: "積み上げログ", url: "https://syunnjack.dev/" },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
    { "@type": "ListItem", position: 2, name: "プロフィール", item: "https://syunnjack.dev/profile/" },
  ],
}

export default function ProfilePage() {
  return (
    <BusinessPage
      eyebrow="PROFILE / CAREER"
      title="学びを、使える仕組みに変える"
      lead="syunnjack。Web開発を学びながら、身近な課題を解決するアプリと自動化の仕組みを継続的に制作・公開しています。公開データを一次情報として扱い、推測で数値を書かないことを運営の軸にしています。"
      schemas={[personSchema, breadcrumbSchema]}
    >
      <section className="business-section profile-grid">
        <div>
          <p className="section-kicker">EXPERIENCE</p>
          <h2>経歴</h2>
          <ol className="career-list">
            <li>
              <strong>学生時代</strong>
              <p>身近な不便を自分の手で変えることに興味を持ち、技術との接点を作る。</p>
            </li>
            <li>
              <strong>Web開発学習</strong>
              <p>JavaScript、Reactを中心に、読むだけでなく小さく動かして確かめる学習を継続。</p>
            </li>
            <li>
              <strong>個人開発</strong>
              <p>地図検索、比較、情報整理、コンテンツ自動化など、実用を意識したサイトを制作・公開。</p>
            </li>
            <li>
              <strong>現在</strong>
              <p>12サイトを運営しながら、設計判断と失敗の経過を記事にして公開。</p>
            </li>
          </ol>
        </div>
        <div>
          <p className="section-kicker">SKILLS</p>
          <h2>得意分野</h2>
          <ul className="skill-list">
            <li>React / Next.js / Vite によるWeb UI開発</li>
            <li>Laravel によるデータベースを伴うサイト構築</li>
            <li>GitHub Actions を使った収集・生成・デプロイの自動化</li>
            <li>公開データ・API（省庁の統計、OpenStreetMap、各社のAPI）の活用</li>
            <li>SEO・AI検索を意識した情報設計</li>
            <li>要件を小さく分け、実装と検証を積み重ねる進め方</li>
          </ul>
        </div>
      </section>

      <section className="business-section">
        <p className="section-kicker">SITES</p>
        <h2>運営しているサイト</h2>
        <p className="profile-note">
          いずれも稼働中のものです。データの出どころを画面に明記し、
          推測や独自の評価は載せない方針で運営しています。
        </p>
        <ul className="site-list">
          {sites.map((site) => (
            <li key={site.url}>
              <a href={site.url} target="_blank" rel="noopener noreferrer">
                {site.name}
              </a>
              <span>{site.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="business-section">
        <p className="section-kicker">LEARNING</p>
        <h2>学習中のこと</h2>
        <p>
          行政書士試験に挑戦しています。20代で1回、30代で2回受け、直近では択一換算であと4問というところで届きませんでした。
          今年で4回目になります。
        </p>
        <p>
          うまくいったことだけでなく、落ちた回に何が足りなかったのかも記録しています。
          <Link href="/articles/manual/gyosei-shoshi-1st-attempt-ronjutsu/">受験記</Link>
          として1回目から順に書いてあります。
        </p>
        <p>
          技術についても同じ姿勢で書いています。設定を間違えて19ドメイン分やり直した話や、
          CIの設定漏れで投稿機能が消えていた話など、
          <Link href="/articles/">記事一覧</Link>の「読み物」に失敗の経過を残しています。
        </p>
      </section>

      <section className="business-section">
        <p className="section-kicker">CONTACT</p>
        <h2>連絡先</h2>
        <p>
          お問い合わせは<Link href="/contact/">お問い合わせページ</Link>のフォームから受け付けています。
          記事へのご感想、掲載内容の訂正・削除のご依頼、開発のご相談に対応します。
        </p>
        <p>
          公開しているコードは<a href="https://github.com/syunnjack" target="_blank" rel="noopener noreferrer">GitHub</a>にあります。
          情報の取り扱いについては<Link href="/privacy/">プライバシーポリシー</Link>をご確認ください。
        </p>
      </section>
    </BusinessPage>
  )
}
