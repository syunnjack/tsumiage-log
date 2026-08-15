import type { MetadataRoute } from "next"

export const dynamic = "force-static"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: [
      "https://syunnjack.dev/sitemap.xml",
      "https://syunnjack.dev/video-sitemap.xml",
    ],
    host: "https://syunnjack.dev",
  }
}
