import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["yahoo-finance2"],
  experimental: {
    typedRoutes: true
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../tests/fetchCache.js": path.resolve(process.cwd(), "lib/yahoo-fetch-cache-stub.ts")
    };

    return config;
  }
};

export default nextConfig;
