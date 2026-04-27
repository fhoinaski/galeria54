import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { env } from "@/lib/env";

export const runtime = "edge";
export const revalidate = 60;
export const dynamic = "force-dynamic";

function createEtag(value: string): string {
  const encoded = typeof btoa === "function"
    ? btoa(value)
    : value.replace(/[^a-zA-Z0-9]/g, "");

  return `"${encoded.slice(0, 16)}"`;
}

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
        "Cache-Control": `public, s-maxage=${ttl}, stale-while-revalidate=${stale}`,
        "CDN-Cache-Control": `public, max-age=${ttl}`,
        "ETag": createEtag(updatedAt),
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
