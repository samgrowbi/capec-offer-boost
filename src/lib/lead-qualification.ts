// Shared qualification rules for CapEc's lead funnel (hero/bottom quiz card + /quiz).
//
// Per the client (updated 2026-10-03): every visitor completes the full form and is captured as a
// lead either way — qualification no longer blocks progress mid-funnel. Instead, the full answer
// set is checked once at submission, and that result decides which of two outcomes the visitor
// gets: the /thank-you page (qualified) or the /not-qualified page (not qualified), each a distinct
// URL so the client can set up a Meta conversion rule that only counts the qualified one. It also
// decides which Google Sheet tab the lead is written to (Sheet1 vs NonQualified), so the two
// populations don't get mixed together in the sheet.
//
// A single source of truth here, imported by both quiz components and the sheet-sync function, so a
// future threshold change can't update one form and miss the other.
//
// Not enforced by this form, flagged rather than silently skipped:
//  - The specific SKU being funded needs 3-6 months of its own sales history (no new launches /
//    new SKU variations). We only gate on how long the BUSINESS has been selling, not the SKU.
//  - Funding must be for a specific inventory PO/supplier invoice, not general working capital.
//    Implicit in the product itself; not a separate self-report question.
//  - No long list of existing UCC filings. Not something a visitor can reliably self-report;
//    needs the team's own review after submission.

export type QualificationInput = {
  platform: string;
  revenueRange: string;
  sellingHistory: string;
  ownsBrand: string;
  poAtLeast10k: string;
  businessCountry: string;
};

export type QualificationField = keyof QualificationInput;

// Written to the lead's lead_stage field, and used by the sheet-sync function to pick which tab a
// lead is written to (see leads-sheet.functions.ts).
export const QUALIFIED_STAGE = "quiz-complete";
export const NOT_QUALIFIED_STAGE = "quiz-not-qualified";

// The exact answer values (from each quiz's own option lists) that disqualify a lead.
const DISQUALIFYING: { [K in QualificationField]: readonly string[] } = {
  platform: ["Other"], // must sell on Amazon, Shopify, or both
  revenueRange: ["Under $100K"], // annual revenue must exceed $100,000
  sellingHistory: ["Under 6 months", "6 – 12 months"], // must be selling for at least 1 year
  ownsBrand: ["No"], // private label only; no resellers or wholesalers
  poAtLeast10k: ["No"], // PO/invoice must be at least $10,000
  businessCountry: ["Other"], // must sell into US, Canada, UK, or EU (can be registered anywhere)
};

/** True if this single answer, on its own, disqualifies the lead. A building block for
 * evaluateQualification below; not used to block progress mid-funnel anymore. */
export function isDisqualifyingAnswer(field: QualificationField, value: string): boolean {
  return DISQUALIFYING[field].includes(value);
}

export type QualificationResult = { qualified: boolean; reasons: string[] };

/** Full-answer-set check, run once at submission to decide which outcome (thank-you vs
 * not-qualified) and which sheet tab a lead gets. */
export function evaluateQualification(input: Partial<QualificationInput>): QualificationResult {
  const reasons: string[] = [];
  (Object.keys(DISQUALIFYING) as QualificationField[]).forEach((field) => {
    const value = input[field];
    if (value && isDisqualifyingAnswer(field, value)) reasons.push(field);
  });
  return { qualified: reasons.length === 0, reasons };
}

/** Shown on the /not-qualified page. Deliberately a single summary of all criteria, not the specific
 * rule(s) this lead tripped, so it reads as informational rather than as a hint to resubmit with
 * different answers to get through. */
export const NOT_QUALIFIED_MESSAGE =
  "Based on your answers, CapEc isn't a fit for this purchase order right now. We currently fund " +
  "private-label e-commerce brands (no resellers or wholesalers) selling on Amazon or Shopify into " +
  "the US, Canada, UK, or EU, with at least $100,000 in annual revenue, at least 1 year of sales " +
  "history, and a purchase order or supplier invoice of $10,000 or more.";
