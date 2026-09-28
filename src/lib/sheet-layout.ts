// Maps lead fields onto the columns a Google Sheets tab actually has.
//
// The team edits the leads sheet by hand (renaming, deleting and adding columns), so rows must never
// be written by fixed position: one moved or deleted column would silently put values under the wrong
// heading (for example a UTM source under "Qualified"). Instead we read the tab's header row and place
// each value under the header whose name matches.
//
// Rules:
//  - A header we recognise gets its value. A header we don't recognise is left blank.
//  - We never re-create a column the team deleted, with one exception: "Qualified" is required for
//    the qualified / not-qualified funnel, so it is added on the right if it's missing.
//  - A brand-new empty tab (e.g. the first non-qualified lead) gets the full default header row.
//  - If the header row can't be read, fall back to the standard 16-column layout the sheet uses today.

export type ColumnKey =
  | "created_at"
  | "source_slug"
  | "lead_stage"
  | "full_name"
  | "brand_name"
  | "email"
  | "phone"
  | "online_store_url"
  | "platform"
  | "revenue_range"
  | "selling_history"
  | "po_amount_range"
  | "business_country"
  | "additional_notes"
  | "offer"
  | "qualified"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "qualification_notes";

// Default order and header labels. The first 16 match the team's current sheet exactly.
export const COLUMNS: readonly (readonly [ColumnKey, string])[] = [
  ["created_at", "Submitted At"],
  ["source_slug", "Source"],
  ["lead_stage", "Stage"],
  ["full_name", "Full Name"],
  ["brand_name", "Business Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["online_store_url", "Store URL"],
  ["platform", "Platform"],
  ["revenue_range", "Revenue"],
  ["selling_history", "Selling History"],
  ["po_amount_range", "PO Amount"],
  ["business_country", "Country"],
  ["additional_notes", "Notes"],
  ["offer", "Offer"],
  ["qualified", "Qualified"],
  ["utm_source", "UTM Source"],
  ["utm_medium", "UTM Medium"],
  ["utm_campaign", "UTM Campaign"],
  ["qualification_notes", "Qualification Notes"],
];

const CORE_COLUMN_COUNT = 16; // through "Qualified"

export type HeaderWrite = { startCol: number; labels: string[] }; // startCol is 1-based (A = 1)
export type LayoutPlan = { layout: (ColumnKey | null)[]; write: HeaderWrite | null };

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

// 1 -> A, 26 -> Z, 27 -> AA
export function colLetter(n: number): string {
  let s = "";
  let x = n;
  while (x > 0) {
    const r = (x - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}

// `existing` is the tab's header row, or null if it couldn't be read.
export function planLayout(existing: string[] | null): LayoutPlan {
  if (existing === null) {
    return { layout: COLUMNS.slice(0, CORE_COLUMN_COUNT).map(([k]) => k), write: null };
  }
  if (existing.every((c) => !norm(c))) {
    return { layout: COLUMNS.map(([k]) => k), write: { startCol: 1, labels: COLUMNS.map(([, l]) => l) } };
  }
  const byLabel = new Map<string, ColumnKey>(COLUMNS.map(([k, l]) => [norm(l), k]));
  const seen = new Set<ColumnKey>();
  const layout = existing.map((cell) => {
    const key = byLabel.get(norm(cell));
    if (!key || seen.has(key)) return null; // unknown or duplicate header: leave blank
    seen.add(key);
    return key;
  });
  if (!seen.has("qualified")) {
    layout.push("qualified");
    return { layout, write: { startCol: existing.length + 1, labels: ["Qualified"] } };
  }
  return { layout, write: null };
}

export function rowFor(layout: (ColumnKey | null)[], values: Partial<Record<ColumnKey, string | null | undefined>>): string[] {
  return layout.map((key) => (key ? (values[key] ?? "") : ""));
}
