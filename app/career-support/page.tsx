import type { Metadata } from "next"
import Link from "next/link"
import CareerAiDiagnosis from "../components/CareerAiDiagnosis"

const pageTitle = "IT転職・副業・フリーランス・スクール・資格ガイド | 積み上げログ"
const pageDescription =
  "IT転職、副業、フリーランス、プログラミングスクール、IT資格を目的別に整理。比較のポイントと相談・見積もり窓口を案内します。"

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/career-support/" },
  openGraph: { title: pageTitle, description: pageDescription, type: "website", url: "/career-support/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title: pageTitle, description: pageDescription, images: ["/og.png"] },
}

const paths = [
  {
    id: "career",
    number: "01",
    title: "IT転職",
    text: "経験の棚卸し、ポートフォリオ、応募先で求められる技術を整理し、次に準備するものを明確にします。",
    points: "経歴整理／ポートフォリオ改善／応募準備",
    cta: "IT転職の準備を相談する",
    service: "IT転職・ポートフォリオ相談",
  },
  {
    id: "side-business",
    number: "02",
    title: "副業・フリーランス",
    text: "提供できる作業、実績の見せ方、見積もり、問い合わせ導線を整え、案件へ応募する準備を進めます。",
    points: "得意分野の整理／実績ページ／見積もり・提案",
    cta: "副業・独立の準備を相談する",
    service: "副業・フリーランス準備相談",
  },
  {
    id: "school",
    number: "03",
    title: "プログラミングスクール",
    text: "学習目的、料金、受講期間、質問対応、転職支援を比較し、自分に必要な支援があるかを判断します。",
    points: "目的／総費用／教材／質問対応／支援内容",
    cta: "スクール選びを相談する",
    service: "プログラミングスクール選び相談",
  },
  {
    id: "certification",
    number: "04",
    title: "IT資格",
    text: "目指す仕事に資格が必要かを確認し、試験範囲、学習期間、実務とのつながりから学習計画を作ります。",
    points: "資格の目的／試験範囲／学習計画／実務活用",
    cta: "資格学習の進め方を相談する",
    service: "IT資格・学習計画相談",
  },
]

const faq = [
  {
    question: "転職と副業のどちらから始めるべきですか？",
    answer:
      "希望する働き方、確保できる時間、現在の経験によって異なります。まず経験と使える時間を整理し、無理なく実績を作れる方法を選びます。",
  },
  {
    question: "プログラミングスクールへ通えば必ず転職できますか？",
    answer:
      "転職を保証するものではありません。教材、質問対応、実績制作、転職支援の範囲と費用を確認し、自分に必要な支援か判断することが重要です。",
  },
  {
    question: "資格とポートフォリオはどちらが重要ですか？",
    answer:
      "目指す職種によります。知識の証明に資格が役立つ仕事もあれば、制作物と説明力が重視される仕事もあります。求人要件から逆算して決めます。",
  },
]

export default function CareerSupportPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "キャリア・学習", item: "https://syunnjack.dev/career-support/" },
    ],
  }

  return (
    <main className="business-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <section className="business-hero">
        <p>キャリア・学習・働き方</p>
        <h1>学んだ技術を、仕事と収入につなげる。</h1>
        <p>
          IT転職、副業、フリーランス、スクール、資格を目的別に整理します。
          すぐに契約を勧めるのではなく、必要な準備と比較条件を確認してから次の行動を選べる案内です。
        </p>
      </section>

      <CareerAiDiagnosis />

      <section className="business-section" id="career-options">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />診断後の収入・学習ルート</p>
            <h2>診断結果に合う次の行動を選ぶ</h2>
          </div>
          <p>詳細を確認してから、必要に応じて相談・見積もりへ進めます。</p>
        </div>
        <div className="service-grid">
          {paths.map((path) => (
            <article key={path.title} id={`career-option-${path.id}`}>
              <span>{path.number}</span>
              <h2>{path.title}</h2>
              <p>{path.text}</p>
              <strong>確認するポイント</strong>
              <small>{path.points}</small>
              <Link href={`/estimate?service=${encodeURIComponent(path.service)}`}>
                {path.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="business-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />比較と広告の方針</p>
            <h2>判断条件を明確にする</h2>
          </div>
        </div>
        <div className="profile-grid">
          <div>
            <h3>比較するときに見る項目</h3>
            <ul className="skill-list">
              <li>料金だけでなく、総額・契約期間・解約条件を確認する</li>
              <li>転職支援や案件紹介の対象条件を公式情報で確認する</li>
              <li>資格取得や受講そのものを目的にせず、仕事とのつながりを考える</li>
              <li>収入例は保証ではないため、条件と根拠を確認する</li>
            </ul>
          </div>
          <div>
            <h3>広告・紹介リンクについて</h3>
            <p>
              広告やアフィリエイトリンクを掲載する場合は、その旨を分かる位置に明示します。
              料金、返金、支援内容、応募条件などの最新情報は、必ず各サービスの公式サイトで確認してください。
            </p>
            <Link className="button primary" href="/contact">
              掲載・提携について問い合わせる →
            </Link>
          </div>
        </div>
      </section>

      <section className="business-section" aria-labelledby="career-faq">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />よくある質問</p>
            <h2 id="career-faq">仕事と学習の疑問</h2>
          </div>
        </div>
        <div className="faq-list">
          {faq.map(({ question, answer }) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  )
}
