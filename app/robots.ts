import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    // 動画サイトマップは出さない。視聴ページは noindex なので、
    // サイトマップで申告しても検索結果には出ず、申告と実態が食い違うだけ
    // （2026-08-25 に削除）。
    sitemap: ["https://syunnjack.dev/sitemap.xml"],
    host: "https://syunnjack.dev",
  }
}
