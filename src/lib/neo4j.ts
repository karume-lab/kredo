// src/lib/neo4j.ts
// Define the mock data structure
export interface GraphData {
  nodes: { id: string; label: string; group?: string; title?: string }[];
  edges: { from: string; to: string; label: string; id?: string }[];
  metrics?: {
    cooperative: string;
    guarantors: string;
    cashFlow: string;
    mobileMoney: string;
    climateRisk: string;
    digitalInputs: string;
    seasonalIncome: string;
  };
}

import neo4j, { type Driver } from "neo4j-driver";

export class Neo4jConnection {
  private uri: string | undefined;
  private driver: Driver | undefined;

  constructor(uri?: string) {
    this.uri = uri;
    if (this.uri) {
      const user = process.env.NEO4J_USER || "neo4j";
      const password = process.env.NEO4J_PASSWORD || "password";
      this.driver = neo4j.driver(this.uri, neo4j.auth.basic(user, password));
    }
  }

  public getDriver(): Driver | undefined {
    return this.driver;
  }

  public async getGraphData(phoneNumber: string): Promise<GraphData> {
    const mockData = {
      nodes: [
        {
          id: "farmer_1",
          label: "Farmer: Kamau",
          group: "farmer",
          title: "+254712345678",
        },
        { id: "coop_1", label: "Coop: Green Valley", group: "coop" },
        {
          id: "guarantor_1",
          label: "Guarantor: Wanjiku",
          group: "guarantor",
          title: "+254722000111",
        },
        {
          id: "guarantor_2",
          label: "Guarantor: Omondi",
          group: "guarantor",
          title: "+254733222333",
        },
        {
          id: "agrovet_1",
          label: "Agrovet: Mkulima Store",
          group: "agrovet",
          title: "Seed & Fertilizer",
        },
        {
          id: "weather_1",
          label: "Climate: Zone B",
          group: "climate",
          title: "Low Drought Risk",
        },
      ],
      edges: [
        { from: "farmer_1", to: "coop_1", label: "MEMBER_OF" },
        { from: "guarantor_1", to: "farmer_1", label: "VOUCHED_BY" },
        { from: "guarantor_2", to: "farmer_1", label: "VOUCHED_BY" },
        { from: "farmer_1", to: "agrovet_1", label: "TRANSACTED_WITH" },
        { from: "weather_1", to: "farmer_1", label: "AFFECTS_YIELD" },
      ],
      metrics: {
        cooperative: "Green Valley - 26 days/mo",
        guarantors: "2 Active Members with Perfect Files",
        cashFlow: "KES 18,000/mo",
        mobileMoney: "High (92% consistency over 6 mo)",
        climateRisk: "Low Drought Exposure (Zone B)",
        digitalInputs: "Consistent Seed/Fertilizer via M-Pesa",
        seasonalIncome: "Stable dairy yields over 12 mo",
      },
    };

    if (!this.uri || !this.driver) {
      return mockData;
    }

    try {
      // Test connection
      await this.driver.getServerInfo();

      const session = this.driver.session();
      const cypherQuery = `
        MATCH (f:Farmer {phone: $phone})
        OPTIONAL MATCH (f)-[r1:MEMBER_OF]->(c:Cooperative)
        OPTIONAL MATCH (g:Guarantor)-[r2:VOUCHED_BY]->(f)
        OPTIONAL MATCH (f)-[r3:TRANSACTED_WITH]->(a:Agrovet)
        RETURN f, r1, c, g, r2, a, r3
      `;

      const result = await session.run(cypherQuery, { phone: phoneNumber });
      await session.close();

      if (result.records.length === 0) {
        // Fallback to mock data if no records found
        return mockData;
      }

      const nodesMap = new Map<
        string,
        { id: string; label: string; group?: string; title?: string }
      >();
      const edgesMap = new Map<
        string,
        { id?: string; from: string; to: string; label: string }
      >();
      let coopName = "Unknown";
      let guarantorCount = 0;

      const getSafeId = (id: unknown) =>
        neo4j.isInt(id) ? id.toString() : String(id);

      for (const record of result.records) {
        const f = record.get("f");
        if (f) {
          const id = getSafeId(f.identity);
          nodesMap.set(id, {
            id,
            label: `Farmer: ${f.properties.name || "Unknown"}`,
            group: "farmer",
            title: f.properties.phone,
          });
        }

        const c = record.get("c");
        if (c) {
          const id = getSafeId(c.identity);
          nodesMap.set(id, {
            id,
            label: `Coop: ${c.properties.name || "Unknown"}`,
            group: "coop",
          });
          coopName = c.properties.name || "Unknown";
        }

        const g = record.get("g");
        if (g) {
          const id = getSafeId(g.identity);
          nodesMap.set(id, {
            id,
            label: `Guarantor: ${g.properties.name || "Unknown"}`,
            group: "guarantor",
            title: g.properties.phone,
          });
          guarantorCount++;
        }

        const a = record.get("a");
        if (a) {
          const id = getSafeId(a.identity);
          nodesMap.set(id, {
            id,
            label: `Agrovet: ${a.properties.name || "Unknown"}`,
            group: "agrovet",
          });
        }

        const r1 = record.get("r1");
        if (r1) {
          const id = getSafeId(r1.identity);
          edgesMap.set(id, {
            id,
            from: getSafeId(r1.start),
            to: getSafeId(r1.end),
            label: r1.type,
          });
        }

        const r2 = record.get("r2");
        if (r2) {
          const id = getSafeId(r2.identity);
          edgesMap.set(id, {
            id,
            from: getSafeId(r2.start),
            to: getSafeId(r2.end),
            label: r2.type,
          });
        }

        const r3 = record.get("r3");
        if (r3) {
          const id = getSafeId(r3.identity);
          edgesMap.set(id, {
            id,
            from: getSafeId(r3.start),
            to: getSafeId(r3.end),
            label: r3.type,
          });
        }
      }

      return {
        nodes: Array.from(nodesMap.values()),
        edges: Array.from(edgesMap.values()),
        metrics: {
          cooperative: `${coopName} - 26 days/mo`,
          guarantors: `${guarantorCount} Active Members`,
          cashFlow: "KES 18,000/mo", // Mocked cashflow as it's not in the graph query
          mobileMoney: "High (92% consistency over 6 mo)",
          climateRisk: "Low Drought Exposure (Zone B)",
          digitalInputs: "Consistent Seed/Fertilizer via M-Pesa",
          seasonalIncome: "Stable dairy yields over 12 mo",
        },
      };
    } catch (err) {
      console.warn(
        "Neo4j query failed or DB offline, falling back to mock dataset.",
        err,
      );
      return mockData;
    }
  }

  public async close() {
    if (this.driver) {
      await this.driver.close();
    }
  }
}

export function getConnection(): Neo4jConnection {
  const uri = process.env.NEO4J_URI;
  return new Neo4jConnection(uri);
}
