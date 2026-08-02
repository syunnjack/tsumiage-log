import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "パソコンが苦手な方へ | 積み上げログ",
  description:
    "パソコンやITの専門用語が苦手な方へ。積み上げログの読み方と、記事・動画・問い合わせの使い分けをやさしく案内します。",
  alternates: { canonical: "/beginner" },
}

const faq = [
  {
    question: "パソコン初心者でも読めますか？",
    answer:
      "はい。最初からすべてを理解する必要はありません。まずは見出しと要点を読み、興味を持った部分から少しずつ進められます。",
  },
  {
    question: "専門用語が分からないときはどうすればよいですか？",
    answer:
      "記事の要点と動画から確認してください。それでも分からない場合は、お問い合わせから知りたい言葉や操作を送れます。",
  },
  {
    question: "ITエンジニア向けの記事もありますか？",
    answer:
      "あります。公開リポジトリの構成、使用技術、設計判断、コミット履歴まで確認できる技術解説を掲載しています。",
  },
]

export default function BeginnerPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  }

  return (
    <main className="business-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="business-hero">
        <p>パソコンが苦手な方へ</p>
        <h1>分からない言葉を、そのままにしない。</h1>
        <p>
          積み上げログは、パソコンやITに慣れていない方にも、仕組みと操作の意味が伝わる説明を目指します。
          エンジニア向けの詳しい情報も残しながら、最初に知りたい要点から順番に読めるよう案内します。
        </p>
      </section>

      <section className="business-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />目的から選ぶ</p>
            <h2>自分に合う入口から始める</h2>
          </div>
          <p>全部を読む必要はありません。知りたいことに近い入口を選んでください。</p>
        </div>
        <div className="service-grid">
          <article>
            <span>01 / 読む</span>
            <h2>要点から知りたい</h2>
            <p>各記事の結論と概要を先に読み、必要になったときだけ設計やコードの説明へ進めます。</p>
            <Link href="/articles">記事一覧を見る →</Link>
          </article>
          <article>
            <span>02 / 見る</span>
            <h2>文章より動画が分かりやすい</h2>
            <p>画面と日本語ナレーションを使った短い解説動画から、プロジェクトの目的と仕組みを確認できます。</p>
            <Link href="/videos">技術解説動画を見る →</Link>
          </article>
          <article>
            <span>03 / 聞く</span>
            <h2>自分の場合を相談したい</h2>
            <p>分からない言葉、パソコン操作、システム導入について、知りたい内容を文章で送れます。</p>
            <Link href="/contact">問い合わせる →</Link>
          </article>
          <article>
            <span>04 / つなげる</span>
            <h2>仕事や学習につなげたい</h2>
            <p>IT転職、副業、フリーランス、スクール、資格を目的別に整理し、自分に合う次の行動を選べます。</p>
            <Link href="/career-support">キャリア・学習ガイドを見る →</Link>
          </article>
        </div>

        <div className="process">
          <h2>このブログの読み方</h2>
          <ol>
            <li><strong>1</strong><span>記事のタイトルから興味のあるテーマを選ぶ</span></li>
            <li><strong>2</strong><span>最初に要点と概要だけを読む</span></li>
            <li><strong>3</strong><span>分かりにくい部分は動画でも確認する</span></li>
            <li><strong>4</strong><span>必要な場合だけ技術構成やコミットへ進む</span></li>
          </ol>
        </div>
      </section>

      <section className="business-section" aria-labelledby="beginner-faq">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />よくある質問</p>
            <h2 id="beginner-faq">初めて読む方の疑問</h2>
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
