import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  const item = await menuRepository.getMenuItemById(id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(item);
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  try {
    const body = await request.json();
    const item = await menuRepository.updateMenuItem(id, body);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  try {
    await menuRepository.deleteMenuItem(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

// Duplicate action via POST to /api/admin/products/:id/duplicate would be cleaner,
// but using a query param keeps the route structure flat.
export async function POST(request: Request, { params }: Params) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  const { id } = await params;
  const url = new URL(request.url);
  if (url.searchParams.get("action") !== "duplicate") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  try {
    const copy = await menuRepository.duplicateMenuItem(id);
    return NextResponse.json(copy, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
