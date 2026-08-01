const REPOSITORY_VIDEO_ASSET_BASE =
  "https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@e3b453c1c1231c6eee5235fb81d5a00d8af3b8b2/public"

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  return path.startsWith("/videos/repositories/")
    ? `${REPOSITORY_VIDEO_ASSET_BASE}${path}`
    : path
}
