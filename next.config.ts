import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow external image domains for avatars
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  // Suppress the better-sqlite3 native module warning
  serverExternalPackages: ["better-sqlite3"],
};

export default nextConfig;
