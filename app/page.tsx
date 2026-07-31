import Link from "next/link"

const articles = [
  {
    number: "01",
    category: "はじめに",
    title: "GoalPilotで学ぶ、続けられる目標管理の設計",
    excerpt:
      "挫折を前提にしたタスク設計、3分スタート、リカバリーモードの実装過程をコミットから振り返ります。",
    date: "2026.07.25",
    readTime: "8 min",
  },
  {
    number: "02",
    category: "React",
    title: "地図検索サービスを再利用可能な構成にする",
    excerpt:
      "Leafletを使った地図と検索結果の連動、カテゴリ設計、ローカル検索の共通化を考えます。",
    date: "公開コミット連動",
    readTime: "—",
  },
  {
    number: "03",
    category: "Web",
    title: "高速バス比較サービスのデータ同期設計",
    excerpt:
      "CSV取り込み、重複排除、運行会社API、定期同期へと拡張したコミットの流れを解説します。",
    date: "公開コミット連動",
    readTime: "—",
  },
]

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
            <small>TSUMIAGE LOG</small>
          </span>
        </a>
        <nav aria-label="メインナビゲーション">
          <Link href="/articles">記事</Link>
          <Link href="/videos">動画</Link>
          <a href="#timeline">学習年表</a>
          <a href="#project">プロジェクト</a>
          <a href="#about">プロフィール</a>
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
            LEARNING IN PUBLIC
          </p>
          <h1>
            学びを、
            <br />
            <em>積み上げる。</em>
          </h1>
          <p className="hero-lead">
            学び、作り、振り返る開発記録。
            <br />
            答えだけでなく、考えた過程も残していきます。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#articles">
              記事を読む <span aria-hidden="true">↓</span>
            </a>
            <a className="button secondary" href="#timeline">
              これまでの歩み
            </a>
          </div>
        </div>
        <div className="growth-visual" aria-label="学びの積み重ねを表すグラフ">
          <div className="visual-label">BUILD / REFLECT / REPEAT</div>
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
        <div className="scroll-note">SCROLL TO EXPLORE</div>
      </section>

      <section className="section articles-section" id="articles">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span />
              LATEST NOTES
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
          {articles.map((article) => (
            <article key={article.number} className="article-card">
              <div className="article-number">{article.number}</div>
              <div className="article-body">
                <div className="article-meta">
                  <span>{article.category}</span>
                  <time>{article.date}</time>
                  <span>{article.readTime}</span>
                </div>
                <h3>{article.title}</h3>
                <p>{article.excerpt}</p>
              </div>
              <span className="article-arrow" aria-hidden="true">
                ↗
              </span>
            </article>
          ))}
        </div>
        <p className="coming-note">
          GitHubの公開コミットを根拠にした技術解説を公開しています。{" "}
          <Link href="/articles">全記事を見る →</Link>
        </p>
      </section>

      <section className="section timeline-section" id="timeline">
        <div className="section-heading">
          <div>
            <p className="eyebrow light">
              <span />
              MY JOURNEY
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
              FEATURED PROJECT
            </p>
            <p className="project-number">PROJECT / 001</p>
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
              href="/articles/goal-pilot-app"
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
                <p>TODAY</p>
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
                <small>1 / 3 COMPLETED</small>
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
            ABOUT THIS LOG
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
