import { NextResponse } from "next/server";
import { sessionsRepository } from "@/lib/sessions-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { CreateSessionInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? undefined;
    const sessions = await sessionsRepository.list(status);
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as CreateSessionInput;
    if (!body.tableId) {
      return NextResponse.json({ error: "tableId é obrigatório" }, { status: 422 });
    }
    const session = await sessionsRepository.create(body);
    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
