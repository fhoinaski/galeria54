import { NextResponse } from "next/server";
import { tablesRepository } from "@/lib/tables-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { UpdateTableInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json() as UpdateTableInput;
    const table = await tablesRepository.update(id, body);
    return NextResponse.json(table);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { id } = await params;
    await tablesRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
