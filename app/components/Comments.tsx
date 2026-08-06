"use client"

import { useEffect, useRef } from "react"

const giscusRepo = process.env.NEXT_PUBLIC_GISCUS_REPO?.trim()
const giscusRepoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID?.trim()
const giscusCategory = process.env.NEXT_PUBLIC_GISCUS_CATEGORY?.trim()
const giscusCategoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID?.trim()
const giscusReady = Boolean(giscusRepo && giscusRepoId && giscusCategory && giscusCategoryId)

export default function Comments() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!giscusReady || !containerRef.current) return
    const script = document.createElement("script")
    script.src = "https://giscus.app/client.js"
    script.async = true
    script.crossOrigin = "anonymous"
    script.setAttribute("data-repo", giscusRepo!)
    script.setAttribute("data-repo-id", giscusRepoId!)
    script.setAttribute("data-category", giscusCategory!)
    script.setAttribute("data-category-id", giscusCategoryId!)
    script.setAttribute("data-mapping", "pathname")
    script.setAttribute("data-strict", "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme", "light")
    script.setAttribute("data-lang", "ja")
    containerRef.current.appendChild(script)
  }, [])

  if (!giscusReady) return null

  return (
    <section className="comments-section" aria-labelledby="comments-heading">
      <p className="section-kicker">コメント</p>
      <h2 id="comments-heading">この記事へのコメント</h2>
      <p>GitHubアカウントでログインして、感想や質問を残せます。</p>
      <div ref={containerRef} />
    </section>
  )
}
