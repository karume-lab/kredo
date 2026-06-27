import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalyticsPage() {
  return (
    <main className="flex-1 overflow-y-auto bg-background px-4 md:px-8 py-8 relative w-full">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Portfolio Analytics
          </h2>
          <p className="text-muted-foreground">
            Overview of relationship-based credit health and risk exposure.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total Credit Exposure
              </CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 12,450,000</div>
              <p className="text-xs text-muted-foreground mt-1">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Active Borrowers
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground mt-1">
                +180 new this week
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Yield Optimization
              </CardTitle>
              <CreditCard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12.5%</div>
              <p className="text-xs text-muted-foreground mt-1">
                +2% from base rate
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                System Health
              </CardTitle>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Optimal</div>
              <p className="text-xs text-muted-foreground mt-1">
                99.9% uptime on ingest
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 shadow-sm h-96 flex flex-col items-center justify-center bg-muted/20 border-dashed">
            <p className="text-muted-foreground text-sm font-medium">
              Credit Yield Trajectory Chart
            </p>
            <span className="text-xs text-muted-foreground/60">
              (Visualization coming soon)
            </span>
          </Card>
          <Card className="col-span-3 shadow-sm h-96 flex flex-col items-center justify-center bg-muted/20 border-dashed">
            <p className="text-muted-foreground text-sm font-medium">
              Risk Distribution
            </p>
            <span className="text-xs text-muted-foreground/60">
              (Visualization coming soon)
            </span>
          </Card>
        </div>
      </div>
    </main>
  );
}
