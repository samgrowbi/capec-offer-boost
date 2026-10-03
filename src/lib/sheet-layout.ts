// Maps lead fields onto the columns a Google Sheets tab actually has.
//
// The team edits the leads sheet by hand (renaming, deleting and adding columns), so rows must never
// be written by fixed position: a single moved, deleted, or inserted column silently puts values under
// the wrong heading. This happened for real: "Qualified" is the sheet's 16th column, but an older
// version of this code assumed the 16th column was "UTM Source" and wrote UTM values there instead.
// When two new fields (owns_brand, po_at_least_10k) were added by fixed position after that, they
// landed on top of the real "Qualified" column and one further column with no header at all — the
// Qualified cell silently showed the owns_brand answer rather than a real qualified flag (it "looked"
// right only because every lead that reaches submission already answered Yes to owns_brand by
// definition). Reading the header row and placing each value under the header with the matching name
// avoids this however the team reorders, renames, or adds columns.
//
// Rules:
//  - A header we recognise gets its value. A header we don't recognise is left blank.
//  - We never re-create a column the team deleted.
//  - A field we know about but the sheet has no header for yet (e.g. a newly added question) gets its
//    header appended on the right, once, the first time it's needed.
//  - A brand-new empty tab gets the full default header row.
//  - If the header row can't be read, fall back to the sheet's known layout as of 2026-10-03.

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
  | "owns_brand"
  | "po_at_least_10k"
  | "utm_source"
  | "utm_medium"
  | "utm_campaign"
  | "qualification_notes";

// Default order and header labels, for a brand-new empty tab. "Qualified" is deliberately last among
// the qualification-related columns (per request, 2026-10-03): Owns Brand and PO At Least $10K come
// right after the other qualifying-question answers, with Qualified — the overall pass/fail flag —
// appearing after them as a summary column rather than in between the raw answers.
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
  ["owns_brand", "Owns Brand"],
  ["po_at_least_10k", "PO At Least $10K"],
  ["qualified", "Qualified"],
  ["utm_source", "UTM Source"],
  ["utm_medium", "UTM Medium"],
  ["utm_campaign", "UTM Campaign"],
  ["qualification_notes", "Qualification Notes"],
];

// Through "Qualified" in the order above. The real sheet's physical column positions don't have to
// match this (matching is by header name, not position — see planLayout), but this is still used as
// the fallback layout when the header row can't be read at all.
const CORE_COLUMN_COUNT = 18;

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

// Fields we add a header for on the right if the sheet doesn't have one yet, in the order they were
// introduced. "qualified" isn't here: the real sheet already has it, and a sheet that doesn't should
// get it from the default full header (empty-tab case), not appended as an afterthought.
const AUTO_ADD_IF_MISSING: readonly ColumnKey[] = ["owns_brand", "po_at_least_10k"];

// `existing` is the tab's header row, or null if it couldn't be read.
export function planLayout(existing: string[] | null): LayoutPlan {
  if (existing === null) {
    return { layout: COLUMNS.slice(0, CORE_COLUMN_COUNT).map(([k]) => k), write: null };
  }
  if (existing.every((c) => !norm(c))) {
    return { layout: COLUMNS.map(([k]) => k), write: { startCol: 1, labels: COLUMNS.map(([, l]) => l) } };
  }
  const byLabel = new Map<string, ColumnKey>(COLUMNS.map(([k, l]) => [norm(l), k]));
  const labelFor = new Map<ColumnKey, string>(COLUMNS.map(([k, l]) => [k, l]));
  const seen = new Set<ColumnKey>();
  const layout = existing.map((cell) => {
    const key = byLabel.get(norm(cell));
    if (!key || seen.has(key)) return null; // unknown or duplicate header: leave blank
    seen.add(key);
    return key;
  });
  const missing = AUTO_ADD_IF_MISSING.filter((k) => !seen.has(k));
  if (missing.length > 0) {
    layout.push(...missing);
    return { layout, write: { startCol: existing.length + 1, labels: missing.map((k) => labelFor.get(k)!) } };
  }
  return { layout, write: null };
}

export function rowFor(layout: (ColumnKey | null)[], values: Partial<Record<ColumnKey, string | null | undefined>>): string[] {
  return layout.map((key) => (key ? (values[key] ?? "") : ""));
}
