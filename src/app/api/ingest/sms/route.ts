import { NextResponse } from "next/server";
import { sendSMS } from "@/lib/sms";

export async function POST(req: Request) {
  try {
    const { to, message } = await req.json();

    if (!to) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    const defaultConsentMessage =
      "KREDO: Kiambu Credit Unit requests access to your cooperative delivery records to process your seasonal input loan of KES 30,000. Reply YES to authorize this evaluation.";

    const smsMessage = message || defaultConsentMessage;

    const result = await sendSMS({ to, message: smsMessage });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "SMS dispatched successfully",
        data: result.data || result.message,
      });
    }

    return NextResponse.json({ error: result.error }, { status: 500 });
  } catch (error) {
    console.error("SMS Dispatch Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
