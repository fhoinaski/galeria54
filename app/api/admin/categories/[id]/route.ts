import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  const category = await menuRepository.getCategoryById(id);
  if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(category);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body = await request.json();
    const category = await menuRepository.updateCategory(id, body);
    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  try {
    await menuRepository.deleteCategory(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
