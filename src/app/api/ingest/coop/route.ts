import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";
import { formatToE164 } from "@/lib/phone";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { coop_code, coop_name, coop_location, deliveries } = body;

    if (!coop_code || !Array.isArray(deliveries)) {
      return NextResponse.json(
        {
          error: "Invalid payload: coop_code and deliveries array are required",
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

    // Pre-process and sanitize the deliveries array
    const sanitizedDeliveries: Record<string, unknown>[] = [];
    let skippedCount = 0;

    for (const delivery of deliveries) {
      if (!delivery.phone) {
        skippedCount++;
        continue;
      }
      sanitizedDeliveries.push({
        farmer_phone: formatToE164(String(delivery.phone)),
        national_id: delivery.national_id ? String(delivery.national_id) : null,
        farmer_name: delivery.name ? String(delivery.name) : "Unknown",
        delivery_date: String(delivery.delivery_date),
        freq: Number(delivery.freq_days_per_month || 0),
        revenue: Number(delivery.monthly_revenue || 0),
      });
    }

    if (sanitizedDeliveries.length === 0) {
      return NextResponse.json(
        { error: "No valid delivery records with phone numbers found" },
        { status: 400 },
      );
    }

    const cypherQuery = `
      UNWIND $deliveries AS record
      MERGE (f:Farmer {phone: record.farmer_phone})
      ON CREATE SET 
        f.nationalId = record.national_id,
        f.name = record.farmer_name,
        f.createdAt = datetime(),
        f.isConsented = false
      ON MATCH SET 
        f.lastUpdated = datetime()

      MERGE (c:Cooperative {code: $coop_code})
      ON CREATE SET 
        c.name = $coop_name,
        c.location = $coop_location

      MERGE (f)-[r:MEMBER_OF]->(c)
      SET 
        r.lastDeliveryDate = date(record.delivery_date),
        r.deliveryFrequencyDaysPerMonth = toInteger(record.freq),
        r.monthlyRevenue = toFloat(record.revenue),
        r.lastUpdated = datetime()
    `;

    const session = driver.session();

    try {
      await session.executeWrite((tx) =>
        tx.run(cypherQuery, {
          coop_code: String(coop_code),
          coop_name: String(coop_name || ""),
          coop_location: String(coop_location || ""),
          deliveries: sanitizedDeliveries,
        }),
      );
    } catch (err: unknown) {
      console.error("Coop Ingest Error during batch transaction:", err);
      return NextResponse.json(
        { error: "Database transaction failed for bulk ingest" },
        { status: 500 },
      );
    } finally {
      await session.close();
    }

    return NextResponse.json({
      message: "Batch processing completed",
      processedCount: sanitizedDeliveries.length,
      skippedCount,
    });
  } catch (error: unknown) {
    console.error("Coop Ingest Global Error", error);
    return NextResponse.json(
      { error: "Internal server error during batch processing" },
      { status: 500 },
    );
  }
}
