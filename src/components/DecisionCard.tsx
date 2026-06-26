import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DecisionCard({
  brief,
  isLoading,
}: {
  brief?: string;
  isLoading: boolean;
}) {
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

  return (
    <Card className="w-full">
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

      <CardContent>
        <CardTitle className="text-xl font-bold tracking-tight mb-2">
          Farmer Assessment
        </CardTitle>
        <p className="text-muted-foreground text-sm leading-relaxed mb-2">
          {brief}
        </p>
      </CardContent>
    </Card>
  );
}
