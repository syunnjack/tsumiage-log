import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const hasCustomDomain = Boolean(process.env.CUSTOM_DOMAIN?.trim());
const pagesBasePath = "/tsumiage-log";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages && !hasCustomDomain ? pagesBasePath : "",
  assetPrefix: isGitHubPages && !hasCustomDomain ? pagesBasePath : "",
  experimental: {
    cpus: 2,
  },
};

export default nextConfig;
