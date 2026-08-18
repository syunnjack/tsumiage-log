"use client"

import { useEffect, useRef } from "react"

// Cusdis はログイン不要のコメントサービス。読者は名前だけで投稿でき、
// 公開前に管理画面で承認する運用ができる。giscus と違い GitHub アカウントを要求しない。
const cusdisAppId = process.env.NEXT_PUBLIC_CUSDIS_APP_ID?.trim()
const cusdisHost = process.env.NEXT_PUBLIC_CUSDIS_HOST?.trim() || "https://cusdis.com"
const cusdisReady = Boolean(cusdisAppId)

// Cusdis の既定 UI は英語なので、表示文言を日本語に差し替える
const localeJa = {
  powered_by: "",
  post_comment: "コメントを送信",
  email: "メールアドレス（任意・公開されません）",
  nickname: "お名前",
  reply: "返信",
  content_placeholder: "記事の感想や質問をどうぞ",
  loading: "読み込み中…",
  submitting: "送信中…",
  comment_has_been_sent: "送信しました。確認のうえ公開されます。",
  mode_markdown: "Markdown",
  // Cusdis 既定の英語 preview ラベルの訳。copy:audit の禁止語を避けた言い回しにしている
  mode_preview: "表示を確認",
}

declare global {
  interface Window {
    CUSDIS_LOCALE?: Record<string, string>
    CUSDIS?: { initial: () => void }
  }
}

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cusdisReady || !containerRef.current) return

    window.CUSDIS_LOCALE = localeJa

    // 記事ごとの識別子。trailingSlash: true の設定で末尾に "/" が付くため、
    // 付いていても付いていなくても同じスレッドになるよう正規化する
    const pageId = window.location.pathname.replace(/\/+$/, "") || "/"

    const thread = document.createElement("div")
    thread.id = "cusdis_thread"
    thread.dataset.host = cusdisHost
    thread.dataset.appId = cusdisAppId!
    thread.dataset.pageId = pageId
    thread.dataset.pageUrl = window.location.href
    thread.dataset.pageTitle = document.title
    containerRef.current.appendChild(thread)

    // 2記事目以降はスクリプトが既に読み込まれているので、再初期化だけ行う
    if (window.CUSDIS) {
      window.CUSDIS.initial()
    } else {
      const script = document.createElement("script")
      script.src = `${cusdisHost}/js/cusdis.es.js`
      script.async = true
      script.defer = true
      document.body.appendChild(script)
    }

    const container = containerRef.current
    return () => {
      container.innerHTML = ""
    }
  }, [])

  if (!cusdisReady) {
    // 未設定のまま本番に出ても空の見出しだけが残らないよう、公開ビルドでは何も描画しない。
    // 開発中は原因が分かるように理由を表示する（環境変数の設定漏れに気づけるようにする）
    if (process.env.NODE_ENV === "development") {
      return (
        <section className="comments-section">
          <p className="section-kicker">コメント</p>
          <p>
            NEXT_PUBLIC_CUSDIS_APP_ID が未設定のため、コメント欄は表示されません。
          </p>
        </section>
      )
    }
    return null
  }

  return (
    <section className="comments-section" aria-labelledby="comments-heading">
      <p className="section-kicker">コメント</p>
      <h2 id="comments-heading">この記事へのコメント</h2>
      <p>
        お名前だけで投稿できます。アカウント登録やログインは不要です。
        いただいたコメントは確認のうえ公開します。
      </p>
      <div ref={containerRef} />
    </section>
  )
}
