/**
 * Centralised, validated environment configuration.
 * Import `env` instead of reading process.env directly.
 *
 * Security rule: security-critical variables (ADMIN_ACCESS_TOKEN) are always
 * required — in production they throw, in development they warn loudly.
 * Cloudflare D1 / R2 are accessed via Workers bindings, not env vars.
 */

const isProd = process.env.NODE_ENV === "production";

/** Optional variable — uses fallback when set (any environment); throws in production if no fallback. */
function get(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value) return value;
  if (fallback !== undefined) return fallback;
  if (isProd) throw new Error(`[env] Missing required variable: ${key}`);
  return "";
}

/**
 * Security-critical variable — ALWAYS required, no fallback ever.
 * Throws in production AND in development if the variable is not set.
 */
function getRequired(key: string): string {
  const value = process.env[key];
  if (value) return value;
  throw new Error(
    `[env] ${key} is required but not set.\n` +
    `  → Copy .env.example to .env.local and fill in the value.`
  );
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

  // Admin — always required, no fallback
  adminAccessToken: getRequired("ADMIN_ACCESS_TOKEN"),

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
} as const;
