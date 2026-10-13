// Forwards every captured lead to the client's Zapier catch hook so their Zap can
// pick it up. Fire-and-forget: no-cors means we can't read the response, and a
// failure here must never block the visitor's success state (the lead is already
// safe in the database).
const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/17539231/41hcz9y/";

export function sendLeadToZapier(lead: Record<string, unknown>): void {
  void fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    mode: "no-cors",
    body: JSON.stringify({
      ...lead,
      submitted_at: new Date().toISOString(),
      triggered_from: window.location.origin,
    }),
  }).catch(() => {});
}
