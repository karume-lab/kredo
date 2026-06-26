import { NextResponse } from "next/server";
import { getConnection } from "@/lib/neo4j";

export async function GET() {
  try {
    const neo4jConnection = getConnection();
    const driver = neo4jConnection.getDriver();

    if (!driver) {
      throw new Error("Neo4j driver is not initialized");
    }

    const session = driver.session();

    try {
      const [nodeResult, edgeResult] = await Promise.all([
        session.run("MATCH (n) RETURN count(n) AS nodeCount"),
        session.run("MATCH ()-[r]->() RETURN count(r) AS edgeCount"),
      ]);

      const nodeCount =
        nodeResult.records[0]?.get("nodeCount")?.toNumber() || 0;
      const edgeCount =
        edgeResult.records[0]?.get("edgeCount")?.toNumber() || 0;

      return NextResponse.json({
        success: true,
        data: {
          nodeCount,
          edgeCount,
          status: "healthy",
        },
      });
    } finally {
      await session.close();
    }
  } catch (error) {
    console.error("Admin Telemetry Neo4j Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch telemetry data" },
      { status: 500 },
    );
  }
}
