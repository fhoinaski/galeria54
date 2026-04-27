import { NextResponse } from "next/server";
import { feedbacksRepository } from "@/lib/feedbacks-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const [feedbacks, summary] = await Promise.all([
      feedbacksRepository.list(100),
      feedbacksRepository.getSummary(),
    ]);
    return NextResponse.json({ feedbacks, summary });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
