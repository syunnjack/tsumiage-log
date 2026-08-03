import type { Metadata } from "next"
import BusinessPage from "../components/BusinessPage"
import InquiryForm from "../components/InquiryForm"
export const metadata: Metadata = { title: "お問い合わせ | 積み上げログ", description: "積み上げログの記事、開発実績、サービスについて問い合わせできます。", alternates: { canonical: "/contact" } }
export default function ContactPage() { return <BusinessPage eyebrow="CONTACT" title="お問い合わせ" lead="記事へのご感想、掲載内容、開発相談、協業について、非公開フォームからご連絡ください。"><section className="business-section form-section"><div><h2>お問い合わせは公開されません</h2><p>お問い合わせは非公開のGoogleフォームで受け付け、指定された返信先へ連絡します。氏名、返信先、相談内容をGitHub Issueやブログへ掲載しません。</p><p>初回はコード、設計資料、個人情報、秘密情報を入力せず、相談の概要だけをお知らせください。実績として紹介する場合も、必ず事前に明示的な許可を得ます。</p></div><InquiryForm type="contact" /></section></BusinessPage> }
