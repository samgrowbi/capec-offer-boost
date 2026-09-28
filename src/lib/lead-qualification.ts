// Single source of truth for who counts as a qualified lead.
//
// The rules come from CapEc's published funding requirements (see the
// "Funding Requirements" section and the Terms): 6+ months of sales history,
// annual revenue over $100K, and a business selling in the US, Canada, UK or EU.
//
// Non-qualified leads are still saved (nothing is thrown away and the visitor sees
// the same thank-you), but they get a different lead_stage and go to a separate tab
// in the leads sheet, so they can be handled as their own funnel and kept out of
// whatever sends conversions to Meta.
//
// Rules are deliberately "fail open": only the specific non-qualifying answers below
// disqualify a lead. An unexpected or new answer value counts as qualified, so a
// wording change in the quiz can never silently drop good leads into the
// non-qualified funnel.
//
// Not used for qualifying (not asked, or not decided): platform "Other", PO size,
// private-label preference, and "existing products only".

export const QUALIFIED_STAGE = "quiz-complete";
export const NOT_QUALIFIED_STAGE = "quiz-not-qualified";

const NON_QUALIFYING = {
  revenueRange: ["Under $100K"],
  sellingHistory: ["Under 6 months"],
  businessCountry: ["Other"],
} as const;

export type QualificationInput = {
  revenueRange: string;
  sellingHistory: string;
  businessCountry: string;
};

export function evaluateQualification(a: QualificationInput): { qualified: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if ((NON_QUALIFYING.revenueRange as readonly string[]).includes(a.revenueRange)) {
    reasons.push("Revenue under $100K");
  }
  if ((NON_QUALIFYING.sellingHistory as readonly string[]).includes(a.sellingHistory)) {
    reasons.push("Selling under 6 months");
  }
  if ((NON_QUALIFYING.businessCountry as readonly string[]).includes(a.businessCountry)) {
    reasons.push("Outside US/CA/UK/EU");
  }
  return { qualified: reasons.length === 0, reasons };
}
