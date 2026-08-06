import type { ReactNode } from "react"
import Link from "next/link"

export default function BusinessPage({ eyebrow, title, lead, schemas, children }: { eyebrow: string; title: string; lead: string; schemas?: object[]; children: ReactNode }) {
  return <main className="business-page">{schemas?.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}<section className="business-hero"><p className="eyebrow"><span />{eyebrow}</p><h1>{title}</h1><p>{lead}</p></section>{children}<section className="business-cta"><h2>まずは目的と課題をお聞かせください</h2><p>内容が固まっていない段階でも、実現方法と進め方を一緒に整理します。</p><div><Link className="button primary" href="/estimate">見積もりを依頼する →</Link><Link className="button secondary" href="/contact">問い合わせる</Link></div></section></main>
}
