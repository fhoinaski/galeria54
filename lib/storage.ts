/**
 * Storage abstraction for product images.
 * Local provider: saves to /public/uploads/ (dev only).
 * R2 provider: stub ready for Cloudflare R2 integration.
 */

import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { env } from "./env";

export type UploadResult = {
  url: string;
  key?: string;
};

// ─── Local provider ───────────────────────────────────────────────────────────

async function uploadLocal(file: File): Promise<UploadResult> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, key), buffer);

  return { url: `/uploads/${key}`, key };
}

// ─── R2 provider stub ─────────────────────────────────────────────────────────

async function uploadR2(_file: File): Promise<UploadResult> {
  // TODO: implement with @aws-sdk/client-s3 (R2 is S3-compatible)
  // const client = new S3Client({
  //   region: "auto",
  //   endpoint: `https://${env.r2.accountId}.r2.cloudflarestorage.com`,
  //   credentials: { accessKeyId: env.r2.accessKeyId, secretAccessKey: env.r2.secretAccessKey },
  // });
  throw new Error(
    "R2 provider not yet implemented. Set STORAGE_PROVIDER=local for development."
  );
}

// ─── Public interface ─────────────────────────────────────────────────────────

export const storage = {
  async upload(file: File): Promise<UploadResult> {
    if (env.storageProvider === "r2") return uploadR2(file);
    return uploadLocal(file);
  },
};
