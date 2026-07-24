# 積み上げログ

「学び、作り、振り返る開発記録」をテーマにした、syunnjackの技術ブログです。

## ローカル開発

```bash
npm install
npm run dev
```

## 記事自動化

GitHub Actionsが毎日午前3時15分（日本時間）に実行されます。

1. `syunnjack` の公開リポジトリと最新コミットを収集
2. アダルト・機密情報の除外ポリシーを適用
3. 記事データの品質監査
4. Lintと公開用ビルド
5. 変更があれば自動コミット・プッシュ
6. 公開待ちまたは失敗をGitHub Issueで通知

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

除外対象は `app/data/content-policy.json` で管理します。自動更新後のSites本番公開には、公開待ちIssueを確認して新しいバージョンを反映します。

## 確認

```bash
npm run lint
npm run build
```

## URL

- 公開予定ドメイン: https://syunnjack.dev
- 現在の公開サイト: https://tsumiage-log.syunnjack.chatgpt.site
- GitHub: https://github.com/syunnjack/tsumiage-log
