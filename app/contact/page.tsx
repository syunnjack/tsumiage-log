import type { Metadata } from "next"
import BusinessPage from "../components/BusinessPage"
import InquiryForm from "../components/InquiryForm"
export const metadata: Metadata = { title: "お問い合わせ | 積み上げログ", description: "積み上げログの記事、開発実績、サービスについて問い合わせできます。", alternates: { canonical: "/contact" } }
export default function ContactPage() { return <BusinessPage eyebrow="CONTACT" title="お問い合わせ" lead="記事へのご感想、掲載内容、開発相談、協業についてご連絡ください。"><section className="business-section form-section"><div><h2>ご連絡について</h2><p>内容を確認し、返信先として指定された方法で連絡します。営業目的の一斉送信には対応しません。</p><p>公開できない内容を含む場合は、GitHubプロフィール経由で非公開の連絡方法をご相談ください。</p></div><InquiryForm type="contact" /></section></BusinessPage> }
