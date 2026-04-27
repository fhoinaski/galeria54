import { NextResponse } from "next/server";
import { eventsRepository } from "@/lib/events-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { UpdateEventInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { id } = await params;
    const body = await request.json() as UpdateEventInput;
    const event = await eventsRepository.update(id, body);
    return NextResponse.json(event);
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
    await eventsRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
