import type { CSSProperties } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import BusinessPage from "../components/BusinessPage"

const title = "クラウドソーシングで仕事を依頼 | 積み上げログ"
const description = "ココナラ、ランサーズ、クラウドワークスなどを利用した、Web制作・システム開発・業務自動化・技術相談の仕事依頼窓口です。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/crowdsourcing" },
  openGraph: { title, description, type: "website", url: "/crowdsourcing", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
}

const platforms = [
  {
    name: "ココナラ",
    label: "スキル・サービス相談",
    url: "https://coconala.com/users/1015960",
    color: "#f29b38",
    text: "サービス内容を比較しながら、Web制作、システム開発、業務改善について相談したい方の窓口です。",
    direct: true,
  },
  {
    name: "ランサーズ",
    label: "プロジェクト・継続依頼",
    url: "https://www.lancers.jp/profile/Chitamaru",
    color: "#1769aa",
    text: "要件を整理した開発案件や、継続的な改善・運用支援をプロジェクトとして相談したい方の窓口です。",
    direct: true,
  },
  {
    name: "クラウドワークス",
    label: "開発・業務支援の依頼",
    url: "https://crowdworks.jp/public/employees/7149303",
    color: "#00a0e9",
    text: "システム開発、データ整理、更新作業の自動化など、具体的な業務課題を相談したい方の窓口です。",
    direct: true,
  },
] as const

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
    { "@type": "ListItem", position: 2, name: "クラウドソーシング", item: "https://syunnjack.dev/crowdsourcing" },
  ],
}

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "クラウドソーシング経由のWeb制作・システム開発・業務自動化",
  description,
  provider: { "@type": "Person", name: "知多丸", url: "https://syunnjack.dev/profile" },
  areaServed: "JP",
  serviceType: ["Web制作", "システム開発", "業務自動化", "技術相談"],
}

export default function CrowdsourcingPage() {
  return (
    <BusinessPage
      eyebrow="CROWDSOURCING"
      title="クラウドソーシングから仕事を依頼"
      lead="Web制作、システム開発、業務自動化、既存サイトの改善を受け付けています。依頼内容と利用したい窓口に合わせてお進みください。"
      schemas={[breadcrumbSchema, serviceSchema]}
    >
      <section className="business-section">
        <div className="crowdsourcing-intro">
          <h2>3つの受注窓口</h2>
          <p>正式な依頼前に、積み上げログの非公開フォームで目的・予算・希望時期を確認できます。秘密情報やコードは初回フォームへ添付せず、概要のみお知らせください。</p>
        </div>
        <div className="service-grid">
          {platforms.map((platform, index) => (
            <article
              className="crowdsourcing-platform"
              key={platform.name}
              style={{ "--platform-color": platform.color } as CSSProperties}
            >
              <span>0{index + 1} / {platform.label}</span>
              <h2>{platform.name}</h2>
              <p>{platform.text}</p>
              <ul>
                <li>Webサイト・LP制作</li>
                <li>業務支援システム開発</li>
                <li>自動化・既存サイト改善</li>
              </ul>
              <div className="crowdsourcing-card-actions">
                {platform.direct ? (
                  <>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer me">
                      {platform.name}で直接相談する <span aria-hidden="true">↗</span>
                    </a>
                    <Link href={`/estimate?service=${encodeURIComponent(`${platform.name}経由の仕事依頼`)}`}>
                      積み上げログから見積りを相談 <span aria-hidden="true">→</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/estimate?service=${encodeURIComponent(`${platform.name}経由の仕事依頼`)}`}>
                      この窓口で見積りを相談する <span aria-hidden="true">→</span>
                    </Link>
                    <a href={platform.url} target="_blank" rel="noopener noreferrer">
                      {platform.name}を開く <span aria-hidden="true">↗</span>
                    </a>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
        <div className="crowdsourcing-flow">
          <h2>仕事受注までの流れ</h2>
          <ol>
            <li><strong>相談</strong><br />目的と現在の課題を非公開フォームで確認します。</li>
            <li><strong>要件整理</strong><br />必要な機能、作業範囲、納期を整理します。</li>
            <li><strong>見積り・契約</strong><br />費用と進め方を提示し、合意後に着手します。</li>
            <li><strong>制作・納品</strong><br />途中経過を共有し、確認・調整後に納品します。</li>
          </ol>
        </div>
      </section>
    </BusinessPage>
  )
}
