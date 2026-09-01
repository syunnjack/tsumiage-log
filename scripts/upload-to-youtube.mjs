/**
 * YouTube投稿スクリプト
 *
 * 事前準備:
 *   1. Google Cloud Console で YouTube Data API v3 を有効化
 *   2. OAuth 2.0 クライアントID (デスクトップアプリ) を作成し
 *      client_secret.json としてリポジトリルートに配置
 *   3. 初回実行時にブラウザで認証 → トークンが .youtube-token.json に保存される
 *
 * 実行方法:
 *   node scripts/upload-to-youtube.mjs           # 未投稿の動画をすべて投稿
 *   node scripts/upload-to-youtube.mjs --dry-run # 実際には投稿せず内容を確認
 *   node scripts/upload-to-youtube.mjs --slug allbowl01-showcase # 1件だけ投稿
 */

import { createReadStream } from 'node:fs'
import { readFile, writeFile, access } from 'node:fs/promises'
import { createServer } from 'node:http'
import { createInterface } from 'node:readline'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from 'googleapis'

const root = fileURLToPath(new URL('..', import.meta.url))
const CLIENT_SECRET_PATH = path.join(root, 'client_secret.json')
const TOKEN_PATH = path.join(root, '.youtube-token.json')

// 環境変数から直接認証情報を読む場合に使う
const ENV_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID
const ENV_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET

// 既知のクライアントID（Google Auth Platformで確認済み）
const KNOWN_CLIENT_ID = '311818625650-mbm2n84l27fn2d5sbsev7lofl8nvj0hh.apps.googleusercontent.com'

function askSecret() {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stderr })
    process.stderr.write('クライアントシークレットを入力してください（Google Auth Platform > Clients > Additional information に表示）: ')
    rl.question('', (answer) => { rl.close(); resolve(answer.trim()) })
  })
}
const STORE_VIDEOS_PATH = path.join(root, 'app/data/store-videos.json')
const STORE_DIR = path.join(root, 'video-assets/store')
const STATE_PATH = path.join(root, 'video-assets/store/youtube-upload-state.json')

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

// --- CLI args ---
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const slugIndex = args.indexOf('--slug')
const targetSlug = slugIndex !== -1 ? args[slugIndex + 1] : null

// --- OAuth ---
async function loadCredentials() {
  // 1. 環境変数
  if (ENV_CLIENT_ID && ENV_CLIENT_SECRET) {
    return { installed: { client_id: ENV_CLIENT_ID, client_secret: ENV_CLIENT_SECRET, redirect_uris: ['http://localhost:8080'] } }
  }
  // 2. client_secret.json
  try {
    await access(CLIENT_SECRET_PATH)
    return JSON.parse(await readFile(CLIENT_SECRET_PATH, 'utf8'))
  } catch { /* fall through */ }
  // 3. ターミナルで対話入力
  const secret = await askSecret()
  if (!secret) { console.error('シークレットが入力されませんでした。'); process.exit(1) }
  const creds = { installed: { client_id: KNOWN_CLIENT_ID, client_secret: secret, redirect_uris: ['http://localhost:8080'] } }
  await writeFile(CLIENT_SECRET_PATH, JSON.stringify(creds, null, 2))
  console.log(`✅ client_secret.json を保存しました。次回以降は自動で読み込まれます。`)
  return creds
}

function buildOAuthClient(credentials) {
  const { client_id, client_secret } = credentials.installed ?? credentials.web
  // ローカルサーバーのコールバックURLに固定する
  return new google.auth.OAuth2(client_id, client_secret, 'http://localhost:8080')
}

async function authorize(oAuth2Client) {
  try {
    const token = JSON.parse(await readFile(TOKEN_PATH, 'utf8'))
    oAuth2Client.setCredentials(token)
    // トークンが期限切れなら自動リフレッシュされる
    return oAuth2Client
  } catch {
    return getNewToken(oAuth2Client)
  }
}

function getNewToken(oAuth2Client) {
  return new Promise((resolve, reject) => {
    // ローカルサーバーでコールバックを受け取る
    const server = createServer(async (req, res) => {
      const url = new URL(req.url, 'http://localhost:8080')
      const code = url.searchParams.get('code')
      if (!code) { res.end('code パラメータがありません'); return }
      res.end('<html><body><h1>認証完了</h1><p>このウィンドウを閉じてください。</p></body></html>')
      server.close()
      try {
        const { tokens } = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(tokens)
        await writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2))
        console.log(`✅ トークンを保存しました: ${TOKEN_PATH}`)
        resolve(oAuth2Client)
      } catch (err) {
        reject(err)
      }
    })
    server.listen(8080, () => {
      const authUrl = oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES })
      console.log('\n以下のURLをブラウザで開いて認証してください:\n')
      console.log(authUrl)
      console.log()
    })
  })
}

// --- Upload ---
async function buildDescription(video) {
  const lines = [
    video.description,
    '',
    '---',
  ]
  if (video.articleUrl) lines.push(`📖 記事: ${video.articleUrl}`)
  if (video.repositoryUrl) lines.push(`💻 リポジトリ: ${video.repositoryUrl}`)
  if (video.ctaUrl) lines.push(`🛒 ${video.ctaLabel ?? '詳細はこちら'}: ${video.ctaUrl}`)
  lines.push('')
  lines.push('#積み上げ #個人開発 #プログラミング')
  return lines.join('\n')
}

async function uploadVideo(youtube, video, storeDir, isDryRun) {
  const videoPath = path.join(storeDir, video.slug, `${video.slug}-preview.mp4`)
  const thumbPath = path.join(storeDir, video.slug, `${video.slug}-preview.png`)

  const description = await buildDescription(video)

  console.log(`\n📹 投稿: ${video.title}`)
  console.log(`   ファイル: ${videoPath}`)
  if (isDryRun) {
    console.log('   [DRY RUN] 実際には投稿しません')
    console.log(`   説明文:\n${description.split('\n').map(l => `     ${l}`).join('\n')}`)
    return { id: 'dry-run', title: video.title }
  }

  const res = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title: video.title,
        description,
        tags: ['積み上げ', '個人開発', 'プログラミング'],
        defaultLanguage: 'ja',
        defaultAudioLanguage: 'ja',
      },
      status: {
        privacyStatus: 'public',
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: createReadStream(videoPath),
    },
  })

  const videoId = res.data.id
  console.log(`   ✅ 投稿完了: https://youtu.be/${videoId}`)

  // サムネイル設定
  try {
    await youtube.thumbnails.set({
      videoId,
      media: { body: createReadStream(thumbPath) },
    })
    console.log('   🖼️  サムネイル設定完了')
  } catch (err) {
    console.warn(`   ⚠️  サムネイル設定に失敗しました: ${err.message}`)
  }

  return { id: videoId, title: video.title }
}

// --- State ---
async function loadState() {
  try {
    return JSON.parse(await readFile(STATE_PATH, 'utf8'))
  } catch {
    return { uploaded: {} }
  }
}

async function saveState(state) {
  await writeFile(STATE_PATH, JSON.stringify(state, null, 2) + '\n')
}

// --- Main ---
async function main() {
  const credentials = await loadCredentials()
  const oAuth2Client = buildOAuthClient(credentials)
  const auth = await authorize(oAuth2Client)
  const youtube = google.youtube({ version: 'v3', auth })

  const { videos } = JSON.parse(await readFile(STORE_VIDEOS_PATH, 'utf8'))
  const state = await loadState()

  const targets = videos.filter((v) => {
    if (targetSlug) return v.slug === targetSlug
    return !state.uploaded[v.slug]
  })

  if (targets.length === 0) {
    console.log('✅ 投稿対象の動画はありません（すべて投稿済み）。')
    return
  }

  console.log(`投稿対象: ${targets.length} 件`)
  if (isDryRun) console.log('（DRY RUN モード）')

  for (const video of targets) {
    try {
      const result = await uploadVideo(youtube, video, STORE_DIR, isDryRun)
      if (!isDryRun) {
        state.uploaded[video.slug] = {
          youtubeId: result.id,
          uploadedAt: new Date().toISOString(),
          title: result.title,
        }
        await saveState(state)
      }
    } catch (err) {
      console.error(`\n❌ ${video.slug} の投稿に失敗: ${err.message}`)
      if (err.response?.data) console.error(JSON.stringify(err.response.data, null, 2))
    }
  }

  if (!isDryRun) {
    console.log('\n📊 投稿済み一覧:')
    for (const [slug, info] of Object.entries(state.uploaded)) {
      console.log(`  ${slug}: https://youtu.be/${info.youtubeId}`)
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
