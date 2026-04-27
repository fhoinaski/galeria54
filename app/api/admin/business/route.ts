import { NextResponse } from "next/server";
import { businessRepository } from "@/lib/business-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { UpdateBusinessSettingsInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const settings = await businessRepository.get();
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as UpdateBusinessSettingsInput;
    const updated = await businessRepository.update(body);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
