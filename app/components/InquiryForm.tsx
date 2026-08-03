const privateFormBaseUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSc48vA1cJ0FcEhokD2O9OjvVqDaFKMg5lhqr_ziP0vg9sRe3g/viewform"

const estimateFormUrl =
  `${privateFormBaseUrl}?hl=ja&usp=pp_url&entry.1152561291=${encodeURIComponent("見積依頼")}`

export default function InquiryForm({ type }: { type: "estimate" | "contact" }) {
  const isEstimate = type === "estimate"
  const formUrl = isEstimate ? estimateFormUrl : `${privateFormBaseUrl}?hl=ja&usp=publish-editor`
  const title = isEstimate ? "非公開の見積依頼フォーム" : "非公開のお問い合わせフォーム"

  return <div className="private-inquiry-form">
    <div className="privacy-confirmation">
      <strong>お問い合わせ内容は公開されません</strong>
      <p>回答はGoogleフォームで非公開に受け付けます。GitHub Issueは作成せず、氏名、返信先、相談内容をGitHubやブログへ送信しません。</p>
      <p>お客様のコードや資料を実績として紹介する場合も、対象と範囲について事前に明示的な許可を得ます。</p>
    </div>
    <iframe
      className="private-inquiry-embed"
      src={formUrl}
      title={title}
      loading="lazy"
    >
      読み込めない場合は非公開フォームを別画面で開いてください。
    </iframe>
    <a className="private-form-link" href={formUrl} target="_blank" rel="noopener noreferrer">
      非公開フォームを別画面で開く →
    </a>
  </div>
}
