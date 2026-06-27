"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

export function SystemLogPanel() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      timestamp: new Date().toISOString(),
      level: "info",
      message: "Admin session initialized.",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 5000).toISOString(),
      level: "info",
      message: "Neo4j driver connection healthy.",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 15000).toISOString(),
      level: "warning",
      message: "Ingest pipeline /api/ingest/mpesa received malformed payload.",
    },
  ]);

  const handleFlush = () => {
    if (
      window.confirm(
        "WARNING: This will clear the fallback database memory cache. Proceed?",
      )
    ) {
      setLogs((prev) => [
        {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: "warning",
          message: "Fallback database flushed manually by admin.",
        },
        ...prev,
      ]);
      alert("Fallback Database Flushed (Simulated)");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary">Live Audit Stream</h2>
        <Button
          onClick={handleFlush}
          variant="outline"
          className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 hover:text-destructive text-xs uppercase tracking-wider transition-colors rounded-none"
        >
          Flush Fallback Database
        </Button>
      </div>

      <div className="border border-border bg-card overflow-hidden">
        <ScrollArea className="h-125 w-full">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10 border-b border-border">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-48 text-xs uppercase tracking-widest text-muted-foreground h-9">
                  Timestamp
                </TableHead>
                <TableHead className="w-24 text-xs uppercase tracking-widest text-muted-foreground h-9">
                  Level
                </TableHead>
                <TableHead className="text-xs uppercase tracking-widest text-muted-foreground h-9">
                  Message
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="font-mono text-sm">
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="border-border/50 hover:bg-muted"
                >
                  <TableCell className="w-48 text-muted-foreground align-top">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </TableCell>
                  <TableCell
                    className={`w-24 uppercase align-top ${
                      log.level === "error"
                        ? "text-destructive"
                        : log.level === "warning"
                          ? "text-yellow-500"
                          : "text-secondary"
                    }`}
                  >
                    [{log.level}]
                  </TableCell>
                  <TableCell className="text-primary/80">
                    {log.message}
                  </TableCell>
                </TableRow>
              ))}
              {logs.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="h-24 text-center text-muted-foreground italic"
                  >
                    No logs available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
