const REPOSITORY_VIDEO_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@569ac45db76164867f5ab736b9389c5d41c7c44c/video-assets"

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  return path.startsWith("/videos/repositories/")
    ? `${REPOSITORY_VIDEO_ASSET_BASE}${path.slice("/videos".length)}`
    : path
}
