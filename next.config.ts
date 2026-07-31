import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const pagesBasePath = "/tsumiage-log";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? pagesBasePath : "",
  assetPrefix: isGitHubPages ? pagesBasePath : "",
};

export default nextConfig;
