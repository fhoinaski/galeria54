import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token?: string };

    if (!token || token !== env.adminAccessToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // secure: true — enable when deploying to HTTPS
      maxAge: 60 * 60 * 24, // 24h
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
