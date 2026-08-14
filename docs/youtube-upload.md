# リポジトリ動画の自動投稿

`video-production.json` にある147本のリポジトリ動画を、YouTubeへ少しずつ投稿する仕組みです。

## なぜ「少しずつ」なのか

YouTube Data API には1日あたりのクォータがあり、既定は10,000単位です。
1本投稿するのにかかる消費は次のとおりです。

| 操作 | 消費 |
|---|---:|
| `videos.insert`（動画本体） | 1,600 |
| `captions.insert`（字幕） | 400 |
| `playlistItems.insert`（再生リストへ追加） | 50 |
| **合計** | **2,050** |

10,000 ÷ 2,050 = **1日4本**が上限です。147本を出しきるにはおよそ37日かかります。
枠を増やしたい場合は Google Cloud Console からクォータの拡張を申請してください。

## 準備：3つのSecretを登録する

リポジトリの Settings → Secrets and variables → Actions に登録します。

| 名前 | 中身 |
|---|---|
| `YOUTUBE_CLIENT_ID` | OAuthクライアントID |
| `YOUTUBE_CLIENT_SECRET` | OAuthクライアントシークレット |
| `YOUTUBE_REFRESH_TOKEN` | リフレッシュトークン |

### 1. OAuthクライアントを作る

1. [Google Cloud Console](https://console.cloud.google.com/) でプロジェクトを選ぶ
2. 「APIとサービス」→「ライブラリ」で **YouTube Data API v3** を有効化する
3. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
4. 種類は **デスクトップアプリ** を選ぶ
5. 表示される クライアントID と クライアントシークレット を控える

### 2. リフレッシュトークンを取る

手元で一度だけ認証します。ダウンロードしたJSONを `client_secret.json` として
リポジトリ直下に置き、次を実行してください。

```bash
node scripts/upload-to-youtube.mjs --dry-run
```

ブラウザが開くので、投稿したいチャンネルのGoogleアカウントで許可します。
完了すると `.youtube-token.json` が作られるので、その中の `refresh_token`
の値を `YOUTUBE_REFRESH_TOKEN` に登録します。

> `client_secret.json` と `.youtube-token.json` はどちらも `.gitignore` 済みです。
> コミットしないでください。

## 自動投稿

`.github/workflows/upload-repository-videos.yml` が **毎日03:00（日本時間）** に
4本ずつ投稿します。投稿できたものは `video-production.json` の `youtubeUrl` に
書き戻してコミットするので、翌日の実行は自動的に続きから始まります。

手動で走らせる場合は Actions タブから「Upload repository videos」を選び、
本数と公開設定を指定して実行してください。

## 手元から実行する

```bash
# 認証なしで内容だけ確認する
node scripts/upload-repository-videos.mjs --dry-run --max 2

# 4本投稿する
node scripts/upload-repository-videos.mjs

# 本数と公開設定を変える
node scripts/upload-repository-videos.mjs --max 2 --privacy unlisted

# 1本だけ
node scripts/upload-repository-videos.mjs --slug goal-pilot-app

# 字幕や再生リストを省いてクォータを節約する（1本1,600単位になり1日6本）
node scripts/upload-repository-videos.mjs --no-captions --no-playlists
```

## 投稿時に設定されるもの

| 項目 | 内容 |
|---|---|
| タイトル | `<主要言語>で作った<プロジェクト名>｜構成とコミット履歴を75秒で解説` |
| 説明文 | 冒頭2文で内容を要約し、分かること・リンク・コメント誘導を続ける |
| タグ | 言語と用途から11個前後 |
| 字幕 | `<slug>-tech-preview.srt`（`scripts/build-video-captions.mjs` が生成） |
| 再生リスト | 主要言語ごと。存在しなければ自動で作成する |
| カテゴリ | 科学と技術（28） |
| 言語 | 日本語（音声・既定とも） |

タイトルと説明文の作り方は `scripts/video-metadata.mjs` にまとめてあります。

## うまくいかないとき

**`quotaExceeded` が出る**
その日の枠を使い切っています。日付が変わる（太平洋時間の0時）まで待ってください。
スクリプトは超過を検知した時点で打ち切り、残り日数を表示します。

**`youtubeSignupRequired` が出る**
そのGoogleアカウントにYouTubeチャンネルがありません。チャンネルを作ってください。

**投稿はされるが非公開のままになる**
電話番号の確認が済んでいないアカウントでは、15分を超える動画や一定数以上の
投稿が制限されることがあります。YouTube Studio で確認してください。

**動画ファイルが見つからないと言われる**
`video-assets/repositories/<slug>/<slug>-tech-preview.mp4` が必要です。
`npm run video:render` で書き出してください。
