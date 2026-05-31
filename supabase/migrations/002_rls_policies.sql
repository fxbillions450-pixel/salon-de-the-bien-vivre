-- ============================================================
-- Salon de Thé Bien Vivre — RLS Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE private_event_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limit_events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- HELPER FUNCTION: Get current user role
-- ============================================================
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin')
    AND status = 'active'
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_staff()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin', 'staff')
    AND status = 'active'
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_content_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role IN ('owner', 'admin', 'content_editor')
    AND status = 'active'
  )
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================================
-- PROFILES
-- ============================================================
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Staff can view all profiles" ON profiles;
CREATE POLICY "Staff can view all profiles"
  ON profiles FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR ALL
  USING (is_admin());

-- ============================================================
-- SETTINGS
-- ============================================================
DROP POLICY IF EXISTS "Public can read public settings" ON settings;
CREATE POLICY "Public can read public settings"
  ON settings FOR SELECT
  USING (key LIKE 'site.%' OR key LIKE 'public.%');

DROP POLICY IF EXISTS "Admins can manage all settings" ON settings;
CREATE POLICY "Admins can manage all settings"
  ON settings FOR ALL
  USING (is_admin());

-- ============================================================
-- MENU CATEGORIES
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view active menu categories" ON menu_categories;
CREATE POLICY "Anyone can view active menu categories"
  ON menu_categories FOR SELECT
  USING (is_active = TRUE);

DROP POLICY IF EXISTS "Admins can view all menu categories" ON menu_categories;
CREATE POLICY "Admins can view all menu categories"
  ON menu_categories FOR SELECT
  USING (is_content_editor());

DROP POLICY IF EXISTS "Content editors can manage menu categories" ON menu_categories;
CREATE POLICY "Content editors can manage menu categories"
  ON menu_categories FOR ALL
  USING (is_content_editor());

-- ============================================================
-- MENU ITEMS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view available menu items" ON menu_items;
CREATE POLICY "Anyone can view available menu items"
  ON menu_items FOR SELECT
  USING (is_available = TRUE);

DROP POLICY IF EXISTS "Content editors can manage menu items" ON menu_items;
CREATE POLICY "Content editors can manage menu items"
  ON menu_items FOR ALL
  USING (is_content_editor());

-- ============================================================
-- EXPERIENCES
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view published experiences" ON experiences;
CREATE POLICY "Anyone can view published experiences"
  ON experiences FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Staff can view all experiences" ON experiences;
CREATE POLICY "Staff can view all experiences"
  ON experiences FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Content editors can manage experiences" ON experiences;
CREATE POLICY "Content editors can manage experiences"
  ON experiences FOR ALL
  USING (is_content_editor());

-- ============================================================
-- RESERVATIONS
-- ============================================================
-- Note: Insertions are handled server-side only (service role)
DROP POLICY IF EXISTS "Users can view their own reservations" ON reservations;
CREATE POLICY "Users can view their own reservations"
  ON reservations FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Staff can view all reservations" ON reservations;
CREATE POLICY "Staff can view all reservations"
  ON reservations FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Staff can update reservations" ON reservations;
CREATE POLICY "Staff can update reservations"
  ON reservations FOR UPDATE
  USING (is_staff());

-- ============================================================
-- PRIVATE EVENT INQUIRIES
-- ============================================================
-- Insertions via service role only
DROP POLICY IF EXISTS "Staff can view private event inquiries" ON private_event_inquiries;
CREATE POLICY "Staff can view private event inquiries"
  ON private_event_inquiries FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Staff can update private event inquiries" ON private_event_inquiries;
CREATE POLICY "Staff can update private event inquiries"
  ON private_event_inquiries FOR UPDATE
  USING (is_staff());

-- ============================================================
-- VENDOR APPLICATIONS
-- ============================================================
DROP POLICY IF EXISTS "Staff can view vendor applications" ON vendor_applications;
CREATE POLICY "Staff can view vendor applications"
  ON vendor_applications FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Staff can update vendor applications" ON vendor_applications;
CREATE POLICY "Staff can update vendor applications"
  ON vendor_applications FOR UPDATE
  USING (is_staff());

-- ============================================================
-- CONTACT MESSAGES
-- ============================================================
DROP POLICY IF EXISTS "Staff can view contact messages" ON contact_messages;
CREATE POLICY "Staff can view contact messages"
  ON contact_messages FOR SELECT
  USING (is_staff());

DROP POLICY IF EXISTS "Staff can update contact messages" ON contact_messages;
CREATE POLICY "Staff can update contact messages"
  ON contact_messages FOR UPDATE
  USING (is_staff());

-- ============================================================
-- NEWSLETTER SUBSCRIBERS
-- ============================================================
DROP POLICY IF EXISTS "Admins can manage newsletter subscribers" ON newsletter_subscribers;
CREATE POLICY "Admins can manage newsletter subscribers"
  ON newsletter_subscribers FOR ALL
  USING (is_admin());

-- ============================================================
-- BLOG POSTS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Content editors can manage blog posts" ON blog_posts;
CREATE POLICY "Content editors can manage blog posts"
  ON blog_posts FOR ALL
  USING (is_content_editor());

-- ============================================================
-- MEDIA ASSETS
-- ============================================================
DROP POLICY IF EXISTS "Anyone can view media assets" ON media_assets;
CREATE POLICY "Anyone can view media assets"
  ON media_assets FOR SELECT
  TO anon, authenticated
  USING (TRUE);

DROP POLICY IF EXISTS "Content editors can manage media assets" ON media_assets;
CREATE POLICY "Content editors can manage media assets"
  ON media_assets FOR ALL
  USING (is_content_editor());

-- ============================================================
-- AUDIT LOGS
-- ============================================================
DROP POLICY IF EXISTS "Admins can view audit logs" ON audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (is_admin());

-- ============================================================
-- WEBHOOK EVENTS
-- ============================================================
DROP POLICY IF EXISTS "Admins can view webhook events" ON webhook_events;
CREATE POLICY "Admins can view webhook events"
  ON webhook_events FOR SELECT
  USING (is_admin());

-- ============================================================
-- RATE LIMIT EVENTS
-- ============================================================
DROP POLICY IF EXISTS "Admins can view rate limit events" ON rate_limit_events;
CREATE POLICY "Admins can view rate limit events"
  ON rate_limit_events FOR SELECT
  USING (is_admin());
