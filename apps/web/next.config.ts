import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bioart.niaid.nih.gov",
        pathname: "/api/bioarts/**",
      },
    ],
  },
};

export default nextConfig;
