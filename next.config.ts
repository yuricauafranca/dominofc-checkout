import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "assetsglobalbr.com" },
    ],
  },
};

export default nextConfig;
