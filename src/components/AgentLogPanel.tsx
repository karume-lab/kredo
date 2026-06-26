"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PIPELINE_STEPS = [
  "[Ingestion Agent] Reading external transaction ledgers & verifying identity...",
  "[Consent Check] Verifying SMS opt-in status and consent log...",
  "[Scoring Agent] Traversing Neo4j community paths and social collateral...",
  "[Explanation Agent] Distilling query pathways into Featherless (Llama-3-8B)...",
];

export default function AgentLogPanel({
  isEvaluating,
}: {
  isEvaluating: boolean;
}) {
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (isEvaluating) {
      setActiveStep(0);

      const timeouts = [
        setTimeout(() => setActiveStep(1), 800),
        setTimeout(() => setActiveStep(2), 1600),
        setTimeout(() => setActiveStep(3), 2600),
        setTimeout(() => setActiveStep(4), 4000), // All done
      ];

      return () => {
        timeouts.forEach(clearTimeout);
      };
    } else {
      // If evaluating finished, make sure all are checked or reset if data cleared
      setActiveStep(-1);
    }
  }, [isEvaluating]);

  if (!isEvaluating && activeStep === -1) {
    return null;
  }

  return (
    <Card className="w-full bg-slate-950 text-slate-50 border-slate-800 shadow-inner font-mono text-xs sm:text-sm">
      <CardHeader className="pb-2 border-b border-slate-800 bg-slate-900/50">
        <CardTitle className="flex items-center gap-2 text-slate-300 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Multi-Agent Pipeline Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-3 min-h-40">
        {PIPELINE_STEPS.map((step, index) => {
          const isCompleted = activeStep > index;
          const isActive = activeStep === index && isEvaluating;
          const isPending = activeStep < index;

          return (
            <div
              key={step}
              className={`flex items-start gap-3 transition-opacity duration-300 ${
                isPending ? "opacity-30" : "opacity-100"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700" />
                )}
              </div>
              <span
                className={`leading-relaxed ${
                  isCompleted
                    ? "text-slate-400"
                    : isActive
                      ? "text-sky-100"
                      : "text-slate-600"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
