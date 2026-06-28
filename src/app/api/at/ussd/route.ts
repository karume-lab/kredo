import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const text = (formData.get("text") as string) || "";

    let response = "";

    if (text === "") {
      response =
        "CON Welcome to KREDO.\n1. View Trust Score\n2. Improve Credit\n3. Consent to Loan";
    } else if (text === "1") {
      response =
        "END Your KREDO Trust Score is Healthy. 4/5 Active Trust Links Verified.";
    } else if (text === "2") {
      response =
        "END To increase limit: 1) Maintain milk deliveries for 3 more days, or 2) get a 3rd guarantor.";
    } else if (text === "3") {
      response =
        "END Consent verified. KREDO evaluation unlocked. Your loan officer will call you.";
    } else {
      response = "END Invalid choice. Please try again.";
    }

    return new NextResponse(response, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  } catch (error) {
    console.error("USSD Error:", error);
    return new NextResponse("END Internal server error", { status: 500 });
  }
}
