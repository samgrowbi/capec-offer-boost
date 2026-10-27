// Works out whether a visitor came from Facebook/Instagram (Meta) ads or Google, for the
// "Lead Source" column in the leads sheet.
//
// The answer is taken from the page the visitor first lands on (first touch) and kept for the rest
// of the browser session, so it isn't lost when they move from page to page before submitting.
// captureTrafficSource() runs once in __root.tsx on every page load; getTrafficSource() is read at
// submit time.
//
// Signals, in order of reliability:
//  1. Ad click IDs added automatically by the ad platform: fbclid (Meta), gclid / gbraid / wbraid (Google).
//  2. utm_source set on the ad URL (e.g. facebook, fb, ig, instagram, meta / google, adwords).
//  3. The referring site (facebook.com, instagram.com, google.*).
// Anything else is "Other" (or "Direct" when there's no referrer at all).

export type TrafficSource = "Facebook" | "Google" | "Other" | "Direct";

const STORAGE_KEY = "capec_traffic_source";

const FB_UTM = /^(facebook|fb|ig|instagram|meta|messenger|an|audience_network)$/i;
const GOOGLE_UTM = /^(google|adwords|googleads|google_ads|youtube|gdn)$/i;

export function detectTrafficSource(search: string, referrer: string): TrafficSource {
  const params = new URLSearchParams(search);
  if (params.get("fbclid")) return "Facebook";
  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) return "Google";

  const utm = (params.get("utm_source") ?? "").trim();
  if (utm) {
    if (FB_UTM.test(utm)) return "Facebook";
    if (GOOGLE_UTM.test(utm)) return "Google";
    return "Other";
  }

  if (!referrer) return "Direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "Other";
  }
  if (/(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|messenger\.com)$/.test(host))
    return "Facebook";
  if (/(^|\.)google\.[a-z.]+$/.test(host) || /(^|\.)youtube\.com$/.test(host)) return "Google";
  // Internal navigation between our own pages isn't a source.
  if (typeof window !== "undefined" && host === window.location.hostname) return "Direct";
  return "Other";
}

function read(): TrafficSource | null {
  try {
    return (window.sessionStorage.getItem(STORAGE_KEY) as TrafficSource | null) ?? null;
  } catch {
    return null;
  }
}

export function captureTrafficSource(): void {
  if (typeof window === "undefined") return;
  const now = detectTrafficSource(window.location.search, document.referrer);
  const stored = read();
  // Keep the first touch, but let a real ad signal replace a weaker "Direct"/"Other" guess.
  if (
    stored &&
    !((stored === "Direct" || stored === "Other") && (now === "Facebook" || now === "Google"))
  )
    return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, now);
  } catch {
    // Storage blocked (private mode etc.) — getTrafficSource() falls back to the current URL.
  }
}

export function getTrafficSource(): TrafficSource {
  if (typeof window === "undefined") return "Direct";
  return read() ?? detectTrafficSource(window.location.search, document.referrer);
}
