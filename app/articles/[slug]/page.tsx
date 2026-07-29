import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { articles, formatDate, getArticle, inferArchitecture } from "../../lib/repository-articles"

export const generateStaticParams = () => articles.map(({ slug }) => ({ slug }))

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug)
  if (!article) return {}
  const title = `${article.displayName}の設計・技術選定・コミット履歴を解説`
  const description = `${article.name}で使われた${article.languages.join("、") || article.primaryLanguage}の構成、実装の変遷、学びをGitHubコミットに基づいて解説します。`
  return { title: `${title} | 積み上げログ`, description, alternates: { canonical: `/articles/${article.slug}` },
    openGraph: { title, description, type: "article", url: `/articles/${article.slug}`, modifiedTime: article.updatedAt, images: ["/og.png"] } }
}

export default async function RepositoryArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug)
  if (!article) notFound()
  const architecture = inferArchitecture(article)
  const faq = [
    { q: `${article.name}は何を作るプロジェクトですか？`, a: article.description },
    { q: `${article.name}の主要技術は何ですか？`, a: `${article.languages.join("、") || article.primaryLanguage}を中心に構成されています。` },
    { q: "この記事の情報源は何ですか？", a: "公開README、リポジトリ構成、既定ブランチのGitHubコミット履歴です。" },
  ]
  const techArticle = { "@context": "https://schema.org", "@type": "TechArticle",
    headline: `${article.displayName}の設計・技術選定・コミット履歴を解説`, description: article.description,
    datePublished: article.commits.at(-1)?.date ?? article.updatedAt, dateModified: article.updatedAt,
    author: { "@type": "Person", name: "syunnjack", url: "https://github.com/syunnjack" },
    publisher: { "@type": "Organization", name: "積み上げログ", url: "https://syunnjack.dev" },
    mainEntityOfPage: `https://syunnjack.dev/articles/${article.slug}`, isBasedOn: article.url, about: article.languages }
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }

  return <main className="tech-article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticle) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    <header className="article-site-header"><Link className="brand" href="/"><span className="brand-mark">つ</span><span><strong>積み上げログ</strong><small>TSUMIAGE LOG</small></span></Link><Link href="/articles">記事一覧へ</Link></header>
    <article>
      {article.slug === "rakuten02" && <aside className="article-video-published"><div><p>VIDEO EXPLANATION / PREVIEW</p><h2>Rakuten02の技術解説・試作版</h2><span>終電ホテルの目的、構成、検索処理、SEO・AIO・LLMO対応を75秒で紹介します。</span></div><video controls preload="metadata" poster="/videos/rakuten02-tech-preview.png" aria-label="Rakuten02の技術解説 試作版"><source src="/videos/rakuten02-tech-preview.mp4" type="video/mp4" /></video><Link href="/videos#rakuten02">動画一覧で見る →</Link></aside>}
      <header className="article-hero">
        <nav aria-label="パンくず"><Link href="/">ホーム</Link><span>/</span><Link href="/articles">技術記事</Link><span>/</span><span>{article.name}</span></nav>
        <p className="eyebrow"><span />REPOSITORY DEEP DIVE</p>
        <h1>{article.displayName}の設計・技術選定・コミット履歴を解説</h1>
        <p className="article-summary">{article.description}</p>
        <div className="article-facts"><span>主要言語: {article.primaryLanguage}</span><span>更新: {formatDate(article.updatedAt)}</span><span>根拠コミット: {article.commits.length}件</span></div>
      </header>
      <aside className="article-video-cta">
        <div className="video-cta-icon" aria-hidden="true">▶</div>
        <div>
          <p>VIDEO EXPLANATION / COMING SOON</p>
          <h2>この記事の解説動画を2026年8月に公開予定</h2>
          <span>設計図、コード、コミットの変化を画面で追いながら解説します。</span>
        </div>
        <Link href={`/videos#${article.slug}`}>動画の公開予定を見る →</Link>
      </aside>
      <div className="article-layout">
        <aside className="article-toc"><strong>この記事の内容</strong><a href="#answer">要点</a><a href="#overview">概要</a><a href="#stack">技術構成</a><a href="#architecture">設計</a><a href="#history">実装の変遷</a><a href="#learning">学び</a><a href="#faq">FAQ</a></aside>
        <div className="article-content">
          <section className="direct-answer" id="answer"><p>30秒で分かる要点</p><h2>{article.name}とは？</h2><p>{article.description} 主に{article.languages.join("、") || article.primaryLanguage}を使用し、公開コミットから機能追加と改善を積み重ねた過程を確認できます。</p></section>
          <section id="overview"><p className="section-kicker">01 / OVERVIEW</p><h2>プロジェクトの概要と目的</h2><p>{article.readmeExcerpt || article.description}</p><p>本記事は公開されている構成と <code>{article.defaultBranch}</code> ブランチのコミットを一次情報として整理しています。</p></section>
          <section id="stack"><p className="section-kicker">02 / TECHNOLOGY</p><h2>使用技術と役割</h2><div className="technology-table">{(article.languages.length ? article.languages : [article.primaryLanguage]).map((language, index) => <div key={language}><span>{String(index + 1).padStart(2, "0")}</span><strong>{language}</strong><p>{index ? "UI、設定、周辺機能またはビルド工程を支える技術です。" : "主要な実装言語として、プロダクトの中心機能を構成します。"}</p></div>)}</div></section>
          <section id="architecture"><p className="section-kicker">03 / ARCHITECTURE</p><h2>構成から読み解く設計</h2><p>主な項目は {article.files.slice(0, 8).map((file, i) => <span key={file}>{i > 0 && "、"}<code>{file}</code></span>)} です。</p><ul>{architecture.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section id="history"><p className="section-kicker">04 / COMMIT HISTORY</p><h2>コミットから見る実装の変遷</h2><p>以下は既定ブランチの直近の変更です。リンク先で一次情報を確認できます。</p><ol className="commit-history">{article.commits.map((commit) => <li key={commit.sha}><time>{formatDate(commit.date)}</time><div><strong>{commit.message}</strong><a href={commit.url}>{commit.sha}をGitHubで確認 ↗</a></div></li>)}</ol></section>
          <section id="learning"><p className="section-kicker">05 / LEARNINGS</p><h2>このプロジェクトから得られる学び</h2><ul className="learning-list"><li><strong>変更を小さく記録する</strong><p>コミット単位で目的を分けると、実装の意図を追跡しやすくなります。</p></li><li><strong>構成と技術選定を結び付ける</strong><p>{article.primaryLanguage}の採用理由と各ディレクトリの責務を説明できることが保守性につながります。</p></li><li><strong>READMEと実装を同時に育てる</strong><p>説明とコードを近い状態に保つことが、再利用と振り返りを助けます。</p></li></ul></section>
          <section id="faq"><p className="section-kicker">06 / FAQ</p><h2>よくある質問</h2><div className="faq-list">{faq.map(({ q, a }) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
          <aside className="source-note"><strong>情報の透明性</strong><p>{formatDate(article.updatedAt)}時点の公開GitHub情報を基にしています。</p><a href={article.url}>GitHubリポジトリを見る ↗</a></aside>
        </div>
      </div>
    </article>
  </main>
}
