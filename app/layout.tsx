import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://syunnjack.dev"),
  title: "積み上げログ | 学び、作り、振り返る開発記録",
  description:
    "Web開発の実装、失敗、判断を積み上げるsyunnjackの技術ブログ。Reactを使った個人開発と学習の過程を記録します。",
  openGraph: {
    title: "積み上げログ",
    description: "学び、作り、振り返る開発記録",
    url: "https://syunnjack.dev",
    siteName: "積み上げログ",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.png", width: 1733, height: 909, alt: "積み上げログ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "積み上げログ",
    description: "学び、作り、振り返る開発記録",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
