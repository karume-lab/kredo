import { NextResponse } from "next/server";
import { generateRepaymentConfidenceBrief } from "@/lib/agent";
import { getConnection } from "@/lib/neo4j";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ phone: string }> },
) {
  try {
    const phone = (await params).phone;

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
