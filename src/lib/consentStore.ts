const globalForConsent = globalThis as unknown as {
  consentedPhones: Set<string>;
};

if (!globalForConsent.consentedPhones) {
  globalForConsent.consentedPhones = new Set([
    "+254712345678",
    "+254722000111",
    "+254733222333",
  ]);
}

export const consentedPhones = globalForConsent.consentedPhones;

export function addConsent(phone: string) {
  consentedPhones.add(phone);
}

export function hasConsent(phone: string): boolean {
  return consentedPhones.has(phone);
}
