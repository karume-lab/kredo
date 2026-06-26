import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";
import { formatToE164 } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { farmer_phone, guarantor_phone, guarantor_name, status } = body;

    if (!farmer_phone || !guarantor_phone || !status) {
      return NextResponse.json(
        {
          error:
            "Invalid payload: farmer_phone, guarantor_phone, and status are required",
        },
        { status: 400 },
      );
    }

    if (status !== "vouched" && status !== "rejected") {
      return NextResponse.json(
        { error: "Invalid status: must be either 'vouched' or 'rejected'" },
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

    const farmerE164 = formatToE164(String(farmer_phone));
    const guarantorE164 = formatToE164(String(guarantor_phone));

    const cypherQuery = `
      MERGE (f:Farmer {phone: $farmer_phone})
      MERGE (g:Guarantor {phone: $guarantor_phone})
      ON CREATE SET g.name = $guarantor_name

      // Handle conditional relationship draw
      FOREACH (x IN CASE WHEN $status = 'vouched' THEN [1] ELSE [] END |
        MERGE (g)-[r:VOUCHED_BY]->(f)
        SET r.vouchedAt = datetime()
      )
      FOREACH (x IN CASE WHEN $status = 'rejected' THEN [1] ELSE [] END |
        OPTIONAL MATCH (g)-[r:VOUCHED_BY]->(f)
        DELETE r
      )
    `;

    const session = driver.session();

    try {
      await session.executeWrite((tx) =>
        tx.run(cypherQuery, {
          farmer_phone: farmerE164,
          guarantor_phone: guarantorE164,
          guarantor_name: String(guarantor_name || "Unknown"),
          status: String(status),
        }),
      );
    } catch (err: unknown) {
      console.error("USSD Vouch Webhook Neo4j Error:", err);
      return NextResponse.json(
        { error: "Database transaction failed" },
        { status: 500 },
      );
    } finally {
      await session.close();
    }

    return NextResponse.json({
      message: `Guarantor vouch ${status} recorded successfully`,
    });
  } catch (error: unknown) {
    console.error("USSD Vouch Webhook Global Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
