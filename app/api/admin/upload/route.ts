import { NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import { validateImageFile } from "@/lib/image";
import { storage } from "@/lib/storage";
import { env } from "@/lib/env";

export const runtime = "edge";
export const dynamic = "force-dynamic";

// Max body size: IMAGE_MAX_SIZE_MB + 10 KB for multipart overhead
export const maxDuration = 30;

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validate type
    if (!env.imageAllowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo não permitido. Aceitos: ${env.imageAllowedTypes.join(", ")}` },
        { status: 422 }
      );
    }

    // Validate size
    const maxBytes = env.imageMaxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${env.imageMaxSizeMb}MB` },
        { status: 422 }
      );
    }

    // Extra validation (magic bytes etc.)
    const validation = validateImageFile(file);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 422 });
    }

    // Upload — local filesystem (dev) or R2 (production)
    const result = await storage.upload(file);

    return NextResponse.json(
      {
        url: result.url,
        key: result.key,
        provider: env.storageProvider,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/admin/upload]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
