import type { RepositoryArticle } from "./repository-articles"

const searchOpportunityOverrides: Record<string, { title: string; description: string }> = {
  "price-review-compare": {
    title: "Price Review Compareとは？価格・レビュー比較ツールの設計と実装",
    description: "Price Review Compareの仕組みを、JavaScriptの構成、価格・レビュー比較の考え方、公開コミットに基づく改善履歴から解説します。",
  },
  "restaurant-seat-alert": {
    title: "SeatAlertとは？飲食店の空席通知システムの設計と実装",
    description: "SeatAlert（Restaurant Seat Alert）の空席・限定メニュー・クーポン通知を、JavaScriptの構成と公開コミットから解説します。",
  },
  "ai-tool-diagnoser": {
    title: "AI Tool Diagnoserとは？AIツール診断アプリの設計と実装",
    description: "AI Tool Diagnoserの診断フロー、TypeScriptの構成、実装判断と改善履歴を公開リポジトリに基づいて解説します。",
  },
  "local-board-alert": {
    title: "BoardAlertとは？地域掲示板の新着通知システムの設計と実装",
    description: "BoardAlert（Local Board Alert）が地域掲示板の新着投稿を通知する仕組みを、JavaScriptの構成と公開コミットから解説します。",
  },
  "furusato-hikaku": {
    title: "ふるさと納税比較システムの設計｜返礼品を条件別に探す仕組み",
    description: "楽天市場のふるさと納税返礼品をカテゴリ、都道府県、寄付額、レビューで比較するLaravelアプリの設計と実装を解説します。",
  },
  "hotel-price-watch": {
    title: "Hotel Price Watchとは？宿泊料金の値下がり・空室通知の仕組み",
    description: "Hotel Price Watchがホテルの空室と価格下落を検知する考え方を、JavaScriptの構成と公開コミットから解説します。",
  },
}

export function getArticleSeo(article: RepositoryArticle) {
  return searchOpportunityOverrides[article.slug] ?? {
    title: `${article.displayName}の設計・技術選定・コミット履歴を解説`,
    description: `${article.name}で使われた${article.languages.join("、") || article.primaryLanguage}の構成、実装の変遷、学びをGitHubコミットに基づいて解説します。`,
  }
}
