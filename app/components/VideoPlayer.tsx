"use client"

import Link from "next/link"
import { useState } from "react"

type VideoPlayerProps = {
  fallbackHref?: string
  className?: string
  poster?: string
  preload?: "none" | "metadata"
  src: string
  title: string
}

export function VideoPlayer({
  fallbackHref,
  className = "published-video",
  poster,
  preload = "none",
  src,
  title,
}: VideoPlayerProps) {
  const [hasError, setHasError] = useState(false)
  const [attempt, setAttempt] = useState(0)

  if (hasError) {
    return (
      <div className={`${className} video-playback-error`} role="status">
        <strong>動画を読み込めませんでした</strong>
        <span>通信状況を確認して再読み込みするか、別の方法で内容をご確認ください。</span>
        <div>
          <button
            type="button"
            onClick={() => {
              setAttempt((current) => current + 1)
              setHasError(false)
            }}
          >
            再読み込み
          </button>
          <a href={src} rel="noopener noreferrer" target="_blank">動画ファイルを開く ↗</a>
          {fallbackHref ? <Link href={fallbackHref}>技術記事を読む →</Link> : null}
        </div>
      </div>
    )
  }

  return (
    <video
      key={attempt}
      aria-label={title}
      className={className}
      controls
      onError={() => setHasError(true)}
      playsInline
      poster={poster}
      preload={preload}
    >
      <source src={src} type="video/mp4" />
      お使いのブラウザーは動画再生に対応していません。
    </video>
  )
}
