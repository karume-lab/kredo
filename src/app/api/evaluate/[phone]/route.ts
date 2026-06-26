import { NextResponse } from "next/server";
import { generateRepaymentConfidenceBrief } from "@/lib/agent";
import { getConnection } from "@/lib/neo4j";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ phone: string }> },
) {
  try {
    const rawPhone = (await params).phone;

    // Parameter Sanitization
    const decodedPhone = decodeURIComponent(rawPhone);
    const phone = decodedPhone.replace(/[\s\-()]/g, "");

    // Consent Security Check (SMS Opt-In Simulator)
    const optedInFarmers = ["+254712345678", "+254722000111", "+254733222333"];
    if (!optedInFarmers.includes(phone)) {
      return NextResponse.json(
        {
          error: "Consent Pending",
          message:
            "Farmer has not replied 'YES' to the SMS opt-in request. Vetting cannot proceed without explicit consent under the Kenya Data Protection Act (2019).",
        },
        { status: 403 },
      );
    }

    // Get database connection
    const db = getConnection();
    const graphData = await db.getGraphData(phone);
    await db.close();

    // Generate brief using Featherless API
    const brief = await generateRepaymentConfidenceBrief(graphData);

    return NextResponse.json({
      phone_number: phone,
      graph: graphData,
      repayment_confidence_brief: brief,
    });
  } catch (error: unknown) {
    console.error("API Evaluation Error:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
