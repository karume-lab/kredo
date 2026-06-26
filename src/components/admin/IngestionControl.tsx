"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function IngestionControl() {
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);

  const simulateIngest = async (endpoint: string) => {
    setTriggerStatus(`Simulating trigger for ${endpoint}...`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulated: true,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setTriggerStatus(`Success [${response.status}]: ${JSON.stringify(data)}`);
    } catch (error) {
      setTriggerStatus(`Error executing ${endpoint}: ${error}`);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-[#000000] border-border rounded-none shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-primary">
            Manual CSV Batch Ingestion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-border p-12 text-center bg-[#050505] hover:bg-[#0a0a0a] transition-colors cursor-pointer">
            <div className="text-muted-foreground text-sm uppercase tracking-widest mb-2">
              Drag & Drop Payload
            </div>
            <div className="text-xs text-muted-foreground/70">
              Supports .csv, .jsonl formats for cooperative bulk updates
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#000000] border-border rounded-none shadow-none">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-primary">
            Pipeline Simulation Hooks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => simulateIngest("/api/ingest/mpesa")}
              className="h-auto flex items-center justify-between p-4 border-border hover:border-primary hover:bg-transparent transition-colors text-left group rounded-none"
            >
              <div>
                <div className="font-bold text-sm mb-1 group-hover:text-secondary transition-colors">
                  M-PESA Webhook
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  /api/ingest/mpesa
                </div>
              </div>
              <div className="text-xs uppercase bg-primary/10 text-primary px-2 py-1">
                Trigger
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => simulateIngest("/api/ingest/vouch")}
              className="h-auto flex items-center justify-between p-4 border-border hover:border-primary hover:bg-transparent transition-colors text-left group rounded-none"
            >
              <div>
                <div className="font-bold text-sm mb-1 group-hover:text-secondary transition-colors">
                  USSD Vouch Payload
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  /api/ingest/vouch
                </div>
              </div>
              <div className="text-xs uppercase bg-primary/10 text-primary px-2 py-1">
                Trigger
              </div>
            </Button>
          </div>

          {triggerStatus && (
            <div className="mt-4 p-3 bg-[#050505] border border-border font-mono text-xs text-muted-foreground break-all">
              {">"} {triggerStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
