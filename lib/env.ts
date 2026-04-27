/**
 * Centralised environment configuration.
 * Import `env` instead of reading process.env directly.
 *
 * Cloudflare D1 / R2 are accessed via Workers bindings, not env vars.
 * Security note: ADMIN_ACCESS_TOKEN is read lazily/optionally here so Next.js
 * can complete its build step even when Cloudflare build env vars are not
 * injected into the Vercel build subprocess used by @cloudflare/next-on-pages.
 * Admin requests still fail closed when the token is missing.
 */

const isProd = process.env.NODE_ENV === "production";

/** Optional variable — uses fallback when provided; throws in production if no fallback. */
function get(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value) return value;
  if (fallback !== undefined) return fallback;
  if (isProd) throw new Error(`[env] Missing required variable: ${key}`);
  return "";
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



  // Database — D1 access via CF binding (see lib/db.ts)
  databaseProvider: get("DATABASE_PROVIDER", "local") as "local" | "d1",

  // Storage — R2 access via CF binding (see lib/storage.ts)
  storageProvider: get("STORAGE_PROVIDER", "local") as "local" | "r2",
  r2PublicUrl:     get("R2_PUBLIC_URL", ""),
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

  // Cache — used for HTTP Cache-Control headers
  cacheTtlSeconds: getNumber("CACHE_TTL_SECONDS", 60),
};
