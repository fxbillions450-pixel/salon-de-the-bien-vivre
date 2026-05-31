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
  if (!['owner', 'admin', 'staff'].includes(profile.role)) return { error: 'Forbidden', status: 403 as const }

  return { session, profile, adminClient }
}

const updateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded', 'no_show']).optional(),
})

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data, error } = await auth.adminClient
      .from('reservations')
      .select('*, experiences(title_fr, title_en, start_time, duration_minutes)')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Réservation introuvable.' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin reservation GET error:', err)
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
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }

    const { data: existing } = await auth.adminClient
      .from('reservations')
      .select('status')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Réservation introuvable.' }, { status: 404 })
    }

    const { data, error } = await auth.adminClient
      .from('reservations')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('DB update error:', error.message)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 })
    }

    // Log to audit_logs
    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: 'UPDATE',
      table_name: 'reservations',
      record_id: id,
      old_values: { status: existing.status },
      new_values: parsed.data,
    })

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin reservation PATCH error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}