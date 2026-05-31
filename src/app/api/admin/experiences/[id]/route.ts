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

const updateSchema = z.object({
  title_fr: z.string().min(1).optional(),
  title_en: z.string().min(1).optional(),
  description_fr: z.string().optional(),
  description_en: z.string().optional(),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).optional(),
  capacity: z.number().int().positive().optional(),
  price_cents: z.number().int().min(0).optional(),
  is_featured: z.boolean().optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data, error } = await auth.adminClient
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Expérience introuvable.' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin experience GET error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { data: existing } = await auth.adminClient
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Expérience introuvable.' }, { status: 404 })
    }

    const { data, error } = await auth.adminClient
      .from('experiences')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 })
    }

    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: 'UPDATE',
      table_name: 'experiences',
      record_id: id,
      old_values: existing,
      new_values: parsed.data,
    })

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin experience PATCH error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    if (!['owner', 'admin'].includes(auth.profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await auth.adminClient
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la suppression.' }, { status: 500 })
    }

    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: 'DELETE',
      table_name: 'experiences',
      record_id: id,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Admin experience DELETE error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}