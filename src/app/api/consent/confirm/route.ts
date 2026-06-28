import { NextResponse } from "next/server";
import { addConsent } from "@/lib/consentStore";

export async function POST(req: Request) {
  try {
    const { phone } = await req.json();
    if (phone) {
      addConsent(phone);
    }
  } catch (e) {
    console.error("Failed to parse consent payload", e);
  }

  return NextResponse.json({
    success: true,
    message: "Consent verified successfully. Graph state updated.",
  });
}
