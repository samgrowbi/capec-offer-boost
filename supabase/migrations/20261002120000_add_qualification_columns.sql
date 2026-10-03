-- New qualifying questions added to the lead funnel (2026-10-02): brand ownership
-- (private label only, no resellers/wholesalers) and whether the PO/invoice being
-- funded is at least $10,000. Both now block a visitor from continuing/submitting
-- when the answer is "No", so every lead that reaches this table already answered
-- "Yes" to both -- these columns record that, they are not themselves gates.
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS owns_brand TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS po_at_least_10k TEXT;
