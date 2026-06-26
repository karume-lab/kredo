"use client";

import { useEffect, useRef } from "react";
import { Network } from "vis-network";
import type { GraphData } from "@/lib/neo4j";

export default function TrustGraph({ graphData }: { graphData?: GraphData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    // Helper to get CSS variable value
    const getCssVar = (name: string, fallback: string) => {
      if (typeof window !== "undefined") {
        const value = getComputedStyle(document.documentElement)
          .getPropertyValue(name)
          .trim();
        return value || fallback;
      }
      return fallback;
    };

    const primaryColor = getCssVar("--primary", "hsl(200 35% 41%)");
    const secondaryColor = getCssVar("--secondary", "hsl(126 39% 63%)");
    const guarantorColor = getCssVar("--chart-4", "hsl(43 74% 66%)"); // Soft orange/amber
    const mutedForeground = getCssVar(
      "--muted-foreground",
      "hsl(215.4 16.3% 46.9%)",
    );

    // Map data for vis-network
    const data = {
      nodes: graphData.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        title: node.title,
        group: node.group,
        shape: node.group === "farmer" ? "diamond" : "dot",
        size: node.group === "farmer" ? 30 : 20,
        font: { size: 14, color: mutedForeground }, // Use muted foreground
      })),
      edges: graphData.edges.map((edge) => ({
        from: edge.from,
        to: edge.to,
        label: edge.label,
        font: { align: "middle", size: 12, color: mutedForeground },
        arrows: "to",
        color: { color: mutedForeground },
      })),
    };

    const options = {
      groups: {
        farmer: { color: { background: primaryColor, border: primaryColor } },
        coop: { color: { background: secondaryColor, border: secondaryColor } },
        guarantor: {
          color: { background: guarantorColor, border: guarantorColor },
        },
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
    <div className="w-full h-full min-h-100 border border-border rounded-lg bg-card relative overflow-hidden">
      {!graphData && (
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
          No graph data available
        </div>
      )}
      <div ref={containerRef} className="w-full h-100" />
    </div>
  );
}
