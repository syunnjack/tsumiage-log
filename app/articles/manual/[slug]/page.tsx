import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getManualArticle, manualArticles } from "../../../lib/manual-articles"
import { formatDate } from "../../../lib/repository-articles"
import Comments from "../../../components/Comments"

export const dynamicParams = false
export const generateStaticParams = () =>
  manualArticles.length
    ? manualArticles.map(({ slug }) => ({ slug }))
    : [{ slug: "__empty" }]

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getManualArticle((await params).slug)
  if (!article) return {}
  const image = article.thumbnail ?? "/og.png"
  return {
    title: `${article.title} | 積み上げログ`,
    description: article.description,
    alternates: { canonical: `/articles/manual/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      tags: article.tags,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [image],
    },
  }
}

export default async function ManualArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getManualArticle((await params).slug)
  if (!article) notFound()
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
    publisher: { "@type": "Organization", name: "積み上げログ", url: "https://syunnjack.dev" },
    mainEntityOfPage: `https://syunnjack.dev/articles/manual/${article.slug}`,
    keywords: article.tags.join(", "),
    ...(article.thumbnail ? { image: `https://syunnjack.dev${article.thumbnail}` } : {}),
  }
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev" },
      { "@type": "ListItem", position: 2, name: "技術記事", item: "https://syunnjack.dev/articles" },
      { "@type": "ListItem", position: 3, name: article.title, item: `https://syunnjack.dev/articles/manual/${article.slug}` },
    ],
  }

  return <main className="tech-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="article-site-header">
      <Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>技術ブログ</small></span></Link>
      <Link href="/articles">記事一覧へ</Link>
    </header>
    <article>
      <header className="article-hero">
        <p className="eyebrow"><span />自主執筆記事</p>
        <h1>{article.title}</h1>
        <p className="article-summary">{article.description}</p>
        <div className="article-facts"><span>{article.category}</span><span>公開: {formatDate(article.publishedAt)}</span><span>更新: {formatDate(article.updatedAt)}</span></div>
        <div className="manual-tags">{article.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        {article.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="manual-article-thumbnail" src={article.thumbnail} alt={article.title} width={1200} height={630} />
        )}
      </header>
      <div className="article-layout manual-article-layout">
        <aside className="article-toc"><strong>この記事の内容</strong>{article.sections.map((section, index) => <a href={`#section-${index + 1}`} key={section.heading}>{section.heading}</a>)}</aside>
        <div className="article-content">
          {article.sections.map((section, index) => <section id={`section-${index + 1}`} key={section.heading}>
            <p className="section-kicker">{String(index + 1).padStart(2, "0")} / 本文</p>
            <h2>{section.heading}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.code && <pre><code className={`language-${section.code.language}`}>{section.code.content}</code></pre>}
          </section>)}
          <aside className="source-note"><strong>この記事について</strong><p>本人が経験・検証・考察をもとに執筆したオリジナル記事です。</p></aside>
          <Comments />
        </div>
      </div>
    </article>
  </main>
}
