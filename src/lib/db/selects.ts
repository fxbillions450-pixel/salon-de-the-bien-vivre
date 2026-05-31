/**
 * Centralized Supabase select field lists.
 * Keeping them here means a schema mismatch surfaces in one place,
 * not scattered across every API route.
 */

/** All columns needed for the public experiences listing and detail pages. */
export const EXPERIENCE_PUBLIC_SELECT = `
  id,
  title_fr,
  title_en,
  description_fr,
  description_en,
  short_description_fr,
  short_description_en,
  category,
  start_time,
  end_time,
  duration_minutes,
  price_cents,
  currency,
  capacity,
  spots_reserved,
  spots_confirmed,
  instructor_name,
  instructor_bio_fr,
  instructor_bio_en,
  image_url,
  tags,
  location_fr,
  location_en,
  requirements_fr,
  requirements_en,
  included_fr,
  included_en,
  what_to_bring_fr,
  what_to_bring_en,
  cancellation_policy_fr,
  cancellation_policy_en,
  is_featured,
  status,
  created_at,
  updated_at
` as const

/** Minimal columns needed when embedding experiences in reservation queries. */
export const EXPERIENCE_RESERVATION_SELECT = `
  title_fr,
  title_en,
  start_time,
  duration_minutes
` as const

/** Columns for the reservation create flow — what we need to validate & charge. */
export const EXPERIENCE_BOOKING_SELECT = `
  id,
  title_fr,
  status,
  capacity,
  spots_reserved,
  spots_confirmed,
  price_cents,
  currency,
  start_time
` as const

/**
 * Canonical list of every column in the experiences table.
 * Used by schema-consistency checks and tests.
 */
export const EXPERIENCE_ALL_COLUMNS = [
  'id',
  'category',
  'title_fr',
  'title_en',
  'description_fr',
  'description_en',
  'short_description_fr',
  'short_description_en',
  'instructor_name',
  'instructor_bio_fr',
  'instructor_bio_en',
  'start_time',
  'end_time',
  'duration_minutes',
  'capacity',
  'spots_reserved',
  'spots_confirmed',
  'price_cents',
  'currency',
  'location_fr',
  'location_en',
  'image_url',
  'tags',
  'requirements_fr',
  'requirements_en',
  'included_fr',
  'included_en',
  'what_to_bring_fr',
  'what_to_bring_en',
  'cancellation_policy_fr',
  'cancellation_policy_en',
  'status',
  'is_featured',
  'created_at',
  'updated_at',
] as const

export type ExperienceColumn = typeof EXPERIENCE_ALL_COLUMNS[number]
