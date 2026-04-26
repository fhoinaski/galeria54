/**
 * Centralised, validated environment configuration.
 * Import `env` instead of reading process.env directly.
 *
 * Cloudflare D1 and R2 are accessed via CF Workers bindings (not env vars).
 * See worker-configuration.d.ts and lib/db.ts / lib/storage.ts.
 */

function get(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value) {
    if (fallback !== undefined) return fallback;
    if (process.env.NODE_ENV === "production") {
      throw new Error(`[env] Missing required environment variable: ${key}`);
    }
    return "";
  }
  return value;
}

function getBool(key: string, fallback: boolean): boolean {
  const v = process.env[key];
  if (v === undefined) return fallback;
  return v === "true" || v === "1";
}

function getNumber(key: string, fallback: number): number {
  const v = process.env[key];
  if (!v) return fallback;
  const n = Number(v);
  return isNaN(n) ? fallback : n;
}

export const env = {
  // App
  appUrl:  get("NEXT_PUBLIC_APP_URL",  "http://localhost:3000"),
  appName: get("NEXT_PUBLIC_APP_NAME", "Caffè 54 Menu"),

  // Admin
  adminAccessToken: get("ADMIN_ACCESS_TOKEN", "admin123"),

  // Database — actual data access is via CF D1 binding (see lib/db.ts)
  databaseProvider: get("DATABASE_PROVIDER", "local") as "local" | "d1",

  // Storage — actual uploads go through CF R2 binding (see lib/storage.ts)
  storageProvider: get("STORAGE_PROVIDER", "local") as "local" | "r2",
  r2PublicUrl:     get("R2_PUBLIC_URL", ""),   // e.g. https://pub-xxx.r2.dev
  r2BucketName:    get("R2_BUCKET_NAME", "caffe54-menu-images"),

  // i18n
  defaultLanguage:    get("NEXT_PUBLIC_DEFAULT_LANGUAGE",    "pt"),
  supportedLanguages: get("NEXT_PUBLIC_SUPPORTED_LANGUAGES", "pt,en,es")
    .split(",")
    .map(s => s.trim()),

  // Feature flags
  enableFeedback:        getBool("NEXT_PUBLIC_ENABLE_FEEDBACK",        true),
  enableRecommendations: getBool("NEXT_PUBLIC_ENABLE_RECOMMENDATIONS", true),
  enableAdmin:           getBool("NEXT_PUBLIC_ENABLE_ADMIN",           true),

  // Images
  imageMaxSizeMb:    getNumber("IMAGE_MAX_SIZE_MB", 3),
  imageAllowedTypes: get("IMAGE_ALLOWED_TYPES", "image/jpeg,image/png,image/webp")
    .split(",")
    .map(s => s.trim()),

  // Cache (used for HTTP Cache-Control headers)
  cacheTtlSeconds: getNumber("CACHE_TTL_SECONDS", 60),
} as const;
