import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { env } from "@/lib/env";

export const revalidate = 60;

export async function GET() {
  try {
    const data = await menuRepository.getMenuData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[GET /api/menu]", error);
    return NextResponse.json({ error: "Failed to load menu" }, { status: 500 });
  }
}
