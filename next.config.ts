import type { NextConfig } from "next";

// ── R2 remote pattern helper ──────────────────────────────────────────────────
function r2RemotePattern() {
  const url = process.env.R2_PUBLIC_URL;
  if (!url) return [];
  try {
    return [{ protocol: "https" as const, hostname: new URL(url).hostname, pathname: "/**" }];
  } catch {
    return [];
  }
}

// ── Next.js config ────────────────────────────────────────────────────────────
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: false },

  images: {
    remotePatterns: [
      // Placeholder images used by seed data
      { protocol: "https", hostname: "picsum.photos", port: "", pathname: "/**" },
      // Cloudflare R2 public bucket (set R2_PUBLIC_URL in production)
      ...r2RemotePattern(),
    ],
    // Local uploads served from /public/uploads/ (dev only)
    localPatterns: [{ pathname: "/uploads/**" }],
  },

  // Removed `output: "standalone"` — Cloudflare Pages deployment uses
  // `npm run build:cf` (npx @cloudflare/next-on-pages) instead.
  // Re-add for Docker/Node.js deployments: output: "standalone",

  transpilePackages: ["motion"],

  webpack: (config, { nextRuntime, dev }) => {
    // Stub out Node.js built-ins when bundling for the Edge Runtime.
    // The local file-system provider only runs in dev (DATABASE_PROVIDER=local);
    // in production (D1/R2) these imports are never called.
    if (nextRuntime === "edge") {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        "fs/promises": false,
        path: false,
      };
    }
    if (dev && process.env.DISABLE_HMR === "true") {
      config.watchOptions = { ignored: /.*/ };
    }
    return config;
  },
};

export default nextConfig;
