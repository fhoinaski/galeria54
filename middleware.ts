import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let the login page and logout API through unconditionally
  if (pathname === "/admin/login") return NextResponse.next();

  // Protect all /admin/** UI routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;
    const expected = process.env.ADMIN_ACCESS_TOKEN || "admin123";

    if (!token || token !== expected) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Only run on /admin pages (not on API routes, which do their own auth)
  matcher: ["/admin", "/admin/:path*"],
};
