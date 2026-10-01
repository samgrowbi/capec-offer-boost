// Microsoft Clarity (browser only) — heatmaps and session recordings.
// Same consent route as the Meta Pixel: no banner, loads for visitors outside
// consent-required regions, stays off in consent-required regions or when the
// visitor's region can't be determined. Session recordings are at least as
// privacy-sensitive as a conversion pixel, so this follows the same gate
// rather than loading unconditionally.
import { trackingAllowed } from "@/lib/tracking-consent";

const PROJECT_ID = "yqx6y1s6t1";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

let initPromise: Promise<boolean> | null = null;

async function start(): Promise<boolean> {
  if (!(await trackingAllowed())) return false;
  loadClarity();
  return true;
}

function loadClarity(): void {
  if (typeof window === "undefined" || window.clarity) return;
  const c = function (this: ClarityFn, ...args: unknown[]) {
    (c.q ??= []).push(args);
  } as ClarityFn;
  window.clarity = c;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.clarity.ms/tag/${PROJECT_ID}`;
  document.head.appendChild(script);
}

/** Call once per page load, from the browser. Safe to call repeatedly. */
export function initClarity(): void {
  if (typeof window === "undefined") return;
  initPromise ??= start();
}
