// src/lib/agent.ts
import OpenAI from "openai";
import type { GraphData } from "./neo4j";

export async function generateRepaymentConfidenceBrief(
  graphData: GraphData,
): Promise<string> {
  const apiKey = process.env.FEATHERLESS_API_KEY;
  if (!apiKey) {
    // Return a realistic mock brief for demo purposes
    return "Based on Kamau's high mobile money consistency (92%) and reliable digital input purchases via M-Pesa, the credit risk is assessed as low despite lacking traditional collateral. The farmer's stable dairy yields and low drought exposure further improve this assessment. This alternative data profile ensures a fairer evaluation for the farmer, recognizing their true economic reliability over restrictive land-title requirements.";
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
    
    IMPORTANT: You must explicitly mention how alternative data (e.g., mobile money consistency, climate/drought exposure, digital input purchases, seasonal income, or peer networks) affects the score. 
    Explain exactly what factors improved or weakened the assessment.
    Briefly state why this recommendation is fairer and more inclusive for smallholder farmers (like women, youth, or PWDs) than relying only on traditional land collateral.
    
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
