import { NextResponse } from "next/server";
import { addConsent } from "@/lib/consentStore";
import { classifyIntent } from "@/lib/nlp";
import { sendSMS } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const from = formData.get("from") as string;
    const text = formData.get("text") as string;

    if (!from || !text) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const intent = await classifyIntent(text);
    let responseMessage = "";

    if (intent === "SCORE") {
      responseMessage =
        "Your KREDO Trust Score: Healthy (4 / 5 Active Trust Links Verified). You have 1 active cooperative member link, 2 verified peer guarantors, and 1 active input supplier transaction account.";
    } else if (intent === "IMPROVE") {
      responseMessage =
        "To increase your credit limit from KES 30,000 to KES 45,000: 1) Maintain milk deliveries for 3 more days this month, or 2) ask a third cooperative member to vouch for you.";
    } else if (intent === "YES") {
      responseMessage =
        "Consent verified successfully. KREDO evaluation unlocked. Your loan officer will contact you shortly.";
      addConsent(from);
    } else {
      responseMessage =
        "Welcome to KREDO. Try replying with 'Score', 'Improve', or 'YES' if you have a pending evaluation request.";
    }

    await sendSMS({ to: from, message: responseMessage });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Incoming SMS Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
