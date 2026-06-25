// src/lib/neo4j.ts
// Define the mock data structure
export interface GraphData {
  nodes: { id: string; label: string; group?: string; title?: string }[];
  edges: { from: string; to: string; label: string; id?: string }[];
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

  public async getGraphData(_phoneNumber: string): Promise<GraphData> {
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
      ],
      edges: [
        { from: "farmer_1", to: "coop_1", label: "MEMBER_OF" },
        { from: "guarantor_1", to: "farmer_1", label: "VOUCHED_BY" },
        { from: "guarantor_2", to: "farmer_1", label: "VOUCHED_BY" },
      ],
    };

    if (!this.uri || !this.driver) {
      return mockData;
    } else {
      // In a real app, you would query Neo4j here.
      // For the prototype, since the database is empty, we still return the mock data
      // to keep the frontend functional, while ensuring the driver connects successfully.
      try {
        await this.driver.getServerInfo(); // Test connection
        return mockData;
      } catch (err) {
        console.error("Neo4j connection error:", err);
        return mockData;
      }
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
