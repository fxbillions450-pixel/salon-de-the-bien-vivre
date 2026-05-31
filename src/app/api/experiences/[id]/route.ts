import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const paramsSchema = z.object({ id: z.string().uuid() })

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const parsed = paramsSchema.safeParse({ id })
    if (!parsed.success) {
      return NextResponse.json({ error: 'ID invalide.' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .eq('status', 'published')
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Expérience introuvable.' }, { status: 404 })
    }

    return NextResponse.json({ experience: data })
  } catch (err) {
    console.error('Experience detail error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
