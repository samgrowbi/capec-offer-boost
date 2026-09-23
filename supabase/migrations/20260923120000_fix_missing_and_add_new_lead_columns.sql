-- Fix: these columns were already being written by the /quiz submission code
-- (submitLead in src/routes/quiz.tsx) but were never migrated in, so every
-- quiz completion has been failing at insert time with "column does not exist".
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS selling_history TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS po_amount_range TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS lead_stage TEXT;

-- New: business country (captured in the quiz's business-name step) and an
-- optional free-text note (captured in the final contact step).
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_country TEXT;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS additional_notes TEXT;
