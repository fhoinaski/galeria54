import { NextResponse } from "next/server";
import { tablesRepository } from "@/lib/tables-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import { env } from "@/lib/env";
import type { CreateTableInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const tables = await tablesRepository.list();
    return NextResponse.json(tables);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as Partial<CreateTableInput>;
    if (!body.number || !body.label) {
      return NextResponse.json({ error: "number e label são obrigatórios" }, { status: 422 });
    }
    const qrUrl = body.qrUrl || `${env.appUrl}/?table=${encodeURIComponent(body.label)}`;
    const table = await tablesRepository.create({
      number: Number(body.number),
      label: body.label,
      capacity: body.capacity ?? 4,
      status: body.status ?? "available",
      qrUrl,
      notes: body.notes,
    });
    return NextResponse.json(table, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
