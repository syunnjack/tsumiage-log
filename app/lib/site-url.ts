export const SITE_ORIGIN = "https://syunnjack.dev"

export function canonicalPath(path = "/") {
  if (path === "/") return "/"

  const normalized = path.startsWith("/") ? path : `/${path}`
  return normalized.endsWith("/") ? normalized : `${normalized}/`
}

export function absoluteSiteUrl(path = "/") {
  return `${SITE_ORIGIN}${canonicalPath(path)}`
}
