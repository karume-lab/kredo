export async function classifyIntent(
  text: string,
): Promise<"SCORE" | "IMPROVE" | "YES" | "UNKNOWN"> {
  const apiKey = process.env.FEATHERLESS_API_KEY;
  const baseUrl = process.env.FEATHERLESS_API_BASE_URL;
  const model = process.env.FEATHERLESS_MODEL_NAME;

  if (!apiKey || !baseUrl || !model) {
    console.warn(
      "Featherless LLM not fully configured. Falling back to keyword matching.",
    );
    return fallbackMatch(text);
  }

  const prompt = `You are an intent classification engine for a loan cooperative (KREDO).
Classify the user's input into exactly one of the following intents:
- SCORE: The user wants to know their trust score, credit score, or current standing.
- IMPROVE: The user wants to know how to improve their score, get a higher limit, or increase their loan.
- YES: The user is agreeing, consenting, saying yes, or confirming they want to proceed.
- UNKNOWN: The input does not match any of the above.

User Input: "${text}"

Respond with ONLY the exact intent name (SCORE, IMPROVE, YES, or UNKNOWN). Do not add punctuation or explanation.`;

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`Featherless API error: ${response.status} ${errText}`);
      throw new Error(`Featherless API error: ${response.statusText}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim()?.toUpperCase();

    // The model might output something like "Intent: SCORE" if it fails instruction following, but typically with these models a strict prompt is enough.
    // We'll parse it safely.
    if (result) {
      if (result.includes("SCORE")) return "SCORE";
      if (result.includes("IMPROVE")) return "IMPROVE";
      if (result.includes("YES")) return "YES";
    }

    return "UNKNOWN";
  } catch (error) {
    console.error("NLP classification error:", error);
    return fallbackMatch(text);
  }
}

function fallbackMatch(text: string): "SCORE" | "IMPROVE" | "YES" | "UNKNOWN" {
  const upper = text.toUpperCase();
  if (upper.includes("SCORE")) return "SCORE";
  if (upper.includes("IMPROVE") || upper.includes("INCREASE")) return "IMPROVE";
  if (upper === "YES" || upper === "OK" || upper === "SURE") return "YES";
  return "UNKNOWN";
}
