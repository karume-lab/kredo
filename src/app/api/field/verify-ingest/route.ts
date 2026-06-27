import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";
import { formatToE164 } from "@/lib/phone";

export async function POST(req: Request) {
  const t0 = performance.now();
  try {
    const body = await req.json();
    const {
      phone,
      national_id,
      name,
      coop_code,
      acreage,
      primary_crop,
      revenue,
      officer_name,
    } = body;

    // Validate required fields
    if (
      !phone ||
      !national_id ||
      !name ||
      !coop_code ||
      !acreage ||
      !primary_crop ||
      !revenue ||
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
          f.acreage = toFloat($acreage),
          f.primaryCrop = $primary_crop,
          f.monthlyRevenue = toFloat($revenue),
          f.isFieldAudited = true,
          f.verifiedBy = $officer_name,
          f.verifiedAt = datetime(),
          f.lastUpdated = datetime()

        MERGE (c:Cooperative {code: $coop_code})
        
        MERGE (f)-[r:MEMBER_OF]->(c)
        SET 
          r.lastUpdated = datetime()
      `;

      await session.executeWrite((tx) =>
        tx.run(cypherQuery, {
          phone: formattedPhone,
          name: String(name),
          national_id: String(national_id),
          acreage: parseFloat(String(acreage)),
          primary_crop: String(primary_crop),
          revenue: parseFloat(String(revenue)),
          officer_name: String(officer_name),
          coop_code: String(coop_code),
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
