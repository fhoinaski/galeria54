/**
 * Centralised, validated environment configuration.
 * Import `env` instead of reading process.env directly.
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

  // Database
  databaseProvider: get("DATABASE_PROVIDER", "local") as "local" | "d1",
  databaseUrl:      get("DATABASE_URL", ""),

  // Storage
  storageProvider: get("STORAGE_PROVIDER", "local") as "local" | "r2",
  r2: {
    accountId:       get("R2_ACCOUNT_ID",        ""),
    accessKeyId:     get("R2_ACCESS_KEY_ID",     ""),
    secretAccessKey: get("R2_SECRET_ACCESS_KEY", ""),
    bucketName:      get("R2_BUCKET_NAME",       ""),
    publicUrl:       get("R2_PUBLIC_URL",        ""),
  },

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

  // Cache
  cacheTtlSeconds: getNumber("CACHE_TTL_SECONDS", 60),
} as const;
