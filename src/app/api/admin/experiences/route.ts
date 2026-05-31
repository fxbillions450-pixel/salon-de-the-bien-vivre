export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

async function checkAdminAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Unauthorized', status: 401 as const }

  const adminClient = await createAdminSupabaseClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, status, id')
    .eq('id', session.user.id)
    .single()

  if (!profile) return { error: 'Profile not found', status: 403 as const }
  if (profile.status !== 'active') return { error: 'Account inactive', status: 403 as const }
  if (!['owner', 'admin', 'content_editor'].includes(profile.role)) return { error: 'Forbidden', status: 403 as const }

  return { session, profile, adminClient }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = 20
    const offset = (page - 1) * limit

    const { data, error, count } = await auth.adminClient
      .from('experiences')
      .select('*', { count: 'exact' })
      .order('start_time', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ data, count, page, limit })
  } catch (err) {
    console.error('Admin experiences GET error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

const createExperienceSchema = z.object({
  category: z.string().min(1),
  title_fr: z.string().min(1),
  title_en: z.string().min(1),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  duration_minutes: z.number().int().positive(),
  capacity: z.number().int().positive(),
  price_cents: z.number().int().min(0),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
  is_featured: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const parsed = createExperienceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { data, error } = await auth.adminClient
      .from('experiences')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      console.error('DB insert error:', error.message)
      return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 })
    }

    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: 'CREATE',
      table_name: 'experiences',
      record_id: data.id,
      new_values: parsed.data,
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('Admin experiences POST error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}