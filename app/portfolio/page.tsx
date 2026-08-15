import type { Metadata } from "next"
import Link from "next/link"
import BusinessPage from "../components/BusinessPage"
import { articles } from "../lib/repository-articles"
const title = "ポートフォリオ | 積み上げログ"
const description = "syunnjackが開発したWebアプリ、業務支援ツール、自動化システムの実績を紹介します。"
export const metadata: Metadata = { title, description, alternates: { canonical: "/portfolio/" }, openGraph: { title, description, type: "website", url: "/portfolio/", images: ["/og.png"] }, twitter: { card: "summary_large_image", title, description, images: ["/og.png"] } }
const featured = articles.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12)
const collectionSchema = { "@context": "https://schema.org", "@type": "CollectionPage", name: "ポートフォリオ", description, url: "https://syunnjack.dev/portfolio/", isPartOf: { "@type": "WebSite", name: "積み上げログ", url: "https://syunnjack.dev/" }, numberOfItems: featured.length, hasPart: featured.map((item) => ({ "@type": "CreativeWork", name: item.displayName, description: item.description, url: `https://syunnjack.dev/articles/${item.slug}/` })) }
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" }, { "@type": "ListItem", position: 2, name: "ポートフォリオ", item: "https://syunnjack.dev/portfolio/" }] }
export default function PortfolioPage() { return <BusinessPage eyebrow="PORTFOLIO" title="作ったものと、解決した課題" lead="公開リポジトリと開発記録に基づく実績です。設計・実装・改善の過程まで確認できます。" schemas={[collectionSchema, breadcrumbSchema]}><section className="business-section"><div className="section-heading"><div><h2>開発実績</h2></div><p>{articles.length}件の公開記事から、最近更新したプロジェクトを掲載しています。</p></div><div className="work-grid">{featured.map((item) => <article key={item.slug}><span>{item.primaryLanguage}</span><h2>{item.displayName}</h2><p>{item.description}</p><div>{item.languages.slice(0, 4).map((tag) => <small key={tag}>{tag}</small>)}</div><Link href={`/articles/${item.slug}/`}>設計と実装を見る →</Link></article>)}</div></section></BusinessPage> }
