import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/dashboard")
  ) {
    const sessionCookie = request.cookies.get("kredo_admin_session");

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const payload = await verifySession(sessionCookie.value);

    if (!payload) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Optional: add role-based protection
    if (
      pathname.startsWith("/admin/dashboard") &&
      payload.role === "loan_officer"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/dashboard/:path*"],
};
