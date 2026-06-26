import { ShieldAlert, ShieldCheck } from "lucide-react";

export default function DecisionCard({
  brief,
  isLoading,
}: {
  brief?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="bg-card text-card-foreground border border-border p-6 rounded-xl w-full animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-6 bg-muted rounded w-1/4"></div>
        </div>
        <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-4/5"></div>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="bg-card border border-border p-6 rounded-xl w-full min-h-40 flex items-center justify-center text-muted-foreground">
        Search for a farmer to see the Repayment Confidence Brief.
      </div>
    );
  }

  // Simple heuristic for risk level
  const isPositive =
    !brief.toLowerCase().includes("unavailable") &&
    !brief.toLowerCase().includes("error") &&
    !brief.toLowerCase().includes("high risk");

  return (
    <div className="bg-card text-card-foreground border border-border p-6 rounded-xl w-full">
      <div className="flex items-center justify-between mb-4">
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
          <span className="bg-secondary/15 text-secondary text-xs font-medium px-2.5 py-1 rounded-full border border-secondary/20">
            Low Risk Network
          </span>
        ) : (
          <span className="bg-destructive/15 text-destructive text-xs font-medium px-2.5 py-1 rounded-full border border-destructive/20">
            High Risk Network
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold tracking-tight mb-2">
        Farmer Assessment
      </h3>

      <p className="text-muted-foreground text-sm leading-relaxed mb-2">
        {brief}
      </p>
    </div>
  );
}
