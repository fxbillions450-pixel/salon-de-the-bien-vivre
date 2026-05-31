-- ============================================================
-- Salon de Thé Bien Vivre — Seed Data
-- ============================================================

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('hours', '{"monday": "Fermé", "tuesday": "10h–18h", "wednesday": "10h–18h", "thursday": "10h–18h", "friday": "10h–20h", "saturday": "10h–20h", "sunday": "11h–17h"}'),
  ('contact', '{"phone": "[Téléphone à configurer]", "email": "[Email à configurer]", "address": "1951 Rue Saint-Zotique Est, Montréal, QC"}'),
  ('social', '{"instagram": "#", "facebook": "#"}'),
  ('alert_bar', '{"enabled": true, "message_fr": "Bienvenue chez Bien Vivre — consultez nos ateliers et réservations.", "message_en": "Welcome to Bien Vivre — explore our workshops and reservations."}'),
  ('cancellation_policy', '{"fr": "[Politique d''annulation à définir par l''administrateur]", "en": "[Cancellation policy to be defined by administrator]"}'),
  ('tax_rate', '{"rate": 0, "enabled": false}')
ON CONFLICT (key) DO NOTHING;

-- Menu categories
INSERT INTO menu_categories (name_fr, name_en, sort_order, is_active) VALUES
  ('Thés & Infusions', 'Teas & Infusions', 1, true),
  ('Matcha & Café', 'Matcha & Coffee', 2, true),
  ('Jus frais', 'Fresh Juices', 3, true),
  ('Repas végétaliens', 'Vegan Meals', 4, true),
  ('Pâtisseries', 'Pastries', 5, true),
  ('Tisanes', 'Herbal Teas', 6, true),
  ('Produits saisonniers', 'Seasonal Products', 7, true),
  ('Boissons spéciales', 'Special Drinks', 8, true)
ON CONFLICT DO NOTHING;
