// Dial code shown next to the phone field, based on the business-country question that's already
// answered earlier in both forms. Only covers countries with a single, unambiguous calling code.
//
// "European Union" and "Other" are deliberately left out: the EU isn't one calling code (France is
// +33, Germany is +49, and so on for 27 different countries), so there's no single correct prefix to
// show. Those two fall back to a plain phone input with no forced prefix in the UI below.
export const COUNTRY_DIAL_CODES: Record<string, string> = {
  "United States": "+1",
  Canada: "+1",
  "United Kingdom": "+44",
};

/** The dial code for a business-country answer, or null if there isn't a single correct one. */
export function dialCodeFor(country: string): string | null {
  return COUNTRY_DIAL_CODES[country] ?? null;
}

/** Digits only, capped at 10 — what the phone input accepts as the visitor types. */
export function toPhoneDigits(raw: string): string {
  return raw.replace(/\D/g, "").slice(0, 10);
}

/** The 10 digits plus whatever dial code applies, for what gets submitted/stored. */
export function formatPhoneForSubmit(digits: string, dialCode: string | null): string {
  return dialCode ? `${dialCode} ${digits}` : digits;
}
