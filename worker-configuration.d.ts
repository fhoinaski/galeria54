/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    /** Cloudflare D1 database — binding: caffe54_menu_db */
    caffe54_menu_db: D1Database;
    /** Cloudflare R2 bucket — binding: caffe54_menu_images */
    caffe54_menu_images: R2Bucket;
  }
}

export {};
