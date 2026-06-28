import { NextResponse } from "next/server";
import { generateRepaymentConfidenceBrief } from "@/lib/agent";
import { hasConsent } from "@/lib/consentStore";
import { getConnection } from "@/lib/neo4j";
import { sendSMS } from "@/lib/sms";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ phone: string }> },
) {
  try {
    const rawPhone = (await params).phone;

    // Parameter Sanitization
    const decodedPhone = decodeURIComponent(rawPhone);
    const phone = decodedPhone.replace(/[\s\-()]/g, "");

    const stream = new ReadableStream({
      async start(controller) {
        const sendEvent = (event: string, data: string) => {
          controller.enqueue(
            new TextEncoder().encode(`event: ${event}\ndata: ${data}\n\n`),
          );
        };

        try {
          // 1. Identity lookup phase
          sendEvent("status", "Ingestion");
          // Visual telemetry pause (simulating latency for demo purposes if needed, otherwise rely on real latency)
          await new Promise((r) => setTimeout(r, 600));

          // 2. Consent validation
          sendEvent("status", "Consent");

          if (!hasConsent(phone)) {
            // Dispatch the consent SMS
            try {
              await sendSMS({
                to: phone,
                message:
                  "KREDO: A loan officer is requesting to evaluate your credit limit. Reply 'YES' to consent to this evaluation.",
              });
            } catch (smsError) {
              console.error("Failed to send consent SMS:", smsError);
            }

            sendEvent(
              "error",
              JSON.stringify({
                error: "Consent Pending",
                message:
                  "Farmer has not replied 'YES' to the SMS opt-in request. Vetting cannot proceed without explicit consent under the Kenya Data Protection Act (2019). A consent request SMS has been sent.",
              }),
            );
            controller.close();
            return;
          }
          await new Promise((r) => setTimeout(r, 600));

          // 3. Scoring (Neo4j Cypher query execution)
          sendEvent("status", "Scoring");
          const db = getConnection();
          const graphData = await db.getGraphData(phone);
          await db.close();
          await new Promise((r) => setTimeout(r, 600));

          // 4. Explanation (Featherless API call)
          sendEvent("status", "Explanation");
          const brief = await generateRepaymentConfidenceBrief(graphData);

          // Final response map
          const payload = {
            phone_number: phone,
            graph: graphData,
            repayment_confidence_brief: brief,
          };
          sendEvent("result", JSON.stringify(payload));

          controller.close();
        } catch (error: unknown) {
          console.error("API Evaluation Streaming Error:", error);
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error";
          sendEvent("error", JSON.stringify({ error: errorMsg }));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("API Evaluation Outer Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
