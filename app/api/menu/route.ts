import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { env } from "@/lib/env";

export const runtime = "edge";
export const revalidate = 60;
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { categories, items, updatedAt } = await menuRepository.getMenuDataWithMeta();

    const ttl = env.cacheTtlSeconds;
    const stale = ttl * 2;

    const payload = {
      categories,
      items,
      meta: {
        updatedAt,
        totalItems: items.length,
        availableItems: items.filter(i => i.available).length,
      },
      version: 1,
    };

    return NextResponse.json(payload, {
      headers: {
        // CDN + browser caching
        "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${stale}`,
        // Allows CDN to serve stale while revalidating
        "CDN-Cache-Control": `public, max-age=${ttl}`,
        // ETag based on updatedAt for conditional GET support
        "ETag": `"${Buffer.from(updatedAt).toString("base64").slice(0, 16)}"`,
        "Last-Modified": new Date(updatedAt).toUTCString(),
        "Vary": "Accept-Encoding",
      },
    });
  } catch (error) {
    console.error("[GET /api/menu]", error);
    return NextResponse.json(
      { error: "Falha ao carregar cardápio" },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
