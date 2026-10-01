// Shared by every analytics/tracking script that needs consent gating (Meta Pixel, Clarity, ...).
// One /cdn-cgi/trace fetch, memoized, so adding another tracker doesn't add another network round trip.

// EEA plus the UK and Switzerland, the regions that require consent before advertising/analytics
// tags load.
export const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

let regionPromise: Promise<string | null> | null = null;

async function fetchRegion(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch("/cdn-cgi/trace", { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) return null;
    const match = /(?:^|\n)loc=([A-Za-z0-9]{2,})/.exec(await res.text());
    return match?.[1]?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

/** Two-letter region code for the visitor, or null if it couldn't be determined. Fetched once per page load. */
export function readRegion(): Promise<string | null> {
  regionPromise ??= fetchRegion();
  return regionPromise;
}

/** True if a consent-gated tracking script is allowed to load for this visitor. */
export async function trackingAllowed(): Promise<boolean> {
  const loc = await readRegion();
  // Unknown region or Tor exit: keep tracking off.
  if (!loc || loc === "T1" || CONSENT_REGIONS.has(loc)) return false;
  return true;
}
