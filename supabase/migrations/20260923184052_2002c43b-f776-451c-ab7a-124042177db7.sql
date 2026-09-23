ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS business_country text;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS additional_notes text;