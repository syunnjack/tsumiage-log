import Link from "next/link"

/**
 * 全ページ共通のフッター。
 *
 * これまでフッターが無く、プライバシーポリシーへの導線がどこにも
 * 無かった。AdSense の審査では、運営者・連絡先・プライバシーポリシーに
 * どのページからでも辿れることを見られる。
 */
export default function GlobalFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="global-footer">
      <div className="global-footer-inner">
        <div className="global-footer-brand">
          <strong>積み上げログ</strong>
          <p>学び、作り、振り返る開発記録</p>
        </div>

        <nav aria-label="サイト情報">
          <p className="global-footer-heading">サイト情報</p>
          <Link href="/profile/">運営者について</Link>
          <Link href="/privacy/">プライバシーポリシー</Link>
          <Link href="/contact/">お問い合わせ</Link>
        </nav>

        <nav aria-label="コンテンツ">
          <p className="global-footer-heading">コンテンツ</p>
          <Link href="/articles/">記事一覧</Link>
          <Link href="/videos/">動画</Link>
          <Link href="/portfolio/">制作物</Link>
          <Link href="/sites/">運営サイト一覧</Link>
          <Link href="/beginner/">パソコン操作でお困りの方へ</Link>
          <a href="https://x.com/chitamarudev" rel="me noopener" target="_blank">X（@chitamarudev）</a>
        </nav>

        <nav aria-label="サービス">
          <p className="global-footer-heading">サービス</p>
          <Link href="/services/">サービス内容</Link>
          <Link href="/estimate/">見積依頼</Link>
          <Link href="/store/">ストア</Link>
          <Link href="/crowdsourcing/">クラウドソーシング</Link>
        </nav>
      </div>

      <p className="global-footer-note">
        当サイトは Google AdSense および楽天アフィリエイトによる広告を掲載しています。
        詳細は<Link href="/privacy/">プライバシーポリシー</Link>に記載しています。
      </p>

      <p className="global-footer-copy">© {year} 積み上げログ</p>
    </footer>
  )
}
