import { NextResponse } from "next/server";
import { menuRepository } from "@/lib/menu-repository";
import { verifyAdminRequest, unauthorizedResponse } from "@/lib/auth-admin";
import { validateCategory } from "@/lib/validation";
import { slugify } from "@/lib/slugify";
import type { CreateCategoryInput } from "@/types/menu";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const categories = await menuRepository.getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminRequest())) return unauthorizedResponse();
  try {
    const body = await request.json() as Record<string, unknown>;
    // Auto-generate slug from PT name if not provided
    if (!body.slug && (body.name as Record<string,string> | undefined)?.pt) {
      body.slug = slugify((body.name as Record<string,string>).pt);
    }
    const { valid, errors } = validateCategory(body);
    if (!valid) return NextResponse.json({ errors }, { status: 422 });

    const category = await menuRepository.createCategory(body as unknown as CreateCategoryInput);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
