const repositoryVideoAssetRevision =
  process.env.NEXT_PUBLIC_VIDEO_ASSET_REVISION?.trim() || "main"
const REPOSITORY_VIDEO_ASSET_BASE =
  `https://cdn.jsdelivr.net/gh/syunnjack/tsumiage-log@${repositoryVideoAssetRevision}/video-assets`

export function resolveVideoAssetUrl(path?: string | null) {
  if (!path) return undefined

  return path.startsWith("/videos/repositories/")
    ? `${REPOSITORY_VIDEO_ASSET_BASE}${path.slice("/videos".length)}`
    : path
}
