import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "スマホ・パソコンの操作や設定相談 | 積み上げログ",
  description:
    "スマホやパソコンの操作、設定、エラーなどのお困りごとを伺い、設定方法や操作方法を可能な範囲で案内します。",
  alternates: { canonical: "/beginner" },
}

const faq = [
  {
    question: "スマホやパソコンに詳しくなくても相談できますか？",
    answer:
      "はい。分かる範囲で、使っている機器、困っている操作、表示されたエラーなどをお知らせください。状況を伺いながら整理します。",
  },
  {
    question: "どのような内容を相談できますか？",
    answer:
      "スマホやパソコンの基本操作、各種設定、エラーへの対処、実現したいことに必要な方法などをご相談いただけます。",
  },
  {
    question: "問い合わせるときに何を書けばよいですか？",
    answer:
      "機器名、利用しているサービス、行った操作、エラー文、実現したいことなど、分かる範囲でお書きください。",
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
        <p>スマホ・パソコン操作相談</p>
        <h1>スマホやパソコンの操作や設定にお困りの方のご相談もお待ちしております。</h1>
        <p>
          普段からパソコンやスマホをお使いで、「○○で困っている」「こんなことを実現したい」
          「エラーが出て先に進めなくて困っている」などございましたら、フォームからお問い合わせください。
          可能な限りお困りごとをお聞きして、設定方法や操作方法、その他のアドバイスをさせていただきます。
        </p>
        <Link className="button primary" href="/contact">お問い合わせフォームへ →</Link>
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
            <p>スマホやパソコンの操作、設定、エラー、実現したいことについて、分かる範囲で状況を送れます。</p>
            <Link href="/contact">お問い合わせフォームへ →</Link>
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
