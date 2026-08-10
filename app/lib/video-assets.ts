const videoAssetRevision =
  process.env.NEXT_PUBLIC_VIDEO_ASSET_REVISION?.trim() || "main"
const VIDEO_ASSET_BASE =
  `https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@${videoAssetRevision}/video-assets`

// video-assets/ 配下に置き、jsDelivr 経由で配信するディレクトリ。
// 大きな動画とポスター画像は public/ に入れず、ここからCDN配信する。
// 新しい配信ディレクトリを video-assets/ に追加したら、ここにも追加すること。
// （漏れると /videos/... のまま出力され、静的エクスポートに実体が無く404になる）
const CDN_HOSTED_DIRECTORIES = ["repositories", "store"]

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  const isCdnHosted = CDN_HOSTED_DIRECTORIES.some((directory) =>
    path.startsWith(`/videos/${directory}/`),
  )

  return isCdnHosted ? `${VIDEO_ASSET_BASE}${path.slice("/videos".length)}` : path
}
