import type { Metadata } from "next"
import BusinessPage from "../components/BusinessPage"
import InquiryForm from "../components/InquiryForm"
const title = "見積依頼 | 積み上げログ"
const description = "Web制作・システム開発・自動化・技術相談の見積もりを依頼できます。"
export const metadata: Metadata = { title, description, alternates: { canonical: "/estimate" }, openGraph: { title, description, type: "website", url: "/estimate", images: ["/og.png"] }, twitter: { card: "summary_large_image", title, description, images: ["/og.png"] } }
const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" }, { "@type": "ListItem", position: 2, name: "見積依頼", item: "https://syunnjack.dev/estimate" }] }
export default function EstimatePage() { return <BusinessPage eyebrow="REQUEST A QUOTE" title="見積もりを依頼する" lead="希望するサービス、時期、予算の目安を非公開フォームからお送りください。内容を確認して、実現方法と作業範囲を整理します。" schemas={[breadcrumbSchema]}><section className="business-section form-section"><div><h2>お客様の情報は許可なく公開しません</h2><p>見積依頼は非公開のGoogleフォームで受け付けます。お客様のコード、設計資料、個人情報、秘密情報、相談内容をGitHubやブログへ送信・掲載しません。</p><p>初回はコードや資料を添付せず、目的と課題の概要だけをお知らせください。詳しい内容は、必要に応じて安全な共有方法を確認してから受け取ります。</p><p>制作物を実績として紹介する場合も、対象と範囲について事前に明示的な許可を得ます。</p></div><InquiryForm type="estimate" /></section></BusinessPage> }
