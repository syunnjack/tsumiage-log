"use client"
import { FormEvent, useState } from "react"

export default function InquiryForm({ type }: { type: "estimate" | "contact" }) {
  const [error, setError] = useState("")
  const isEstimate = type === "estimate"
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "").trim()
    const reply = String(form.get("reply") || "").trim()
    const message = String(form.get("message") || "").trim()
    if (!name || !reply || message.length < 20) { setError("お名前・返信先と、20文字以上の相談内容を入力してください。"); return }
    const fields = isEstimate ? `\n- 希望サービス: ${form.get("service")}\n- 希望時期: ${form.get("schedule")}\n- 予算の目安: ${form.get("budget")}` : ""
    const title = encodeURIComponent(`${isEstimate ? "見積依頼" : "お問い合わせ"}: ${name}`)
    const body = encodeURIComponent(`## ご連絡内容\n\n- お名前・組織名: ${name}\n- 返信先: ${reply}${fields}\n\n## 詳細\n\n${message}\n\n> 公開したくない情報は記載しないでください。`)
    window.location.href = `https://github.com/syunnjack/tsumiage-log/issues/new?title=${title}&body=${body}&labels=${isEstimate ? "estimate" : "contact"}`
  }
  return <form className="inquiry-form" onSubmit={submit}>
    <label>お名前・組織名<span>必須</span><input name="name" autoComplete="name" required /></label>
    <label>返信先<span>必須</span><input name="reply" placeholder="メールアドレス、GitHubユーザー名など" required /></label>
    {isEstimate && <><label>希望サービス<select name="service"><option>Webサイト・LP制作</option><option>業務支援システム開発</option><option>既存サイト改善・自動化</option><option>技術相談・調査</option><option>その他</option></select></label><label>希望時期<input name="schedule" placeholder="例：2026年9月まで" /></label><label>予算の目安<select name="budget"><option>相談して決めたい</option><option>5万円未満</option><option>5万〜20万円</option><option>20万〜50万円</option><option>50万円以上</option></select></label></>}
    <label>相談内容<span>必須</span><textarea name="message" rows={8} placeholder="目的、現在の課題、希望する成果などをお書きください。機密情報は入力しないでください。" required /></label>
    <label className="consent"><input type="checkbox" required />GitHub上で公開される可能性があることに同意します。</label>
    {error && <p className="form-error" role="alert">{error}</p>}
    <button type="submit">GitHubで内容を確認して送信 →</button>
  </form>
}
