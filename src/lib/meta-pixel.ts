// Meta Pixel (browser only).
// Consent route chosen by the client: no banner. The pixel loads for visitors
// outside consent-required regions and stays off in consent-required regions
// or when the visitor's region cannot be determined.
const PIXEL_ID = "624600358549348";

// EEA plus the UK and Switzerland, the regions that require consent before
// advertising tags load.
const CONSENT_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: unknown;
  }
}

let initPromise: Promise<boolean> | null = null;

async function readRegion(): Promise<string | null> {
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

async function start(): Promise<boolean> {
  const loc = await readRegion();
  // Unknown region or Tor exit: keep the pixel off.
  if (!loc || loc === "T1" || CONSENT_REGIONS.has(loc)) return false;
  loadPixel();
  return true;
}

function loadPixel(): void {
  if (typeof window === "undefined" || window.fbq) return;
  const n = function (this: Fbq, ...args: unknown[]) {
    if (n.callMethod) {
      n.callMethod.apply(n, args);
    } else {
      n.queue!.push(args);
    }
  } as Fbq;
  n.push = n;
  n.loaded = true;
  n.version = "2.0";
  n.queue = [];
  window.fbq = n;
  window._fbq = n;
  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(script);
  window.fbq("init", PIXEL_ID);
  window.fbq("track", "PageView");
}

/** Call once per page load, from the browser. Safe to call repeatedly. */
export function initMetaPixel(): void {
  if (typeof window === "undefined") return;
  initPromise ??= start();
}

/** Fires a Lead event once the pixel has loaded; no-op if it stayed off. */
export async function trackMetaLead(): Promise<void> {
  if (typeof window === "undefined") return;
  initPromise ??= start();
  if (await initPromise) window.fbq?.("track", "Lead");
}
