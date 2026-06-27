"use client";

import { GraphTelemetry } from "@/components/admin/GraphTelemetry";
import { IngestionControl } from "@/components/admin/IngestionControl";
import { SystemLogPanel } from "@/components/admin/SystemLogPanel";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-primary p-8 font-mono">
      <header className="mb-8 border-b border-border pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">
            KREDO Admin Console
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            System Diagnostics & Control Panel
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge
            variant="outline"
            className="bg-green-900/30 text-secondary border-green-900 rounded-full px-2.5 py-0.5 text-xs font-medium"
          >
            SYSTEM ONLINE
          </Badge>
        </div>
      </header>

      <Tabs defaultValue="telemetry" className="w-full">
        <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none p-0 mb-8 h-auto space-x-1">
          <TabsTrigger
            value="telemetry"
            className="rounded-none px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary transition-colors hover:text-primary hover:border-border"
          >
            Graph Telemetry
          </TabsTrigger>
          <TabsTrigger
            value="ingestion"
            className="rounded-none px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary transition-colors hover:text-primary hover:border-border"
          >
            Data Ingestion
          </TabsTrigger>
          <TabsTrigger
            value="logs"
            className="rounded-none px-4 py-3 text-sm font-medium border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none text-muted-foreground data-[state=active]:text-primary transition-colors hover:text-primary hover:border-border"
          >
            System Logs
          </TabsTrigger>
        </TabsList>

        <main>
          <TabsContent value="telemetry" className="mt-0">
            <GraphTelemetry />
          </TabsContent>
          <TabsContent value="ingestion" className="mt-0">
            <IngestionControl />
          </TabsContent>
          <TabsContent value="logs" className="mt-0">
            <SystemLogPanel />
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
