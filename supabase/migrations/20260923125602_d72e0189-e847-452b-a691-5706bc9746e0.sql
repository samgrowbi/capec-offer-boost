ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS selling_history text,
  ADD COLUMN IF NOT EXISTS po_amount_range text,
  ADD COLUMN IF NOT EXISTS full_name text,
  ADD COLUMN IF NOT EXISTS lead_stage text;