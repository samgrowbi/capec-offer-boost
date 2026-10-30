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

// Lead deduplication: the same Lead is also sent server-side (Zapier -> Meta Conversions API).
// Meta only merges the two when both carry the same event ID, so each submitted lead gets one ID,
// sent to Zapier as `event_id` and to the pixel as `eventID`. The Zap's Conversions API step must
// map the `event_id` field to "Event ID" (with event name "Lead").
const LEAD_EVENT_ID_KEY = "capec_lead_event_id";
let pendingLeadEventId: string | null = null;

/** Creates the event ID for a new lead and keeps it for the pixel Lead on /thank-you. */
export function createLeadEventId(): string {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  pendingLeadEventId = id;
  try {
    sessionStorage.setItem(LEAD_EVENT_ID_KEY, id);
  } catch {
    /* storage blocked; the in-memory copy still covers client-side navigation */
  }
  return id;
}

function takeLeadEventId(): string | null {
  let id = pendingLeadEventId;
  try {
    id ??= sessionStorage.getItem(LEAD_EVENT_ID_KEY);
    sessionStorage.removeItem(LEAD_EVENT_ID_KEY);
  } catch {
    /* ignore */
  }
  pendingLeadEventId = null;
  return id;
}

/**
 * Fires a Lead event once the pixel has loaded; no-op if it stayed off.
 * Uses the event ID from createLeadEventId() so Meta can dedupe it against the server Lead.
 * Without a pending ID (e.g. a direct visit or refresh of /thank-you) nothing fires, since there
 * is no matching lead and the event would only be a duplicate or a false conversion.
 */
export async function trackMetaLead(eventId?: string): Promise<void> {
  if (typeof window === "undefined") return;
  const id = eventId ?? takeLeadEventId();
  if (!id) return;
  initPromise ??= start();
  if (await initPromise) window.fbq?.("track", "Lead", {}, { eventID: id });
}
