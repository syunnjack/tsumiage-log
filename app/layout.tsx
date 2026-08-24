import type { Metadata } from "next"
import Script from "next/script"
import Breadcrumbs from "./components/Breadcrumbs"
import GlobalNav from "./components/GlobalNav"
import "./globals.css"

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()
// codoc（有料記事・サポート）のユーザーコード。未設定なら読み込まない
const codocUserCode = process.env.NEXT_PUBLIC_CODOC_USERCODE?.trim()

export const metadata: Metadata = {
  metadataBase: new URL("https://syunnjack.dev"),
  title: "積み上げログ | 学び、作り、振り返る開発記録",
  description: "パソコンが苦手な方には専門用語をかみくだいて、ITエンジニアには実装やコミットまで深く解説するsyunnjackの技術ブログです。",
  openGraph: { title: "積み上げログ", description: "学び、作り、振り返る開発記録", url: "https://syunnjack.dev/", siteName: "積み上げログ", locale: "ja_JP", type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "積み上げログ" }] },
  twitter: { card: "summary_large_image", title: "積み上げログ", description: "学び、作り、振り返る開発記録", images: ["/og.png"] },
  icons: { icon: "/favicon.svg" },
  verification: googleSiteVerification ? { google: googleSiteVerification } : undefined,
  other: { "google-adsense-account": "ca-pub-1144781774561249" },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "積み上げログ",
  url: "https://syunnjack.dev",
  logo: "https://syunnjack.dev/favicon.svg",
  description: "パソコンが苦手な方には専門用語をかみくだいて、ITエンジニアには実装やコミットまで深く解説するsyunnjackの技術ブログです。",
  founder: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
  sameAs: ["https://github.com/syunnjack"],
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "積み上げログ",
  url: "https://syunnjack.dev",
  description: "学び、作り、振り返る開発記録",
  publisher: { "@type": "Organization", name: "積み上げログ", url: "https://syunnjack.dev" },
  inLanguage: "ja",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <GlobalNav />
        <Breadcrumbs />
        {children}
        {/* AdSense の読み込み。メタタグ（google-adsense-account）だけでは
            広告は出ない。審査でもこのスクリプトの設置を見られる。
            ads.txt は public/ads.txt に置いてある。 */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1144781774561249"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        {googleAnalyticsId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${googleAnalyticsId}');`}
            </Script>
          </>
        ) : null}
        {/* codoc の貼り付けタグはページに1つだけ置く。各記事側は
            components/CodocEntry.tsx が枠を出し、この読み込みが中身を描く。
            next/script だと実行時に差し込まれ、静的HTMLに data-usercode が
            残らない。codoc は自分のscriptタグから属性を読むため、
            公式のスニペットどおり生のタグをHTMLへ直接出す */}
        {codocUserCode ? (
          <script src="https://codoc.jp/js/cms.js" data-usercode={codocUserCode} defer />
        ) : null}
      </body>
    </html>
  )
}
