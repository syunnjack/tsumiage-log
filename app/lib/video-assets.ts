const REPOSITORY_VIDEO_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@a7effb7ea44f191990a756f7b05287ded29bae71/video-assets"

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  return path.startsWith("/videos/repositories/")
    ? `${REPOSITORY_VIDEO_ASSET_BASE}${path.slice("/videos".length)}`
    : path
}
