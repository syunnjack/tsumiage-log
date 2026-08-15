# 積み上げログ

「学び、作り、振り返る開発記録」をテーマにした、syunnjackの技術ブログです。

## ローカル開発

```bash
npm install
npm run dev
```

## 記事自動化

GitHub Actionsが毎時15分に公開リポジトリの変更を確認します。

1. `syunnjack` の公開リポジトリと最新コミットを収集
2. アダルト・機密情報の除外ポリシーを適用
3. 記事データの品質監査
4. Lintと公開用ビルド
5. 変更があれば自動コミット・プッシュ
6. 公開待ちまたは失敗をGitHub Issueで通知

公開済み動画は毎日午前3時27分（日本時間）に再生URLを自動確認し、異常があればGitHub Issueで通知します。

手動で同じ確認を行う場合：

```bash
npm run content:update
```

収集のみ：

```bash
npm run content:collect
```

公開ポリシーと記事品質の監査のみ：

```bash
npm run content:audit
```

動画URLの確認：

```bash
npm run video:health
```

除外対象は `app/data/content-policy.json` で管理します。変更がある場合はGitHub Pagesのデプロイが自動的に開始されます。

## 確認

```bash
npm run lint
npm run build
```

## URL

- 公開予定ドメイン: https://syunnjack.dev
- 現在の公開サイト: https://tsumiage-log.syunnjack.chatgpt.site
- GitHub: https://github.com/syunnjack/tsumiage-log
