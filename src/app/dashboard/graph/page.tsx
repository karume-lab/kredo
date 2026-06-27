import { Database, Network, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export default function GraphDatabasePage() {
  return (
    <main className="flex-1 overflow-y-auto bg-background px-4 md:px-8 py-8 relative w-full h-full flex flex-col">
      <div className="max-w-7xl mx-auto w-full space-y-6 flex-1 flex flex-col">
        <div className="flex flex-col gap-2 shrink-0">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Graph Database Terminal
          </h2>
          <p className="text-muted-foreground">
            Direct Cypher query interface for the Neo4j agricultural trust
            network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
          {/* Query Editor */}
          <Card className="shadow-sm flex flex-col border-border bg-card lg:col-span-1 h-full max-h-150">
            <CardHeader className="pb-4 border-b border-border/50 shrink-0">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Cypher Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex-1 flex flex-col gap-4">
              <Textarea
                className="flex-1 font-mono text-sm resize-none bg-slate-950 text-slate-50 border-slate-800 focus-visible:ring-primary p-4"
                placeholder="MATCH (f:Farmer)-[r:DELIVERED_TO]->(c:Cooperative) RETURN f, r, c LIMIT 25"
                defaultValue="MATCH (f:Farmer)-[r:DELIVERED_TO]->(c:Cooperative)&#10;RETURN f, r, c&#10;LIMIT 25"
              />
              <Button className="w-full gap-2" size="lg">
                <Play className="w-4 h-4" />
                Execute Query
              </Button>
            </CardContent>
          </Card>

          {/* Visualization Area */}
          <Card className="shadow-sm border-border bg-card lg:col-span-2 h-full min-h-125 flex flex-col">
            <CardHeader className="pb-4 border-b border-border/50 shrink-0 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                Network Visualization
              </CardTitle>
              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md font-mono">
                Nodes: 0 | Relationships: 0
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative bg-muted/10 flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--border)_1px,transparent_1px)] bg-size-[20px_20px] opacity-20"></div>
              <div className="flex flex-col items-center justify-center text-muted-foreground z-10 p-6 text-center">
                <Network className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-medium text-foreground">
                  Awaiting Query Execution
                </p>
                <p className="text-sm mt-1 max-w-sm">
                  Run a Cypher query to visualize the entity network and
                  relationship edges.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
