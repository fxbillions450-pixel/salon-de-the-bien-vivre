-- Migration: 004_add_missing_experience_columns
-- Adds columns that the application code selects but were absent from
-- the initial schema. Safe to re-run (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

ALTER TABLE public.experiences
  ADD COLUMN IF NOT EXISTS what_to_bring_fr         TEXT,
  ADD COLUMN IF NOT EXISTS what_to_bring_en         TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_policy_fr   TEXT,
  ADD COLUMN IF NOT EXISTS cancellation_policy_en   TEXT;

COMMENT ON COLUMN public.experiences.what_to_bring_fr IS 'What participants should bring (French)';
COMMENT ON COLUMN public.experiences.what_to_bring_en IS 'What participants should bring (English)';
COMMENT ON COLUMN public.experiences.cancellation_policy_fr IS 'Cancellation policy text (French)';
COMMENT ON COLUMN public.experiences.cancellation_policy_en IS 'Cancellation policy text (English)';
