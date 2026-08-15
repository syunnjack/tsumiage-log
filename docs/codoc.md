# codoc（記事の支援・有料化）

自分のサイトのまま課金できるようにする仕組みです。読者を他のサービスへ
移動させずに、記事の下で支援を受け取ったり、続きを有料にしたりできます。

手数料は決済額の15%のみで、月額のシステム利用料はかかりません。

## 有効にする手順

### 1. codoc に登録してユーザーコードを取る

[codoc.jp](https://codoc.jp/) で登録すると、`data-usercode` に入れる
ユーザーコードが発行されます。

### 2. 環境変数を設定する

デプロイ環境（GitHub Actions の Secrets、またはローカルの `.env.local`）に
次を設定します。

```env
NEXT_PUBLIC_CODOC_USERCODE=取得したユーザーコード
```

**未設定のあいだは、codoc の読み込みタグも記事の枠も一切出力されません。**
設定するまでサイトの見た目は変わりません。

### 3. 記事ごとに枠を割り当てる

codoc の管理画面で「サポート」または「有料記事」を作ると、
`codoc-entry-XXXXXXXX` という形のIDが発行されます。

そのIDを `app/data/manual-articles.json` の対象記事に足します。

```json
{
  "slug": "ga4-not-tracking-static-analysis-pitfall",
  "title": "GA4が計測されない原因を283サイト分調べた｜…",
  "codocEntryId": "codoc-entry-XXXXXXXX",
  "published": true
}
```

`codocEntryId` を書いた記事にだけ枠が出ます。書かなければ何も出ません。

## 実装の場所

| ファイル | 役割 |
|---|---|
| `app/layout.tsx` | `cms.js` の読み込み。ページに1つだけ置く |
| `app/components/CodocEntry.tsx` | 記事下の枠。ユーザーコードとIDが揃ったときだけ描く |
| `app/articles/manual/[slug]/page.tsx` | 本文の後、コメント欄の前に設置 |
| `app/globals.css` | `.codoc-block` の見た目 |

`cms.js` は `next/script` ではなく生の `<script>` タグで出しています。
`next/script` の `afterInteractive` だと実行時に差し込まれ、静的HTMLに
`data-usercode` が残りません。codoc は自分のスクリプトタグから属性を
読むため、公式スニペットどおりHTMLへ直接置く必要があります。

## 何を売るか

いまは全記事を無料公開しているため、まずは**サポート（投げ銭）**から
始めるのが無理がありません。記事を読み終えた直後、コメント欄の手前に
出るようにしてあります。

有料化を試すなら、調査に手間がかかっていて再現性のある記事が向いています。
たとえば「GA4が計測されない原因を283サイト分調べた」のような、
実測にもとづく調査記事です。全文無料のまま支援だけ受け取る形でも、
途中から有料にする形でも、同じ枠で切り替えられます。
