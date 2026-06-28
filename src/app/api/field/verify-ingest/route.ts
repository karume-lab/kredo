import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";
import { formatToE164 } from "@/lib/phone";

export async function POST(req: Request) {
  const t0 = performance.now();
  try {
    const body = await req.json();
    const { phone, national_id, name, assets, officer_name } = body;

    // Validate required fields
    if (
      !phone ||
      !national_id ||
      !name ||
      !assets ||
      !Array.isArray(assets) ||
      assets.length === 0 ||
      !officer_name
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required metadata parameters." },
        { status: 400 },
      );
    }

    // Sanitize phone
    const formattedPhone = formatToE164(String(phone));

    // Connect to Neo4j
    const conn = getConnection();
    const driver = conn.getDriver();
    if (!driver) {
      throw new Error("Neo4j driver is not initialized.");
    }

    const session = driver.session();
    try {
      const cypherQuery = `
        MERGE (f:Farmer {phone: $phone})
        ON CREATE SET 
          f.name = $name,
          f.nationalId = $national_id,
          f.createdAt = datetime(),
          f.isConsented = false
        SET
          f.isFieldAudited = true,
          f.verifiedBy = $officer_name,
          f.verifiedAt = datetime(),
          f.lastUpdated = datetime()

        WITH f
        UNWIND $assets AS asset
        
        MERGE (c:Cooperative {code: asset.coop_code})
        
        CREATE (a:Asset {
          acreage: toFloat(asset.acreage),
          primaryCrop: asset.primary_crop,
          monthlyRevenue: toFloat(asset.revenue),
          createdAt: datetime()
        })
        
        MERGE (f)-[:OWNS]->(a)
        MERGE (a)-[:ASSOCIATED_WITH]->(c)
        MERGE (f)-[r:MEMBER_OF]->(c)
        SET r.lastUpdated = datetime()
      `;

      await session.executeWrite((tx) =>
        tx.run(cypherQuery, {
          phone: formattedPhone,
          name: String(name),
          national_id: String(national_id),
          officer_name: String(officer_name),
          assets: assets.map((a: Record<string, unknown>) => ({
            coop_code: String(a.coop_code),
            acreage: parseFloat(String(a.acreage)),
            primary_crop: String(a.primary_crop),
            revenue: parseFloat(String(a.revenue)),
          })),
        }),
      );
    } finally {
      await session.close();
      await conn.close();
    }

    // Trigger internal async loop for Africa's Talking WhatsApp/SMS simulation
    // We execute this asynchronously so it does not block the response
    (async () => {
      try {
        console.log(
          `[AT-SIMULATOR] Triggering WhatsApp/SMS consent flow for ${formattedPhone}...`,
        );
        // In a real environment, we'd hit the Africa's Talking API endpoint.
        // For the simulation, we'll just log it or call our internal webhook.
        await fetch(new URL("/api/consent/confirm", req.url).toString(), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formattedPhone }),
        }).catch(() => {
          // Fire and forget
        });
      } catch (err) {
        console.error("Failed to trigger AT simulator:", err);
      }
    })();

    const t1 = performance.now();

    return NextResponse.json({
      success: true,
      message: "Farmer record successfully verified and mapped to graph",
      processed_phone: formattedPhone,
      telemetry: {
        execution_time_ms: Math.round(t1 - t0),
      },
    });
  } catch (error: unknown) {
    console.error("Field ingest error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
