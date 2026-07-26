import Link from "next/link"

const items = [
  ["記事", "/articles"],
  ["ポートフォリオ", "/portfolio"],
  ["プロフィール", "/profile"],
  ["サービス", "/services"],
  ["見積依頼", "/estimate"],
  ["お問い合わせ", "/contact"],
  ["お気に入り動画", "/videos/favorites"],
]

export default function GlobalNav() {
  return <header className="global-header">
    <Link className="global-brand" href="/"><span>つ</span><strong>積み上げログ<small>TSUMIAGE LOG</small></strong></Link>
    <nav aria-label="グローバルメニュー">{items.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="global-github" href="https://github.com/syunnjack">GitHub ↗</Link>
  </header>
}
