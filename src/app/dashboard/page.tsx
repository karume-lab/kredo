"use client";

import { Database, Loader2, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AgentLogPanel from "@/components/AgentLogPanel";
import DecisionCard from "@/components/DecisionCard";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import WhatsAppSimulator from "@/components/WhatsAppSimulator";
import type { GraphData } from "@/lib/neo4j";

const TrustGraph = dynamic(() => import("@/components/TrustGraph"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-100 flex items-center justify-center text-muted-foreground bg-card border border-border rounded-lg">
      <Loader2 className="w-6 h-6 animate-spin mr-2" />
      Loading graph...
    </div>
  ),
});

interface EvaluationData {
  graph: GraphData;
  repayment_confidence_brief: string;
}

export default function DashboardLayout() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("+254712345678");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [data, setData] = useState<EvaluationData | null>(null);
  const [error, setError] = useState("");
  const [activeStatus, setActiveStatus] = useState("");

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsEvaluating(true);
    setError("");
    setData(null);
    setActiveStatus("");

    const eventSource = new EventSource(
      `/api/evaluate/${encodeURIComponent(phoneNumber)}`,
    );

    eventSource.addEventListener("status", (event) => {
      setActiveStatus(event.data);
    });

    eventSource.addEventListener("result", (event) => {
      try {
        const payload = JSON.parse(event.data);
        setData(payload);
      } catch (err) {
        console.error("Failed to parse result payload", err);
      }
      eventSource.close();
      setIsEvaluating(false);
    });

    eventSource.addEventListener("error", (event: MessageEvent) => {
      if (event.data) {
        try {
          const errPayload = JSON.parse(event.data);
          setError(
            errPayload.error ||
              errPayload.message ||
              "Failed to evaluate farmer.",
          );
        } catch {
          setError("Failed to evaluate farmer. Stream error.");
        }
      } else {
        setError("Failed to connect to evaluation stream.");
      }
      eventSource.close();
      setIsEvaluating(false);
    });
  };

  const _handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/");
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-background px-4 md:px-8 py-8 relative">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1 tracking-tight">
                Farmer Evaluation
              </h2>
              <p className="text-muted-foreground text-sm">
                Analyze relationship-based credit risk for agricultural SACCOs.
              </p>
            </div>
          </div>

          <div className="mb-8">
            <form onSubmit={handleEvaluate} className="flex items-center gap-3">
              <div className="relative flex-1 group max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter farmer phone number (e.g., +254...)"
                  className="w-full pl-12 bg-card border border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm h-12 text-base rounded-xl transition-all"
                />
              </div>
              <Button
                type="submit"
                disabled={isEvaluating}
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl shadow-md font-medium transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Evaluating...
                  </>
                ) : (
                  "Evaluate"
                )}
              </Button>
            </form>
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="mb-8 bg-destructive/10 border-destructive/20 text-destructive shadow-sm"
            >
              <AlertDescription className="font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <Card className="shadow-sm border-border bg-card xl:col-span-2">
              <CardHeader className="pb-4 border-b border-border/50">
                <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  Trust Graph
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-100">
                  <TrustGraph graphData={data?.graph} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AgentLogPanel
              isEvaluating={isEvaluating}
              activeStatus={activeStatus}
            />
            {(!isEvaluating || data) && (
              <DecisionCard
                brief={data?.repayment_confidence_brief}
                metrics={data?.graph?.metrics}
                isLoading={isEvaluating}
              />
            )}
          </div>
        </div>
      </main>

      {/* Right Sidebar - WhatsApp Simulator */}
      <aside className="w-95 shrink-0 bg-muted/30 border-l border-border p-6 flex flex-col h-full overflow-hidden shadow-inner">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              Live Telemetry
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Farmer Communication Channel
            </p>
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <WhatsAppSimulator />
        </div>
      </aside>
    </>
  );
}
