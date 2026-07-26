import type { Metadata } from "next"
import Link from "next/link"
import BusinessPage from "../components/BusinessPage"
import { articles } from "../lib/repository-articles"
export const metadata: Metadata = { title: "ポートフォリオ | 積み上げログ", description: "syunnjackが開発したWebアプリ、業務支援ツール、自動化システムの実績を紹介します。", alternates: { canonical: "/portfolio" } }
const featured = articles.slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 12)
export default function PortfolioPage() { return <BusinessPage eyebrow="PORTFOLIO" title="作ったものと、解決した課題" lead="公開リポジトリと開発記録に基づく実績です。設計・実装・改善の過程まで確認できます。"><section className="business-section"><div className="section-heading"><div><h2>開発実績</h2></div><p>{articles.length}件の公開記事から、最近更新したプロジェクトを掲載しています。</p></div><div className="work-grid">{featured.map((item) => <article key={item.slug}><span>{item.primaryLanguage}</span><h2>{item.displayName}</h2><p>{item.description}</p><div>{item.languages.slice(0, 4).map((tag) => <small key={tag}>{tag}</small>)}</div><Link href={`/articles/${item.slug}`}>設計と実装を見る →</Link></article>)}</div></section></BusinessPage> }
