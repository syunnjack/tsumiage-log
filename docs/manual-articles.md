# 手書き記事の投稿方法

最初に `npm run manual:new -- article-slug "記事タイトル"` を実行すると、非公開の下書き雛形が自動で追加されます。

`app/data/manual-articles.json` の `articles` 配列へ記事を追加します。`published` が `false` の間は下書きで、一覧・詳細・サイトマップ・llms.txtには表示されません。内容を確認して `true` にすると公開対象になります。

```json
{
  "slug": "react-learning-note",
  "title": "Reactで学んだ状態管理の考え方",
  "description": "実装で迷った点と、状態を整理して解決した過程をまとめます。",
  "category": "React",
  "tags": ["React", "状態管理", "学習記録"],
  "publishedAt": "2026-07-26T00:00:00+09:00",
  "updatedAt": "2026-07-26T00:00:00+09:00",
  "published": false,
  "sections": [
    {
      "heading": "この記事で伝えたいこと",
      "body": ["最初に結論を書きます。", "次に背景や実体験を説明します。"]
    },
    {
      "heading": "実装例",
      "body": ["コードの前後に、目的と判断理由を書きます。"],
      "code": { "language": "tsx", "content": "const example = true" }
    }
  ]
}
```

投稿前に `npm run manual:audit`、`npm run lint`、`npm run build` を実行してください。slugは半角英小文字・数字・ハイフンだけを使い、説明文は検索結果だけで内容が伝わる文章にします。
