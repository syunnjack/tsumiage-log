import Link from "next/link"
import { articles as repositoryArticles, formatDate } from "./lib/repository-articles"
import { manualArticles } from "./lib/manual-articles"

const latestArticles = [
  ...manualArticles.map((article) => ({
    href: `/articles/manual/${article.slug}/`,
    category: article.category,
    title: article.title,
    excerpt: article.description,
    updatedAt: article.updatedAt,
  })),
  ...repositoryArticles.map((article) => ({
    href: `/articles/${article.slug}/`,
    category: article.primaryLanguage,
    title: `${article.displayName}の設計と実装`,
    excerpt: article.description,
    updatedAt: article.updatedAt,
  })),
]
  .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  .slice(0, 3)

const timeline = [
  {
    year: "学生時代",
    title: "つくることへの興味",
    text: "身近な不便を自分の手で変えられることに惹かれ、技術との距離が少しずつ縮まりました。",
  },
  {
    year: "学習開始",
    title: "コードを書く習慣",
    text: "JavaScriptとReactを中心に、読むだけで終わらせず、小さく動かして確かめる学習へ。",
  },
  {
    year: "個人開発",
    title: "Task Dashboard",
    text: "日々の課題を題材に、設計・実装・公開までを一つの流れとして経験しています。",
  },
  {
    year: "いま",
    title: "学びを言葉にする",
    text: "実装の結果だけでなく、迷った点や選択理由も残すために、このブログを始めました。",
  },
]

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="積み上げログ ホーム">
          <span className="brand-mark" aria-hidden="true">
            つ
          </span>
          <span>
            <strong>積み上げログ</strong>
            <small>技術ブログ</small>
          </span>
        </a>
        <nav aria-label="メインナビゲーション">
          <Link href="/articles/">記事</Link>
          <Link href="/portfolio/">制作物</Link>
          <a href="#timeline">学習年表</a>
          <a href="#project">プロジェクト</a>
          <a href="#about">このブログについて</a>
        </nav>
        <a className="github-link" href="https://github.com/syunnjack">
          GitHub <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow">
            <span />
            学びを公開する
          </p>
          <h1>
            学びを、
            <br />
            <em>積み上げる。</em>
          </h1>
          <p className="hero-lead">
            パソコンが苦手な方には、専門用語をかみくだいて。
            <br />
            ITエンジニアには、設計と実装の過程まで深く伝えます。
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/beginner/">
              はじめての方へ <span aria-hidden="true">→</span>
            </Link>
            <Link className="button secondary" href="/articles/">
              技術記事を読む
            </Link>
          </div>
        </div>
        <div className="growth-visual" aria-label="学びの積み重ねを表すグラフ">
          <div className="visual-label">作る・振り返る・続ける</div>
          <div className="growth-line">
            {[18, 31, 45, 61, 78, 91].map((height, index) => (
              <span
                key={height}
                className="growth-point"
                style={{
                  "--point-y": `${100 - height}%`,
                  "--point-x": `${8 + index * 17}%`,
                } as React.CSSProperties}
              >
                {index + 1}
              </span>
            ))}
          </div>
          <p>
            小さな理解を、
            <br />
            次の一歩へ。
          </p>
        </div>
        <div className="scroll-note">下へスクロール</div>
      </section>

      <section className="section articles-section" id="articles">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              最新記事
            </p>
            <h2>新しい記録</h2>
          </div>
          <p>
            実装したこと、つまずいたこと、
            <br />
            そこから分かったこと。
          </p>
        </div>
        <div className="article-list">
          {latestArticles.map((article, index) => (
            <Link href={article.href} key={article.href} className="article-card">
              <div className="article-number">{String(index + 1).padStart(2, "0")}</div>
              <div className="article-body">
                <div className="article-meta">
                  <span>{article.category}</span>
                  <time>{formatDate(article.updatedAt)}</time>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
              <span className="article-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </div>
        <p className="coming-note">
          GitHubの公開コミットを根拠にした技術解説を公開しています。{" "}
          <Link href="/articles/">全記事を見る →</Link>
        </p>
      </section>

      <section className="section timeline-section" id="timeline">
        <div className="section-heading">
          <div>
            <p className="eyebrow light">
              <span />
              これまでの歩み
            </p>
            <h2>これまでの歩み</h2>
          </div>
          <p>経験を点で終わらせず、次の学びにつなげるための年表です。</p>
        </div>
        <div className="timeline">
          {timeline.map((item, index) => (
            <article key={item.year} className="timeline-item">
              <div className="timeline-index">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <time>{item.year}</time>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section project-section" id="project">
        <div className="project-card">
          <div className="project-intro">
            <p className="eyebrow">
              <span />
              注目プロジェクト
            </p>
            <p className="project-number">プロジェクト / 001</p>
            <h2>GoalPilot</h2>
            <p className="project-description">
              三日坊主になることを前提に、目標へ戻る仕組みを設計したWebアプリ。
              逆算スケジュール、3分スタート、挫折リスクの可視化を実践しています。
            </p>
            <div className="tags">
              <span>React 19</span>
              <span>Vite</span>
              <span>Next.js</span>
              <span>Capacitor</span>
            </div>
            <Link
              className="button primary"
              href="/articles/goal-pilot-app/"
            >
              プロジェクトを見る <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="project-preview" aria-hidden="true">
            <div className="preview-window">
              <div className="preview-bar">
                <i />
                <i />
                <i />
                <span>goal-pilot</span>
              </div>
              <div className="preview-content">
                <p>今日</p>
                <strong>今日の3分スタート</strong>
                <div className="preview-task done">
                  <i /> 最初の小さな行動を決める
                </div>
                <div className="preview-task">
                  <i /> 3分タイマーを開始する
                </div>
                <div className="preview-task">
                  <i /> 今日の進捗を記録する
                </div>
                <div className="preview-progress">
                  <span />
                </div>
                <small>1 / 3 完了</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-symbol" aria-hidden="true">
          <span>学</span>
          <span>作</span>
          <span>振</span>
        </div>
        <div className="about-copy">
          <p className="eyebrow">
            <span />
            このブログについて
          </p>
          <h2>
            完成よりも、
            <br />
            前進を記録する。
          </h2>
          <p>
            はじめまして、syunnjackです。Web開発を学びながら、身近な課題を解決するプロダクトを作っています。
          </p>
          <p>
            このブログでは、きれいな成功談だけではなく、分からなかったこと、判断に迷ったこと、今なら変えたいことまで言葉にします。
          </p>
          <div className="about-profile-grid">
            <section>
              <p className="section-kicker">EXPERIENCE</p>
              <h3>経歴</h3>
              <ol className="career-list">
                <li><strong>学生時代</strong><p>身近な不便を自分の手で変えることに興味を持ち、技術との接点を作る。</p></li>
                <li><strong>Web開発学習</strong><p>JavaScript、Reactを中心に、読むだけでなく小さく動かして確かめる学習を継続。</p></li>
                <li><strong>個人開発</strong><p>タスク管理、地図検索、情報整理、コンテンツ自動化など、実用を意識したシステムを制作。</p></li>
                <li><strong>現在</strong><p>公開リポジトリとコミットを技術記事へつなぎ、設計判断と改善過程を継続的に発信。</p></li>
              </ol>
            </section>
            <section>
              <p className="section-kicker">SKILLS</p>
              <h3>得意分野</h3>
              <ul className="skill-list">
                <li>React / Next.js / ViteによるWeb UI開発</li>
                <li>GitHub Actionsを使った運用自動化</li>
                <li>公開データ・APIを活用した検索や可視化</li>
                <li>SEO・AI検索を意識した情報設計</li>
                <li>要件を小さく分け、実装と検証を積み重ねる進め方</li>
              </ul>
              <p className="profile-proof">公開実績はGitHubで、実装根拠は各技術記事で確認できます。</p>
            </section>
          </div>
          <a href="https://github.com/syunnjack">
            GitHubで活動を見る <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand">
          <span className="brand-mark" aria-hidden="true">
            つ
          </span>
          <span>
            <strong>積み上げログ</strong>
            <small>学び、作り、振り返る開発記録</small>
          </span>
        </div>
        <p>© 2026 syunnjack</p>
        <a href="#top">ページ上部へ ↑</a>
      </footer>
    </main>
  )
}
