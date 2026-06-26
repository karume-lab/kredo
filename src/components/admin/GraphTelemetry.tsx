"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface TelemetryData {
  nodeCount: number;
  edgeCount: number;
  status: string;
}

export function GraphTelemetry() {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTelemetry = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/telemetry");
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || "Failed to load telemetry");
      }
    } catch (_err) {
      setError("Network error fetching telemetry");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">AuraDB Footprint</h2>
        <Button
          onClick={fetchTelemetry}
          disabled={loading}
          variant="outline"
          className="bg-secondary/10 text-secondary border-secondary/30 hover:bg-secondary/20 hover:text-secondary text-xs uppercase tracking-wider transition-colors"
        >
          {loading ? "Polling..." : "Refresh Metrics"}
        </Button>
      </div>

      {error ? (
        <Alert
          variant="destructive"
          className="bg-destructive/10 border-destructive/50 rounded-none"
        >
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#000000] border-border rounded-none p-6 shadow-none">
            <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Total Farmer Nodes
            </h3>
            <div className="text-4xl font-bold text-secondary">
              {loading ? "--" : data?.nodeCount?.toLocaleString() || "0"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Active entities in graph
            </div>
          </Card>

          <Card className="bg-[#000000] border-border rounded-none p-6 shadow-none">
            <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Vouched Connections
            </h3>
            <div className="text-4xl font-bold text-secondary">
              {loading ? "--" : data?.edgeCount?.toLocaleString() || "0"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Total established edges
            </div>
          </Card>

          <Card className="bg-[#000000] border-border rounded-none p-6 shadow-none">
            <h3 className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
              Cluster Status
            </h3>
            <div className="text-2xl font-bold text-secondary mt-2 flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${data?.status === "healthy" ? "bg-secondary" : "bg-destructive"}`}
              ></div>
              <span className="uppercase">
                {loading ? "WAITING" : data?.status || "UNKNOWN"}
              </span>
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Neo4j Driver Connection
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
