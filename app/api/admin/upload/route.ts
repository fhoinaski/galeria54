import { NextResponse } from "next/server";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import { validateImageFile } from "@/lib/image";
import { storage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    const validation = validateImageFile(file);
    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 422 });
    }

    const result = await storage.upload(file);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/upload]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
