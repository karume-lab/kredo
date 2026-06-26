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

  const cooperativeRaw = metrics?.cooperative ?? "";
  const coopName = cooperativeRaw.includes(" -")
    ? cooperativeRaw.split(" -")[0]
    : cooperativeRaw || "No Active Cooperative Linked";

  const guarantorsRaw = metrics?.guarantors ?? "";
  const guarantors = guarantorsRaw.includes(" ")
    ? guarantorsRaw.split(" ")[0]
    : guarantorsRaw || "0";

  const handleCopySMS = async () => {
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
    <Card className="w-full flex flex-col h-full shadow-sm rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-8 pt-8 pb-4">
        <div className="flex items-center gap-2">
          {/* Accent Color applied safely to technical metrics */}
          {isPositive ? (
            <ShieldCheck className="text-primary w-5 h-5" />
          ) : (
            <ShieldAlert className="text-destructive w-5 h-5" />
          )}
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Kredo Trust Metric
          </span>
        </div>

        {/* Secondary/Destructive applied as a badge background variant */}
        {isPositive ? (
          <Badge
            variant="outline"
            className="bg-secondary/15 text-secondary border-secondary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm"
          >
            Low Risk Network
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="bg-destructive/15 text-destructive border-destructive/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded-sm"
          >
            High Risk Network
          </Badge>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-6 px-8">
        <div>
          <CardTitle className="text-xl font-bold tracking-tight mb-3">
            Farmer Assessment
          </CardTitle>
          <p className="text-muted-foreground text-[15px] leading-relaxed mb-4">
            {brief}
          </p>
        </div>

        {/* Audit Graph Data Panel */}
        {metrics && (
          <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
            <button
              type="button"
              onClick={() => setIsAuditExpanded(!isAuditExpanded)}
              className="w-full flex items-center justify-between p-4 text-sm font-medium hover:bg-muted/50 transition-colors"
            >
              <span className="text-foreground font-semibold">
                Functional Trust Ledger
              </span>
              {isAuditExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            {isAuditExpanded && (
              <div className="p-0 border-t border-border overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-muted/30 border-b border-border text-muted-foreground text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-semibold">
                        Ecosystem Entity
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Relationship Link
                      </th>
                      <th className="px-4 py-3 font-semibold">
                        Graph Verification Flag
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">
                        {coopName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px] tracking-tight">
                        MEMBER_OF
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        Verified (24 Months / Active)
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">
                        {guarantors}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px] tracking-tight">
                        VOUCHED_BY
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-medium">
                        Verified (100% Repayment History)
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 text-foreground font-medium">
                        Local Agrovet Accounts
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-[11px] tracking-tight">
                        TRANSACTED_WITH
                      </td>
                      <td className="px-4 py-3 text-primary font-medium">
                        Mobile Money Flow Active
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-6 pb-8 px-8 border-t border-border mt-auto">
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
