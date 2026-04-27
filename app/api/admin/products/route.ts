import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import { validateMenuItem } from "@/lib/validation";
import type { CreateMenuItemInput } from "@/types/menu";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const items = await menuRepository.getMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as Record<string, unknown>;
    const { valid, errors } = validateMenuItem(body);
    if (!valid) return NextResponse.json({ errors }, { status: 422 });

    const item = await menuRepository.createMenuItem(body as unknown as CreateMenuItemInput);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
