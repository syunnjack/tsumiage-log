import type { Metadata } from "next"
import Script from "next/script"
import GlobalNav from "./components/GlobalNav"
import "./globals.css"

const googleAnalyticsId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()
const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

export const metadata: Metadata = {
  metadataBase: new URL("https://syunnjack.dev"),
  title: "積み上げログ | 学び、作り、振り返る開発記録",
  description: "パソコンが苦手な方には専門用語をかみくだいて、ITエンジニアには実装やコミットまで深く解説するsyunnjackの技術ブログです。",
  openGraph: { title: "積み上げログ", description: "学び、作り、振り返る開発記録", url: "https://syunnjack.dev", siteName: "積み上げログ", locale: "ja_JP", type: "website", images: [{ url: "/og.png", width: 1731, height: 909, alt: "積み上げログ" }] },
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
        {children}
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
      </body>
    </html>
  )
}
