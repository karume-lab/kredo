"use client";

import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import type { GraphData } from "@/lib/neo4j";

export default function TrustGraph({ graphData }: { graphData?: GraphData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    // Map data for vis-network
    const data = {
      nodes: graphData.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        title: node.title,
        group: node.group,
        shape: node.group === "farmer" ? "diamond" : "dot",
        size: node.group === "farmer" ? 30 : 20,
        font: { size: 14, color: "#374151" },
      })),
      edges: graphData.edges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        label: edge.label,
        font: { align: "middle", size: 12, color: "#6B7280" },
        arrows: "to",
        color: { color: "#9CA3AF" },
      })),
    };

    const options = {
      groups: {
        farmer: { color: { background: "#3B82F6", border: "#2563EB" } },
        coop: { color: { background: "#10B981", border: "#059669" } },
        guarantor: { color: { background: "#F59E0B", border: "#D97706" } },
      },
      physics: {
        barnesHut: {
          gravitationalConstant: -2000,
          centralGravity: 0.3,
          springLength: 150,
        },
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [graphData]);

  return (
    <div className="w-full h-full min-h-100 border border-gray-200 rounded-lg bg-white relative">
      {!graphData && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          No graph data available
        </div>
      )}
      <div ref={containerRef} className="w-full h-100" />
    </div>
  );
}
