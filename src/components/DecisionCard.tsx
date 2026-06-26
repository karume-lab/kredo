"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DecisionCard({
  brief,
  isLoading,
  metrics,
}: {
  brief?: string;
  isLoading: boolean;
  metrics?: {
    cooperative: string;
    guarantors: string;
    cashFlow: string;
  };
}) {
  const [isAuditExpanded, setIsAuditExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-6 w-1/4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-3/4 mb-4 mt-2" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card className="w-full min-h-40 flex items-center justify-center text-muted-foreground p-6">
        Search for a farmer to see the Repayment Confidence Brief.
      </Card>
    );
  }

  // Simple heuristic for risk level
  const isPositive =
    !brief.toLowerCase().includes("unavailable") &&
    !brief.toLowerCase().includes("error") &&
    !brief.toLowerCase().includes("high risk");

  const handleCopySMS = async () => {
    const cooperativeRaw = metrics?.cooperative ?? "";
    const coopName = cooperativeRaw.includes(" -")
      ? cooperativeRaw.split(" -")[0]
      : cooperativeRaw || "No Active Cooperative Linked";

    const guarantorsRaw = metrics?.guarantors ?? "";
    const guarantors = guarantorsRaw.includes(" ")
      ? guarantorsRaw.split(" ")[0]
      : guarantorsRaw || "0";

    const smsText = `KREDO: Farmer approved for financing. Underwritten via ${coopName} & ${guarantors} peer backers.`;

    try {
      await navigator.clipboard.writeText(smsText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Card className="w-full flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          {/* Accent Color applied safely to technical metrics */}
          {isPositive ? (
            <ShieldCheck className="text-primary w-5 h-5" />
          ) : (
            <ShieldAlert className="text-destructive w-5 h-5" />
          )}
          <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Kredo Trust Metric
          </span>
        </div>

        {/* Secondary/Destructive applied as a badge background variant */}
        {isPositive ? (
          <Badge
            variant="outline"
            className="bg-secondary/15 text-secondary border-secondary/20 px-2.5 py-1"
          >
            Low Risk Network
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-destructive/15 text-destructive border-destructive/20 px-2.5 py-1"
          >
            High Risk Network
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight mb-2">
            Farmer Assessment
          </CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {brief}
          </p>
        </div>

        {/* Audit Graph Data Panel */}
        {metrics && (
          <div className="border border-border rounded-lg overflow-hidden bg-slate-50/50 dark:bg-slate-900/20">
            <button
              type="button"
              onClick={() => setIsAuditExpanded(!isAuditExpanded)}
              className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className="text-foreground">Audit Graph Data</span>
              {isAuditExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {isAuditExpanded && (
              <div className="p-4 border-t border-border grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">
                    Cooperative Stability
                  </span>
                  <span className="font-medium text-right text-foreground">
                    {metrics.cooperative}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">
                    Peer Guarantor Trust Network
                  </span>
                  <span className="font-medium text-right text-foreground">
                    {metrics.guarantors}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Estimated Cash Flow
                  </span>
                  <span className="font-medium text-right text-foreground">
                    {metrics.cashFlow}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2 pb-6 border-t border-border mt-auto">
        <Button
          onClick={handleCopySMS}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 py-6 text-primary hover:text-primary hover:bg-primary/5 transition-all relative"
        >
          {isCopied ? (
            <>
              <Check className="w-5 h-5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Copied to clipboard!
              </span>
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Copy Text Brief for SMS</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
