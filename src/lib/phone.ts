export function formatToE164(phone: string): string {
  if (!phone) return "";

  // Remove all non-numeric characters except the leading '+'
  let cleaned = phone.replace(/[^\d+]/g, "");

  // If it starts with 0 (e.g., 0712345678, 0112345678)
  if (cleaned.startsWith("0")) {
    cleaned = `+254${cleaned.slice(1)}`;
  }
  // If it starts with 254 without the plus
  else if (cleaned.startsWith("254")) {
    cleaned = `+${cleaned}`;
  }
  // If it doesn't start with + and isn't 0 or 254 (assuming standard international)
  else if (!cleaned.startsWith("+")) {
    // We could default to +254 or just prepend +
    // Since it's a Kenyan context, if someone enters "712345678", we probably want +254
    if (cleaned.length === 9) {
      cleaned = `+254${cleaned}`;
    } else {
      cleaned = `+${cleaned}`;
    }
  }

  return cleaned;
}
