import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Forum photo uploads are capped at 4 MB (Vercel rejects requests over
      // 4.5 MB); the default limit is 1 MB. Extra room for form overhead.
      bodySizeLimit: "4.4mb",
    },
  },
};

export default nextConfig;
