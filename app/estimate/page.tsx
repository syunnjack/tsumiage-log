import type { Metadata } from "next"
import BusinessPage from "../components/BusinessPage"
import InquiryForm from "../components/InquiryForm"
export const metadata: Metadata = { title: "見積依頼 | 積み上げログ", description: "Web制作・システム開発・自動化・技術相談の見積もりを依頼できます。", alternates: { canonical: "/estimate" } }
export default function EstimatePage() { return <BusinessPage eyebrow="REQUEST A QUOTE" title="見積もりを依頼する" lead="目的、希望時期、予算の目安をお送りください。内容を確認して、実現方法と作業範囲を整理します。"><section className="business-section form-section"><div><h2>依頼前にご確認ください</h2><p>見積もりは相談内容を確認したうえで個別に作成します。契約や支払いは、条件に合意してから進めます。</p><p>送信時はGitHub Issue作成画面へ移動します。機密情報・個人情報・未公開資料は入力しないでください。</p></div><InquiryForm type="estimate" /></section></BusinessPage> }
