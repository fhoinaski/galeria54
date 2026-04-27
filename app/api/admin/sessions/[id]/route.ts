import { NextResponse } from "next/server";
import { sessionsRepository } from "@/lib/sessions-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { AddSessionItemInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const session = await sessionsRepository.get(id);
    if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    return NextResponse.json(session);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json() as { action: "close" } | Omit<AddSessionItemInput, "sessionId">;
    if ("action" in body && body.action === "close") {
      const session = await sessionsRepository.close(id);
      return NextResponse.json(session);
    }
    const item = await sessionsRepository.addItem({ ...(body as Omit<AddSessionItemInput, "sessionId">), sessionId: id });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
