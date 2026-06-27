import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password, role, username, branch } = body;

    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      const payload = {
        role: role || "loan_officer",
        username: username || "Wanjiku Njeri",
        branch: branch || "Kiambu Rural Credit Unit",
      };

      const token = await createSession(payload);
      const cookieStore = await cookies();

      cookieStore.set("kredo_admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });

      let redirectUrl = "/dashboard";
      if (payload.role === "sacco_admin" || payload.role === "sys_admin") {
        redirectUrl = "/admin/dashboard";
      }

      return NextResponse.json({ success: true, redirectUrl });
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 },
    );
  } catch (_error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.set("kredo_admin_session", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });
  return NextResponse.json({ success: true });
}
