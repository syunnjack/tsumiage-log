import { articles } from "../lib/repository-articles"

export function GET() {
  const body = [
    "# 積み上げログ",
    "",
    "> 学び、作り、振り返る開発記録。syunnjackの公開GitHubリポジトリを一次情報として、設計・技術選定・コミット履歴を解説します。",
    "",
    "## Primary pages",
    "- [Home](https://syunnjack.dev/): サイト概要、学習年表、プロジェクト",
    "- [Articles](https://syunnjack.dev/articles): 技術記事一覧",
    "- [Videos](https://syunnjack.dev/videos): 記事解説と独立企画を含む、2026年8月から公開予定の技術動画",
    "",
    "## Repository articles",
    ...articles.map(
      (article) =>
        `- [${article.displayName}](https://syunnjack.dev/articles/${article.slug}): ${article.description}`,
    ),
    "",
    "## Source policy",
    "- 記事は公開README、リポジトリ構成、既定ブランチのコミットを根拠にしています。",
    "- 最新の事実は各記事からリンクしたGitHubリポジトリを確認してください。",
    "- 非公開リポジトリの情報は掲載していません。",
  ].join("\n")

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  })
}
