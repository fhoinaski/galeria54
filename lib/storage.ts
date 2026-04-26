/**
 * Storage abstraction for product images.
 *
 * Local provider — saves to /public/uploads/ (dev, zero deps)
 * R2 provider    — Cloudflare R2 via Workers binding caffe54_menu_images
 *
 * Provider selection:
 *   STORAGE_PROVIDER=local  → always use local filesystem (default)
 *   STORAGE_PROVIDER=r2     → use R2 binding; falls back to local if CF
 *                             context is not available (plain `next dev`)
 *
 * No S3 API keys needed — access is exclusively via CF binding.
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { env } from "./env";
import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export type UploadResult = {
  /** Public URL (absolute) or relative path for local uploads */
  url: string;
  /** Storage key — use to delete/replace the file later */
  key: string;
};

// ─── Key generation ───────────────────────────────────────────────────────────

function generateKey(file: File): string {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const uid = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  return `images/${y}/${m}/${uid}.${ext}`;
}

// ─── Local provider ───────────────────────────────────────────────────────────

async function uploadLocal(file: File): Promise<UploadResult> {
  const key = generateKey(file);
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  // Store with flattened filename to avoid nested dirs in /public/uploads/
  const fileName = key.replace(/\//g, "-");
  await writeFile(path.join(uploadDir, fileName), buffer);

  return { url: `/uploads/${fileName}`, key: fileName };
}

// ─── R2 provider ─────────────────────────────────────────────────────────────

async function uploadR2(file: File, bucket: R2Bucket): Promise<UploadResult> {
  const key = generateKey(file);
  const buffer = await file.arrayBuffer();

  await bucket.put(key, buffer, {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name },
  });

  // Build public URL: R2_PUBLIC_URL + key  (e.g. https://pub-xxx.r2.dev/images/...)
  const publicBase = env.r2PublicUrl.replace(/\/$/, "");
  const url = publicBase ? `${publicBase}/${key}` : key;

  return { url, key };
}

// ─── Provider selector ────────────────────────────────────────────────────────

function tryGetR2Bucket(): R2Bucket | null {
  if (env.storageProvider !== "r2") return null;
  const ctx = getOptionalRequestContext();
  if (!ctx) {
    if (process.env.NODE_ENV !== "test") {
      console.warn("[storage] STORAGE_PROVIDER=r2 but CF context unavailable — using local.");
    }
    return null;
  }
  return ctx.env.caffe54_menu_images;
}

// ─── Public interface ─────────────────────────────────────────────────────────

export const storage = {
  async upload(file: File): Promise<UploadResult> {
    const bucket = tryGetR2Bucket();
    if (bucket) return uploadR2(file, bucket);
    return uploadLocal(file);
  },

  /**
   * Delete a file from storage (best-effort — does not throw on 404).
   * Only implemented for R2; local files are left for manual cleanup.
   */
  async delete(key: string): Promise<void> {
    const bucket = tryGetR2Bucket();
    if (bucket) {
      try { await bucket.delete(key); } catch { /* ignore */ }
    }
  },
};
