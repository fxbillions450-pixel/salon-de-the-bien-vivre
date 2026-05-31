-- ============================================================
-- Create first admin user for Salon de Thé Bien Vivre
--
-- HOW TO USE:
-- Option A — Supabase Dashboard:
--   1. Go to https://supabase.com/dashboard/project/kjqduijwicmmcmndithk
--   2. Authentication → Users → "Add user"
--   3. Email: nakicha@salondethebienvivre.com
--   4. Password: BienVivre2026@
--   5. Check "Auto Confirm User"
--   6. Then run the UPDATE below in SQL Editor
--
-- Option B — Run via psql after migrations:
--   (You must create the auth user via Supabase Dashboard first,
--    then run this SQL to promote to owner role)
-- ============================================================

-- After creating the auth user via Supabase Dashboard,
-- copy the user UUID from Authentication → Users and replace below:

-- Step 1: Update the auto-created profile to owner role
UPDATE public.profiles
SET
  role = 'owner',
  full_name = 'Nakicha',
  status = 'active',
  updated_at = NOW()
WHERE email = 'nakicha@salondethebienvivre.com';

-- Step 2: Verify
SELECT id, email, role, status FROM public.profiles
WHERE email = 'nakicha@salondethebienvivre.com';
