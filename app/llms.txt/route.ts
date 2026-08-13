import { articles } from "../lib/repository-articles"
import { manualArticles } from "../lib/manual-articles"

export const dynamic = "force-static"

export function GET() {
  const body = [
    "# 積み上げログ",
    "",
    "> 学び、作り、振り返る開発記録。syunnjackの公開GitHubリポジトリを一次情報として、設計・技術選定・コミット履歴を解説します。",
    "",
    "## Primary pages",
    "- [Home](https://syunnjack.dev/): サイト概要、学習年表、プロジェクト",
    "- [Beginner guide](https://syunnjack.dev/beginner): パソコンやITが苦手な方向けの読み方、動画、問い合わせ案内",
    "- [Career and learning guide](https://syunnjack.dev/career-support): IT転職、副業、フリーランス、スクール、資格の比較と相談案内",
    "- [Articles](https://syunnjack.dev/articles): 技術記事一覧",
    "- [Videos](https://syunnjack.dev/videos): 設計、コード、コミット履歴をプロジェクト別に学べる技術解説動画",
    "- [Favorite videos](https://syunnjack.dev/videos/favorites): 技術、F1、お笑い、犬猫、音楽など実際に見て気に入った動画の選定理由付きコレクション",
    "- [ストア](https://syunnjack.dev/store): 限定動画コンテンツを単品PPV（BOOTH決済）で購入できる購入ページ。導入部分は無料視聴可能",
    "- [クラウドソーシング](https://syunnjack.dev/crowdsourcing): ココナラ、ランサーズ、クラウドワークスを含む仕事依頼・見積もり窓口",
    "",
    "## Repository articles",
    "- [Portfolio](https://syunnjack.dev/portfolio): 公開プロジェクトに基づく開発実績",
    "- [Profile](https://syunnjack.dev/profile): 経歴、スキル、実績",
    "- [Services](https://syunnjack.dev/services): Web制作、システム開発、自動化、技術相談",
    "- [Estimate](https://syunnjack.dev/estimate): 見積依頼フォーム",
    "- [Contact](https://syunnjack.dev/contact): お問い合わせフォーム",
    "",
    ...articles.map(
      (article) =>
        `- [${article.displayName}](https://syunnjack.dev/articles/${article.slug}): ${article.description}`,
    ),
    "",
    "## Original articles",
    ...manualArticles.map(
      (article) =>
        `- [${article.title}](https://syunnjack.dev/articles/manual/${article.slug}): ${article.description}`,
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
