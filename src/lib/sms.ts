export async function sendSMS({
  to,
  message,
}: {
  to: string;
  message: string;
}) {
  const apiKey = process.env.AT_API_KEY;
  const username = process.env.AT_USERNAME || "sandbox";
  const shortcode = process.env.AT_SHORTCODE || "42623";

  if (!apiKey) {
    console.warn("No AT_API_KEY provided. Mocking SMS send.");
    return { success: true, mock: true, message: "Mock SMS sent successfully" };
  }

  const url = "https://api.africastalking.com/version1/messaging";

  const params = new URLSearchParams();
  params.append("username", username);
  params.append("to", to);
  params.append("message", message);
  params.append("from", shortcode);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        apiKey: apiKey,
      },
      body: params,
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error("AT API Error:", errData);
      return {
        success: false,
        error: "Failed to send SMS via Africa's Talking API",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("SMS Error:", error);
    return { success: false, error: "Network or configuration error" };
  }
}
