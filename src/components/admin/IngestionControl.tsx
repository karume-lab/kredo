"use client";

import { Database, FileText, Loader2, Send, Upload } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

interface Partner {
  id: string;
  name: string;
  code: string;
  method: string;
  schedule: string;
  status: "Connected" | "Offline";
  lastRun: string;
}

const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Githunguri Dairy Farmers",
    code: "GDF-01",
    method: "SFTP Sync",
    schedule: "Daily, 11:59 PM",
    status: "Connected",
    lastRun: "2 hrs ago",
  },
  {
    id: "2",
    name: "Murang'a Coffee Coop",
    code: "MCC-04",
    method: "API Webhook",
    schedule: "Real-time",
    status: "Connected",
    lastRun: "5 mins ago",
  },
  {
    id: "3",
    name: "Nyeri Tea SACCO",
    code: "NTS-09",
    method: "Manual CSV",
    schedule: "Weekly, Friday",
    status: "Offline",
    lastRun: "3 days ago",
  },
];

interface CsvRow {
  phone: string;
  national_id: string;
  name: string;
  delivery_date: string;
  freq: string;
  revenue: string;
}

interface ValidationResult {
  row: number;
  data: Partial<CsvRow>;
  isValid: boolean;
  errors: string[];
}

export function IngestionControl() {
  const [triggerStatus, setTriggerStatus] = useState<string | null>(null);
  const [csvData, setCsvData] = useState("");
  const [validationResults, setValidationResults] = useState<
    ValidationResult[]
  >([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const simulateIngest = async (endpoint: string) => {
    setTriggerStatus(`Simulating trigger for ${endpoint}...`);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simulated: true,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setTriggerStatus(`Success [${response.status}]: ${JSON.stringify(data)}`);
    } catch (error) {
      setTriggerStatus(`Error executing ${endpoint}: ${error}`);
    }
  };

  const handleCsvParse = () => {
    setIsProcessing(true);
    setValidationResults([]);

    setTimeout(() => {
      const lines = csvData.split("\n").filter((line) => line.trim() !== "");
      const results: ValidationResult[] = [];

      // Assume first line is header if it contains 'phone'
      const startIdx = lines[0].toLowerCase().includes("phone") ? 1 : 0;

      for (let i = startIdx; i < lines.length; i++) {
        const columns = lines[i].split(",").map((col) => col.trim());
        const errors: string[] = [];

        // Expect 6 columns: phone,national_id,name,delivery_date,freq,revenue
        if (columns.length < 6) {
          errors.push("Missing columns");
        }

        const phone = columns[0] || "";
        const national_id = columns[1] || "";
        const name = columns[2] || "";
        const delivery_date = columns[3] || "";
        const freq = columns[4] || "";
        const revenue = columns[5] || "";

        // Validate E.164 phone basic (starts with +, followed by 10-15 digits)
        if (!/^\+[1-9]\d{10,14}$/.test(phone)) {
          errors.push("Invalid E.164 Phone");
        }

        if (Number.isNaN(Number(revenue))) {
          errors.push("Revenue must be numeric");
        }

        results.push({
          row: i + 1,
          data: { phone, national_id, name, delivery_date, freq, revenue },
          isValid: errors.length === 0,
          errors,
        });
      }

      setValidationResults(results);
      setIsProcessing(false);
    }, 500); // Simulate processing time
  };

  const handlePushBatch = async () => {
    const validData = validationResults
      .filter((r) => r.isValid)
      .map((r) => r.data);
    if (validData.length === 0) return;

    setTriggerStatus(
      `Pushing ${validData.length} records to /api/ingest/coop...`,
    );
    try {
      const response = await fetch("/api/ingest/coop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batch: validData }),
      });
      const data = await response.json();
      setTriggerStatus(
        `Batch Sync Complete [${response.status}]: ${JSON.stringify(data)}`,
      );
    } catch (error) {
      setTriggerStatus(`Batch Sync Error: ${error}`);
    }
  };

  const hasValidRecords = validationResults.some((r) => r.isValid);

  return (
    <div className="space-y-8">
      {/* Active Partner Registry */}
      <Card className="bg-card border-border rounded-none shadow-none">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
            <Database className="w-5 h-5" />
            Active Partner Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Cooperative Name
                </TableHead>
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Code
                </TableHead>
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Method
                </TableHead>
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Schedule
                </TableHead>
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-mono uppercase text-[10px]">
                  Last Run
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {PARTNERS.map((partner) => (
                <TableRow
                  key={partner.id}
                  className="border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {partner.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {partner.code}
                  </TableCell>
                  <TableCell className="text-sm">{partner.method}</TableCell>
                  <TableCell className="text-sm">{partner.schedule}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        partner.status === "Connected" ? "default" : "secondary"
                      }
                      className={
                        partner.status === "Connected"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-muted text-muted-foreground border-border"
                      }
                    >
                      {partner.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {partner.lastRun}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* CSV Sanitization Canvas */}
      <Card className="bg-card border-border rounded-none shadow-none">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-lg font-bold text-secondary flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Cooperative Ledger "Walk" Phase
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground font-mono uppercase mb-2 flex items-center justify-between">
                <span>Paste Raw CSV Ledger</span>
                <span>
                  Format: phone, national_id, name, delivery_date, freq, revenue
                </span>
              </div>
              <Textarea
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                placeholder="+254712345678,12345678,Wanjiku Njeri,2023-10-01,26,15000&#10;+254722000000,87654321,John Doe,2023-10-02,15,ABC"
                className="h-32 font-mono resize-y"
              />
            </div>

            <Button
              onClick={handleCsvParse}
              disabled={!csvData.trim() || isProcessing}
              variant="outline"
              className="w-full border-border hover:border-secondary hover:text-secondary bg-muted"
            >
              {isProcessing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 mr-2" />
              )}
              Validate & Parse Ledger
            </Button>

            {validationResults.length > 0 && (
              <div className="mt-6 border border-border/50 rounded-md overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border/50 text-xs font-mono uppercase text-muted-foreground">
                  Validation Audit
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50">
                        <TableHead className="w-12 text-xs">Row</TableHead>
                        <TableHead className="text-xs">Phone</TableHead>
                        <TableHead className="text-xs">Revenue</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationResults.map((result) => (
                        <TableRow key={result.row} className="border-border/50">
                          <TableCell className="text-xs text-muted-foreground">
                            {result.row}
                          </TableCell>
                          <TableCell className="text-xs font-mono">
                            {result.data.phone}
                          </TableCell>
                          <TableCell className="text-xs">
                            {result.data.revenue}
                          </TableCell>
                          <TableCell>
                            {result.isValid ? (
                              <Badge
                                variant="outline"
                                className="text-green-500 border-green-500/20 bg-green-500/10 text-[10px]"
                              >
                                Valid
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-destructive border-destructive/20 bg-destructive/10 text-[10px]"
                                title={result.errors.join(", ")}
                              >
                                Invalid: {result.errors[0]}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {hasValidRecords && (
                  <div className="p-4 bg-background border-t border-border/50">
                    <Button
                      onClick={handlePushBatch}
                      className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-medium"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Push {validationResults.filter((r) => r.isValid).length}{" "}
                      Valid Records to DB
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Simulation Hooks */}
      <Card className="bg-card border-border rounded-none shadow-none">
        <CardHeader className="pb-4 border-b border-border/50">
          <CardTitle className="text-lg font-bold text-primary">
            Pipeline Simulation Hooks
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => simulateIngest("/api/ingest/mpesa")}
              className="h-auto flex items-center justify-between p-4 border-border hover:border-primary hover:bg-transparent transition-colors text-left group rounded-none"
            >
              <div>
                <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors text-white">
                  M-PESA Webhook
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  /api/ingest/mpesa
                </div>
              </div>
              <div className="text-xs uppercase bg-primary/10 text-primary px-2 py-1">
                Trigger
              </div>
            </Button>

            <Button
              variant="outline"
              onClick={() => simulateIngest("/api/ingest/vouch")}
              className="h-auto flex items-center justify-between p-4 border-border hover:border-primary hover:bg-transparent transition-colors text-left group rounded-none"
            >
              <div>
                <div className="font-bold text-sm mb-1 group-hover:text-primary transition-colors text-white">
                  USSD Vouch Payload
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  /api/ingest/vouch
                </div>
              </div>
              <div className="text-xs uppercase bg-primary/10 text-primary px-2 py-1">
                Trigger
              </div>
            </Button>
          </div>

          {triggerStatus && (
            <div className="mt-4 p-3 bg-background border border-border font-mono text-xs text-muted-foreground break-all rounded-md">
              {">"} {triggerStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
