import { NextResponse } from "next/server";
import { analyticsRepository } from "@/lib/analytics-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to") || new Date().toISOString();
    const from =
      searchParams.get("from") ||
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const data = await analyticsRepository.getAnalytics(from, to);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
