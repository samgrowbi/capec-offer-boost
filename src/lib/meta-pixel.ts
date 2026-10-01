// Meta Pixel (browser only).
// Consent route chosen by the client: no banner. The pixel loads for visitors
// outside consent-required regions and stays off in consent-required regions
// or when the visitor's region cannot be determined.
import { trackingAllowed } from "@/lib/tracking-consent";

const PIXEL_ID = "624600358549348";

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

async function start(): Promise<boolean> {
  if (!(await trackingAllowed())) return false;
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
