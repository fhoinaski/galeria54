/**
 * Cloudflare bindings available in the Workers runtime.
 * Generated from wrangler.jsonc — do not edit manually.
 *
 * Usage:
 *   import { getCloudflareContext } from '@cloudflare/next-on-pages'
 *   const { env } = getCloudflareContext<CloudflareEnv>()
 */
interface CloudflareEnv {
  /** Cloudflare D1 database — binding: caffe54_menu_db */
  caffe54_menu_db: D1Database;
  /** Cloudflare R2 bucket — binding: caffe54_menu_images */
  caffe54_menu_images: R2Bucket;
}
