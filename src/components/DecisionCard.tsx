import { ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DecisionCard({
  brief,
  isLoading,
}: {
  brief?: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </CardContent>
      </Card>
    );
  }

  if (!brief) {
    return (
      <Card className="min-h-[160px] flex items-center justify-center text-gray-400">
        Search for a farmer to see the Repayment Confidence Brief.
      </Card>
    );
  }

  // Simple heuristic
  const isPositive =
    !brief.toLowerCase().includes("unavailable") &&
    !brief.toLowerCase().includes("error");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        {isPositive ? (
          <ShieldCheck className="w-6 h-6 text-green-500" />
        ) : (
          <ShieldAlert className="w-6 h-6 text-amber-500" />
        )}
        <CardTitle className="text-lg">Repayment Confidence Brief</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700 leading-relaxed text-sm md:text-base bg-blue-50/50 p-4 rounded-lg border border-blue-100">
          {brief}
        </div>
      </CardContent>
    </Card>
  );
}
