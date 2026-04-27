import { NextResponse } from "next/server";
import { eventsRepository } from "@/lib/events-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import type { CreateEventInput } from "@/types/business";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const events = await eventsRepository.list();
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as CreateEventInput;
    if (!body.title || !body.startDate || !body.endDate) {
      return NextResponse.json(
        { error: "title, startDate e endDate são obrigatórios" },
        { status: 422 }
      );
    }
    const event = await eventsRepository.create({
      ...body,
      active: body.active ?? true,
      categoryIds: body.categoryIds ?? [],
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
