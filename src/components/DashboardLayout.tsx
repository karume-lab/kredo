"use client";

import axios, { isAxiosError } from "axios";
import { Loader2, Search } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { GraphData } from "@/lib/neo4j";
import AgentLogPanel from "./AgentLogPanel";
import DecisionCard from "./DecisionCard";
import SiteLogo from "./SiteLogo";

const TrustGraph = dynamic(() => import("./TrustGraph"), {
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
  const [phoneNumber, setPhoneNumber] = useState("+254712345678");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [data, setData] = useState<EvaluationData | null>(null);
  const [error, setError] = useState("");

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsEvaluating(true);
    setError("");

    try {
      const response = await axios.get(
        `/api/evaluate/${encodeURIComponent(phoneNumber)}`,
      );
      setData(response.data);
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        setError(
          err.response?.data?.error ||
            "Failed to evaluate farmer. Please check the backend connection.",
        );
      } else {
        setError("Failed to evaluate farmer.");
      }
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SiteLogo className="rounded" />
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              KREDO
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Farmer Evaluation
          </h2>
          <p className="text-muted-foreground">
            Analyze relationship-based credit risk for agricultural SACCOs.
          </p>
        </div>

        {/* Session Header Badge Context */}
        <div className="mb-6 flex items-center bg-card border border-border rounded-lg px-4 py-2.5 w-fit text-sm text-muted-foreground shadow-sm">
          <span className="font-medium text-foreground mr-2">SACCO:</span>{" "}
          Kiambu Rural Credit Unit
          <span className="mx-3 text-border">|</span>
          <span className="font-medium text-foreground mr-2">Officer:</span>{" "}
          Wanjiku Njeri
          <span className="mx-3 text-border">|</span>
          <span className="font-medium text-foreground mr-2">System Node:</span>{" "}
          Node-04-AuraDB
        </div>

        <div className="mb-8 max-w-2xl">
          <form onSubmit={handleEvaluate} className="flex items-center gap-3">
            <div className="relative flex-1 group">
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-xl shadow-sm font-medium"
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
            className="mb-8 bg-destructive/10 border-destructive/20 text-destructive"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-foreground">
                  Trust Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TrustGraph graphData={data?.graph} />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <AgentLogPanel isEvaluating={isEvaluating} />
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
    </div>
  );
}
