import type { Metadata } from "next"
import Link from "next/link"

const title = "プライバシーポリシー | 積み上げログ"
const description =
  "積み上げログにおける、アクセス解析、広告配信、コメント、お問い合わせで扱う情報の取り扱いを記載しています。Cookieの利用と、その無効化の方法についても説明します。"

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacy/" },
  openGraph: { title, description, type: "website", url: "/privacy/", images: ["/og.png"] },
  twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
    { "@type": "ListItem", position: 2, name: "プライバシーポリシー", item: "https://syunnjack.dev/privacy/" },
  ],
}

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <h1>プライバシーポリシー</h1>
      <p className="legal-lead">
        当サイト「積み上げログ」（https://syunnjack.dev/）における、利用者の情報の取り扱いについて記載します。
      </p>

      <section>
        <h2>運営者</h2>
        <p>
          個人で運営しています。運営者の情報は<Link href="/profile/">プロフィール</Link>に記載しています。
          お問い合わせは<Link href="/contact/">お問い合わせページ</Link>のフォームから受け付けています。
        </p>
      </section>

      <section>
        <h2>アクセス解析</h2>
        <p>
          当サイトは、利用状況を把握するために Google アナリティクス（GA4）を使用しています。
          このツールはトラフィックデータの収集のために Cookie を使用します。
          収集されるのは閲覧されたページ、参照元、おおよその地域、使用しているブラウザや端末の種類などで、
          <strong>個人を特定する情報は含まれません</strong>。
        </p>
        <p>
          Google によるデータの取り扱いについては
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            Google のポリシーと規約
          </a>
          をご確認ください。
        </p>
      </section>

      <section>
        <h2>広告の配信</h2>
        <p>
          当サイトは第三者配信の広告サービスとして Google AdSense を利用しています。
        </p>
        <p>
          Google などの第三者配信事業者は、Cookie を使用して、
          利用者が過去に当サイトや他のサイトへアクセスした情報に基づいて広告を配信することがあります。
        </p>
        <p>
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            広告設定
          </a>
          で、パーソナライズ広告を無効にできます。
          第三者配信事業者による Cookie の使用を無効にする方法は
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            www.aboutads.info
          </a>
          に記載されています。
        </p>
      </section>

      <section>
        <h2>アフィリエイトプログラム</h2>
        <p>
          当サイトの一部の記事には、楽天アフィリエイトによる紹介リンクを掲載しています。
          リンクを経由して商品が購入された場合、当サイトに紹介料が支払われることがあります。
        </p>
        <p>
          紹介料の有無が、紹介する内容の評価を変えることはありません。
          実際に使ったものについて、良かった点と良くなかった点の両方を書きます。
        </p>
      </section>

      <section>
        <h2>コメントと有料記事</h2>
        <p>
          記事へのコメント機能として Cusdis を、有料記事とサポートの仕組みとして codoc を利用しています。
          いずれも各サービスの提供者がデータを保持します。
          投稿された内容は各サービスのポリシーに従って扱われます。
        </p>
        <p>
          コメントは公開前に運営者が確認します。個人情報、誹謗中傷、宣伝を含むものは公開しません。
        </p>
      </section>

      <section>
        <h2>お問い合わせと見積依頼</h2>
        <p>
          お問い合わせと見積依頼は、Google フォームで受け付けています。
          入力された氏名、返信先、相談内容は返信のためだけに使用し、
          <strong>本人の許可なく公開したり、第三者へ提供したりしません</strong>。
        </p>
        <p>
          実績として紹介する場合は、必ず事前に明示的な許可を得ます。
        </p>
      </section>

      <section>
        <h2>埋め込みコンテンツ</h2>
        <p>
          記事や解説動画のページには、YouTube の動画を埋め込んでいる場合があります。
          埋め込みコンテンツを含むページを閲覧すると、その提供元のサイトを訪問した場合と同様に、
          提供元が Cookie を使用したりデータを収集したりすることがあります。
        </p>
      </section>

      <section>
        <h2>Cookie の無効化</h2>
        <p>
          Cookie は、ブラウザの設定で無効にできます。無効にした場合、
          一部の機能が正しく動作しないことがあります。設定方法はお使いのブラウザのヘルプをご確認ください。
        </p>
      </section>

      <section>
        <h2>免責事項</h2>
        <p>
          当サイトの記事は、掲載時点で確認した内容をもとに書いています。
          正確であるよう努めていますが、内容の完全性や最新性を保証するものではありません。
          記載された情報を利用して生じた損害について、責任を負いかねます。
        </p>
        <p>
          技術記事のコードや設定は、ご自身の環境で検証のうえご利用ください。
          学習記録や資格試験に関する記事は、運営者個人の経験と判断であり、結果を保証するものではありません。
        </p>
      </section>

      <section>
        <h2>著作権</h2>
        <p>
          当サイトに掲載している文章、コード、画像、動画の著作権は運営者に帰属します。
          引用の範囲を超えて転載する場合は、<Link href="/contact/">お問い合わせ</Link>からご連絡ください。
        </p>
        <p>
          記事内で引用している第三者の著作物については、それぞれの権利者に帰属します。
          権利者の方で掲載内容に問題がある場合は、お問い合わせからご連絡ください。速やかに対応します。
        </p>
      </section>

      <section>
        <h2>改定</h2>
        <p>
          このポリシーは、必要に応じて改定します。改定した場合は、このページに反映します。
        </p>
        <p className="legal-updated">最終更新日: 2026年8月24日</p>
      </section>
    </main>
  )
}
