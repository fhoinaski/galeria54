/**
 * Simple admin authentication via a shared token.
 * The token is compared against ADMIN_ACCESS_TOKEN env var.
 *
 * Accepts the token as:
 *   - "Authorization: Bearer <token>" header  (API clients)
 *   - "admin_token" cookie                    (browser sessions)
 *
 * Replace this module with a proper auth provider (NextAuth, Clerk, etc.)
 * when multi-user or role-based access is needed.
 */

import { cookies, headers } from "next/headers";
import { env } from "./env";

export async function verifyAdminRequest(): Promise<boolean> {
  const expected = env.adminAccessToken;
  if (!expected) return false;

  // 1. Check Authorization header (API clients)
  const headerStore = await headers();
  const authHeader = headerStore.get("Authorization");
  if (authHeader === `Bearer ${expected}`) return true;

  // 2. Check admin_token cookie (browser)
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get("admin_token")?.value;
  if (cookieToken === expected) return true;

  return false;
}

export function unauthorizedResponse(message = "Unauthorized"): Response {
  return Response.json({ error: message }, { status: 401 });
}
