import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";
import { formatToE164 } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      BillRefNumber, // Farmer's phone number
      TransAmount,
      BusinessShortCode, // Agrovet Paybill
      OrgPaymentID,
    } = body;

    if (!BillRefNumber || !TransAmount || !BusinessShortCode) {
      return NextResponse.json(
        {
          error:
            "Invalid payload: BillRefNumber, TransAmount, and BusinessShortCode are required",
        },
        { status: 400 },
      );
    }

    const neo4jConnection = getConnection();
    const driver = neo4jConnection.getDriver();

    if (!driver) {
      return NextResponse.json(
        { error: "Database connection not available" },
        { status: 500 },
      );
    }

    const farmerPhoneE164 = formatToE164(String(BillRefNumber));
    const paybill = String(BusinessShortCode);
    const amount = Number(parseFloat(TransAmount)) || 0.0;

    const cypherQuery = `
      MERGE (f:Farmer {phone: $farmer_phone})
      MERGE (a:Agrovet {paybill: $paybill})
      MERGE (f)-[r:TRANSACTED_WITH]->(a)
      SET 
        r.lastTransactionAmount = toFloat($amount),
        r.lastTransactionDate = datetime(),
        r.transactionCount = coalesce(r.transactionCount, 0) + 1
    `;

    const session = driver.session();

    try {
      await session.executeWrite((tx) =>
        tx.run(cypherQuery, {
          farmer_phone: farmerPhoneE164,
          paybill: paybill,
          amount: amount,
        }),
      );
    } catch (err: unknown) {
      console.error("M-Pesa Webhook Neo4j Error:", err);
      return NextResponse.json(
        { error: "Database transaction failed" },
        { status: 500 },
      );
    } finally {
      await session.close();
    }

    return NextResponse.json({
      message: "M-Pesa transaction recorded successfully",
      transactionId: OrgPaymentID,
    });
  } catch (error: unknown) {
    console.error("M-Pesa Webhook Global Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
