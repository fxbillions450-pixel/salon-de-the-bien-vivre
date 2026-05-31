import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createAdminSupabaseClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('experiences')
      .select(`
        id, title_fr, title_en, description_fr, description_en,
        category, start_time, end_time, duration_minutes,
        price_cents, currency, capacity, spots_reserved, spots_confirmed,
        instructor_name, image_url, status,
        what_to_bring_fr, what_to_bring_en,
        cancellation_policy_fr, cancellation_policy_en
      `)
      .eq('status', 'published')
      .gte('start_time', now)
      .order('start_time', { ascending: true })

    if (error) {
      console.error('Experiences fetch error:', error.message)
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ experiences: data ?? [] })
  } catch (err) {
    console.error('Experiences route error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
