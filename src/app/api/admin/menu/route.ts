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

    const { data: categories, error: catError } = await auth.adminClient
      .from('menu_categories')
      .select('*, menu_items(*)')
      .order('sort_order', { ascending: true })

    if (catError) {
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ data: categories })
  } catch (err) {
    console.error('Admin menu GET error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

const createMenuItemSchema = z.object({
  category_id: z.string().uuid(),
  name_fr: z.string().min(1),
  name_en: z.string().min(1),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  price_cents: z.number().int().min(0).optional(),
  price_display: z.string().optional(),
  tags: z.array(z.string()).default([]),
  allergens: z.array(z.string()).default([]),
  is_available: z.boolean().default(true),
  is_featured: z.boolean().default(false),
  sort_order: z.number().int().default(0),
})

export async function POST(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const parsed = createMenuItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { data, error } = await auth.adminClient
      .from('menu_items')
      .insert(parsed.data)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la création.' }, { status: 500 })
    }

    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: 'CREATE',
      table_name: 'menu_items',
      record_id: data.id,
      new_values: parsed.data,
    })

    return NextResponse.json({ data }, { status: 201 })
  } catch (err) {
    console.error('Admin menu POST error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
