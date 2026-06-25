// src/lib/agent.ts
import OpenAI from "openai";
import type { GraphData } from "./neo4j";

export async function generateRepaymentConfidenceBrief(
  graphData: GraphData,
): Promise<string> {
  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey) {
    return "Repayment Confidence Brief unavailable: FEATHERLESS_API_KEY is not set.";
  }

  const baseUrl =
    process.env.FEATHERLESS_API_BASE_URL || "https://api.featherless.ai/v1";
  const modelName =
    process.env.FEATHERLESS_MODEL_NAME || "meta-llama/Meta-Llama-3-8B-Instruct";

  const client = new OpenAI({
    baseURL: baseUrl,
    apiKey: apiKey,
  });

  const prompt = `
    You are an expert Credit Risk Analyst for KREDO, a relationship-based credit risk tool for agricultural SACCOs in Kenya.
    Based on the following JSON graph facts about a farmer and their network, write a 3-sentence plain-language "Repayment Confidence Brief".
    
    Graph Data:
    ${JSON.stringify(graphData)}
    
    Output ONLY the 3-sentence brief.
  `;

  try {
    const response = await client.chat.completions.create({
      model: modelName,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
    });

    return (
      response.choices[0]?.message?.content?.trim() ||
      "Failed to generate brief."
    );
  } catch (error: unknown) {
    console.error("Error calling Featherless API:", error);
    if (error instanceof Error) {
      return `Error generating brief: ${error.message}`;
    }
    return "Error generating brief";
  }
}
