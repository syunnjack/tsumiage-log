const REPOSITORY_VIDEO_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@5964dadaaff5ccdb0a4be65242f661af3aa07f7c/video-assets"

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  return path.startsWith("/videos/repositories/")
    ? `${REPOSITORY_VIDEO_ASSET_BASE}${path.slice("/videos".length)}`
    : path
}
