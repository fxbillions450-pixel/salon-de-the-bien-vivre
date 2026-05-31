import { NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { EXPERIENCE_PUBLIC_SELECT } from '@/lib/db/selects'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createAdminSupabaseClient()
    const now = new Date().toISOString()

    const { data, error } = await supabase
      .from('experiences')
      .select(EXPERIENCE_PUBLIC_SELECT)
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
