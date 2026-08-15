import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import Comments from "../../components/Comments"
import { getArticleSeo } from "../../lib/article-seo"
import { articles, formatCommitMessage, formatDate, getArticle, inferArchitecture } from "../../lib/repository-articles"
import { canonicalPath } from "../../lib/site-url"
import { videoWatchPath } from "../../lib/video-library"
import videoProduction from "../../data/video-production.json"

export const generateStaticParams = () => articles.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug)
  if (!article) return {}
  const { title, description } = getArticleSeo(article)
  const canonical = canonicalPath(`/articles/${article.slug}`)
  return { title: `${title} | 積み上げログ`, description, alternates: { canonical },
    openGraph: { title, description, type: "article", url: canonical, modifiedTime: article.updatedAt, images: ["/og.png"] } }
}

export default async function RepositoryArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug)
  if (!article) notFound()
  const articleSeo = getArticleSeo(article)
  const architecture = inferArchitecture(article)
  const repositoryVideo = videoProduction.videos.find((video) => video.slug === article.slug)
  const youtubeUrl = article.slug === "rakuten02" ? "https://youtu.be/mQ8Nl4Qk_io" : repositoryVideo?.youtubeUrl
  const hasVideo = Boolean(repositoryVideo?.localVideoUrl)
  const watchPath = videoWatchPath(article.slug)
  const faq = [
    { q: `${article.name}は何を作るプロジェクトですか？`, a: article.description },
    { q: `${article.name}の主要技術は何ですか？`, a: `${article.languages.join("、") || article.primaryLanguage}を中心に構成されています。` },
    { q: "この記事の情報源は何ですか？", a: "公開README、リポジトリ構成、既定ブランチのGitHubコミット履歴です。" },
  ]
  const techArticle = { "@context": "https://schema.org", "@type": "TechArticle",
    headline: articleSeo.title, description: articleSeo.description,
    datePublished: article.commits.at(-1)?.date ?? article.updatedAt, dateModified: article.updatedAt,
    author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
    publisher: { "@type": "Organization", name: "積み上げログ", url: "https://syunnjack.dev/" },
    mainEntityOfPage: `https://syunnjack.dev/articles/${article.slug}/`, isBasedOn: article.url, about: article.languages }
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "ホーム", item: "https://syunnjack.dev/" },
      { "@type": "ListItem", position: 2, name: "技術記事", item: "https://syunnjack.dev/articles/" },
      { "@type": "ListItem", position: 3, name: article.name, item: `https://syunnjack.dev/articles/${article.slug}/` },
    ] }

  return <main className="tech-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticle) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="article-site-header"><Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>技術ブログ</small></span></Link><Link href="/articles/">記事一覧へ</Link></header>
    <article>
      {hasVideo ? <aside className="article-video-published"><div><p>技術解説動画</p><h2>{article.displayName}の技術解説</h2><span>動画を主役にした専用ページで、目的、構成、コミットによる改善を約75秒で確認できます。</span></div><Link className="article-video-watch-link" href={watchPath}>動画を再生する ▶</Link>{youtubeUrl ? <a href={youtubeUrl}>YouTubeで見る ↗</a> : null}</aside> : null}
      <header className="article-hero">
        <p className="eyebrow"><span />リポジトリ技術解説</p>
        <h1>{articleSeo.title}</h1>
        <p className="article-summary">{article.description}</p>
        <div className="article-facts"><span>主要言語: {article.primaryLanguage}</span><span>更新: {formatDate(article.updatedAt)}</span><span>根拠コミット: {article.commits.length}件</span></div>
      </header>
      <aside className={`article-video-cta${hasVideo ? "" : " video-article-only"}`}>
        <div className="video-cta-icon" aria-hidden="true">{hasVideo ? "▶" : "文"}</div>
        <div>
          <p>{hasVideo ? "動画で理解する" : "記事で理解する"}</p>
          <h2>{hasVideo ? "設計図、コード、コミットの変化を動画で確認" : "このプロジェクトは記事で解説しています"}</h2>
          <span>{hasVideo ? "技術記事と解説動画を行き来しながら、実装判断と改善の流れを理解できます。" : "構成、技術選定、コミットの変化を、以下の本文で詳しく確認できます。"}</span>
        </div>
        {hasVideo ? <Link href={watchPath}>技術解説動画を見る →</Link> : <span className="video-status-label">動画未掲載</span>}
      </aside>
      <div className="article-layout">
        <aside className="article-toc"><strong>この記事の内容</strong><a href="#answer">要点</a><a href="#overview">概要</a><a href="#stack">技術構成</a><a href="#architecture">設計</a><a href="#history">実装の変遷</a><a href="#learning">学び</a><a href="#faq">よくある質問</a></aside>
        <div className="article-content">
          <section className="direct-answer" id="answer"><p>30秒で分かる要点</p><h2>{article.name}とは？</h2><p>{article.description} 主に{article.languages.join("、") || article.primaryLanguage}を使用し、公開コミットから機能追加と改善を積み重ねた過程を確認できます。</p></section>
          <section id="overview"><p className="section-kicker">01 / 概要</p><h2>プロジェクトの概要と目的</h2><p>{article.readmeExcerpt || article.description}</p><p>本記事は公開されている構成と <code>{article.defaultBranch}</code> ブランチのコミットを一次情報として整理しています。</p></section>
          <section id="stack"><p className="section-kicker">02 / 使用技術</p><h2>使用技術と役割</h2><div className="technology-table">{(article.languages.length ? article.languages : [article.primaryLanguage]).map((language, index) => <div key={language}><span>{String(index + 1).padStart(2, "0")}</span><strong>{language}</strong><p>{index ? "UI、設定、周辺機能またはビルド工程を支える技術です。" : "主要な実装言語として、プロダクトの中心機能を構成します。"}</p></div>)}</div></section>
          <section id="architecture"><p className="section-kicker">03 / 設計</p><h2>構成から読み解く設計</h2><p>主な項目は {article.files.slice(0, 8).map((file, i) => <span key={file}>{i > 0 && "、"}<code>{file}</code></span>)} です。</p><ul>{architecture.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section id="history"><p className="section-kicker">04 / 変更履歴</p><h2>コミットから見る実装の変遷</h2><p>以下は既定ブランチの直近の変更です。リンク先で原文と一次情報を確認できます。</p><ol className="commit-history">{article.commits.map((commit) => <li key={commit.sha}><time>{formatDate(commit.date)}</time><div><strong>{formatCommitMessage(commit.message)}</strong><a href={commit.url}>{commit.sha}をGitHubで確認 ↗</a></div></li>)}</ol></section>
          <section id="learning"><p className="section-kicker">05 / 学び</p><h2>このプロジェクトから得られる学び</h2><ul className="learning-list"><li><strong>変更を小さく記録する</strong><p>コミット単位で目的を分けると、実装の意図を追跡しやすくなります。</p></li><li><strong>構成と技術選定を結び付ける</strong><p>{article.primaryLanguage}の採用理由と各ディレクトリの責務を説明できることが保守性につながります。</p></li><li><strong>READMEと実装を同時に育てる</strong><p>説明とコードを近い状態に保つことが、再利用と振り返りを助けます。</p></li></ul></section>
          <section id="faq"><p className="section-kicker">06 / よくある質問</p><h2>よくある質問</h2><div className="faq-list">{faq.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
          <aside className="source-note"><strong>情報の透明性</strong><p>{formatDate(article.updatedAt)}時点の公開GitHub情報を基にしています。</p><a href={article.url}>GitHubリポジトリを見る ↗</a></aside>
          <Comments />
        </div>
      </div>
    </article>
  </main>
}
