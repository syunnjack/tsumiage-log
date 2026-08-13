import Link from "next/link"

const items = [
  ["ストア", "/store"],
  ["クラウドソーシング", "/crowdsourcing"],
  ["サービス", "/services"],
  ["見積依頼", "/estimate"],
  ["お問い合わせ", "/contact"],
  ["このブログについて", "/#about"],
  ["スマホ・パソコンの操作・設定でお困りの方へ", "/beginner"],
  ["キャリア・学習", "/career-support"],
  ["動画", "/videos"],
  ["お気に入り動画", "/videos/favorites"],
]

export default function GlobalNav() {
  return <header className="global-header">
    <Link className="global-brand" href="/"><span>つ</span><strong>積み上げログ<small>技術ブログ</small></strong></Link>
    <nav aria-label="グローバルメニュー">{items.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav>
    <Link className="global-github" href="https://github.com/syunnjack">GitHub ↗</Link>
  </header>
}
