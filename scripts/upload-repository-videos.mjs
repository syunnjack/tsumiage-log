/**
 * リポジトリ動画（147本）をYouTubeへ投稿する。
 *
 * 既存の upload-to-youtube.mjs は store-videos.json（showcase 11本）専用で、
 * リポジトリ動画には対応していなかったため別に用意した。
 *
 * ■ 1日に投稿できる本数について
 * YouTube Data API の既定クォータは1日10,000単位。1本あたりの消費は
 *
 *   videos.insert        1,600
 *   captions.insert        400  （字幕をつける場合）
 *   playlistItems.insert    50  （再生リストに入れる場合）
 *   ------------------------------
 *   合計                 2,050
 *
 * つまり既定枠では1日4本が上限になる。147本を投稿しきるには
 * 単純計算で37日かかる。--max で1回の本数を指定でき、既定は4本。
 * 投稿済みの記録は video-production.json の youtubeUrl に書き戻すので、
 * 翌日また実行すれば続きから再開する。
 *
 * ■ 事前準備
 *   1. Google Cloud Console で YouTube Data API v3 を有効化
 *   2. OAuth 2.0 クライアントID（デスクトップアプリ）を作り
 *      client_secret.json をリポジトリ直下に置く
 *   3. 初回実行時にブラウザで認証すると .youtube-token.json が作られる
 *
 * ■ 使い方
 *   node scripts/upload-repository-videos.mjs --dry-run   # 認証なしで確認できる
 *   node scripts/upload-repository-videos.mjs             # 既定の4本を投稿
 *   node scripts/upload-repository-videos.mjs --max 2
 *   node scripts/upload-repository-videos.mjs --slug foo  # 1本だけ
 *   node scripts/upload-repository-videos.mjs --privacy unlisted
 */
import { createReadStream, existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const QUEUE_PATH = path.join(root, "app/data/video-production.json");
const ASSET_ROOT = path.join(root, "video-assets/repositories");
const CLIENT_SECRET_PATH = path.join(root, "client_secret.json");
const TOKEN_PATH = path.join(root, ".youtube-token.json");

/** 1日あたりの既定クォータと1本あたりの消費 */
const DAILY_QUOTA = 10000;
const COST = { video: 1600, caption: 400, playlistItem: 50, playlistCreate: 50 };

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i === -1 ? fallback : args[i + 1];
};

const isDryRun = flag("--dry-run");
const targetSlug = value("--slug");
const privacy = value("--privacy", "public");
const maxUploads = Number(value("--max", "4"));
const withCaptions = !flag("--no-captions");
const withPlaylists = !flag("--no-playlists");

const perVideoCost =
  COST.video + (withCaptions ? COST.caption : 0) + (withPlaylists ? COST.playlistItem : 0);

function assetPaths(slug) {
  const dir = path.join(ASSET_ROOT, slug);
  return {
    mp4: path.join(dir, `${slug}-tech-preview.mp4`),
    srt: path.join(dir, `${slug}-tech-preview.srt`),
  };
}

/**
 * 認証を用意する。
 *
 * GitHub Actions ではファイルを置けないため、環境変数を先に見る。
 * 手元では従来どおり client_secret.json と .youtube-token.json を使う。
 */
async function loadAuth() {
  const { google } = await import("googleapis");

  const envId = process.env.YOUTUBE_CLIENT_ID;
  const envSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const envRefresh = process.env.YOUTUBE_REFRESH_TOKEN;

  if (envId && envSecret && envRefresh) {
    const client = new google.auth.OAuth2(envId, envSecret, "http://localhost:8080");
    client.setCredentials({ refresh_token: envRefresh });
    return google.youtube({ version: "v3", auth: client });
  }

  if (!existsSync(CLIENT_SECRET_PATH)) {
    throw new Error(
      `認証情報がありません。環境変数 YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN を設定するか、Google Cloud Console で OAuth クライアント（デスクトップアプリ）を作り ${CLIENT_SECRET_PATH} に置いてください。`,
    );
  }
  const credentials = JSON.parse(await readFile(CLIENT_SECRET_PATH, "utf8"));
  const { client_id, client_secret, redirect_uris } = credentials.installed ?? credentials.web;
  const client = new google.auth.OAuth2(client_id, client_secret, redirect_uris?.[0]);

  if (!existsSync(TOKEN_PATH)) {
    throw new Error(
      `.youtube-token.json がありません。先に scripts/upload-to-youtube.mjs を一度実行して認証を済ませてください（同じトークンを使います）。`,
    );
  }
  client.setCredentials(JSON.parse(await readFile(TOKEN_PATH, "utf8")));
  return google.youtube({ version: "v3", auth: client });
}

/** 再生リストを名前で引き、無ければ作る */
async function resolvePlaylist(youtube, cache, name) {
  if (cache.has(name)) return cache.get(name);

  const list = await youtube.playlists.list({ part: ["snippet"], mine: true, maxResults: 50 });
  for (const item of list.data.items ?? []) {
    cache.set(item.snippet.title, item.id);
  }
  if (cache.has(name)) return cache.get(name);

  const created = await youtube.playlists.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: { title: name, description: `${name}の動画をまとめた再生リストです。` },
      status: { privacyStatus: "public" },
    },
  });
  cache.set(name, created.data.id);
  return created.data.id;
}

async function uploadOne(youtube, video, playlistCache) {
  const { mp4, srt } = assetPaths(video.slug);
  if (!existsSync(mp4)) return { skipped: `動画ファイルがありません: ${mp4}` };

  if (isDryRun) {
    return {
      dryRun: true,
      title: video.title,
      tags: video.tags,
      playlist: video.playlist,
      captions: withCaptions && existsSync(srt),
    };
  }

  const res = await youtube.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title: video.title,
        description: video.youtubeDescription,
        tags: video.tags ?? [],
        categoryId: "28", // 科学と技術
        defaultLanguage: "ja",
        defaultAudioLanguage: "ja",
      },
      status: { privacyStatus: privacy, selfDeclaredMadeForKids: false },
    },
    media: { body: createReadStream(mp4) },
  });

  const videoId = res.data.id;

  if (withCaptions && existsSync(srt)) {
    try {
      await youtube.captions.insert({
        part: ["snippet"],
        requestBody: { snippet: { videoId, language: "ja", name: "日本語", isDraft: false } },
        media: { body: createReadStream(srt) },
      });
    } catch (error) {
      console.error(`   字幕の登録に失敗: ${error.message}`);
    }
  }

  if (withPlaylists && video.playlist) {
    try {
      const playlistId = await resolvePlaylist(youtube, playlistCache, video.playlist);
      await youtube.playlistItems.insert({
        part: ["snippet"],
        requestBody: {
          snippet: { playlistId, resourceId: { kind: "youtube#video", videoId } },
        },
      });
    } catch (error) {
      console.error(`   再生リストへの追加に失敗: ${error.message}`);
    }
  }

  return { videoId, url: `https://youtu.be/${videoId}` };
}

async function main() {
  const queue = JSON.parse(await readFile(QUEUE_PATH, "utf8"));

  let pending = queue.videos.filter((v) => !v.youtubeUrl);
  if (targetSlug) pending = queue.videos.filter((v) => v.slug === targetSlug);

  const budget = Math.floor(DAILY_QUOTA / perVideoCost);
  const limit = Math.min(maxUploads, budget, pending.length);

  console.log(`未投稿: ${pending.length} 本`);
  console.log(
    `1本あたりの消費: ${perVideoCost} 単位 → 既定クォータ(${DAILY_QUOTA})では1日 ${budget} 本まで`,
  );
  console.log(`今回の対象: ${limit} 本${isDryRun ? "（下見のみ）" : ""}\n`);

  if (limit === 0) {
    console.log("投稿するものがありません。");
    return;
  }

  const youtube = isDryRun ? null : await loadAuth();
  const playlistCache = new Map();
  let uploaded = 0;

  for (const video of pending.slice(0, limit)) {
    console.log(`▶ ${video.slug}`);
    console.log(`  ${video.title}`);
    try {
      const result = await uploadOne(youtube, video, playlistCache);
      if (result.skipped) {
        console.log(`  とばす: ${result.skipped}\n`);
        continue;
      }
      if (result.dryRun) {
        console.log(`  タグ: ${(result.tags ?? []).join(", ")}`);
        console.log(`  再生リスト: ${result.playlist}`);
        console.log(`  字幕: ${result.captions ? "あり" : "なし"}\n`);
        continue;
      }
      video.youtubeUrl = result.url;
      video.status = "published";
      uploaded++;
      console.log(`  投稿しました: ${result.url}\n`);
      // 1本ごとに書き戻す。途中で止まっても続きから再開できる
      await writeFile(QUEUE_PATH, `${JSON.stringify(queue, null, 2)}\n`, "utf8");
    } catch (error) {
      const reason = error.errors?.[0]?.reason ?? "";
      console.error(`  失敗: ${error.message}`);
      if (reason === "quotaExceeded" || /quota/i.test(error.message)) {
        console.error("\nクォータを使い切りました。日付が変わってから再実行してください。");
        break;
      }
    }
  }

  if (!isDryRun) {
    const remaining = queue.videos.filter((v) => !v.youtubeUrl).length;
    console.log(`今回 ${uploaded} 本を投稿しました。残り ${remaining} 本。`);
    if (remaining > 0) {
      console.log(`このペースだと、あと ${Math.ceil(remaining / budget)} 日かかります。`);
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
