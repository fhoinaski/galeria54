import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { getRecommendations } from "@/lib/recommendations";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const items = await menuRepository.getMenuItems();
    const recommendations = getRecommendations(items, {}, 6);
    return NextResponse.json(recommendations, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
