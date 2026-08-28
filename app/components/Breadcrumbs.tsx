"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const labels: Record<string, string> = {
  articles: "記事", manual: "自主執筆", beginner: "スマホ・パソコンの操作・設定でお困りの方へ",
  "career-support": "キャリア・学習", contact: "お問い合わせ", estimate: "見積依頼",
  portfolio: "ポートフォリオ", sites: "運営サイト一覧", profile: "プロフィール", services: "サービス", store: "ストア",
  crowdsourcing: "クラウドソーシング",
  videos: "動画", favorites: "お気に入り動画", tools: "ツール", recipe: "レシピ検索",
}

function segmentLabel(segment: string, index: number, segments: string[]) {
  if (labels[segment]) return labels[segment]
  if (segments[0] === "articles") return index === segments.length - 1 ? "記事詳細" : "記事"
  return decodeURIComponent(segment).replaceAll("-", " ")
}

export default function Breadcrumbs() {
  const segments = usePathname().split("/").filter(Boolean)
  if (segments.length === 0) return null

  return <nav className="site-breadcrumbs" aria-label="パンくずリスト"><ol>
    <li><Link href="/">ホーム</Link></li>
    {segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}/`
      const current = index === segments.length - 1
      return <li key={href} aria-current={current ? "page" : undefined}>
        {current ? <span>{segmentLabel(segment, index, segments)}</span> : <Link href={href}>{segmentLabel(segment, index, segments)}</Link>}
      </li>
    })}
  </ol></nav>
}
