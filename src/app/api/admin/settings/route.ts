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
  if (!['owner', 'admin'].includes(profile.role)) return { error: 'Forbidden', status: 403 as const }

  return { session, profile, adminClient }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { data, error } = await auth.adminClient
      .from('settings')
      .select('*')
      .order('key', { ascending: true })

    if (error) {
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin settings GET error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}

const updateSettingSchema = z.object({
  key: z.string().min(1),
  value: z.record(z.unknown()),
})

export async function PUT(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const parsed = updateSettingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }

    const { data: existing } = await auth.adminClient
      .from('settings')
      .select('*')
      .eq('key', parsed.data.key)
      .single()

    let data, error
    if (existing) {
      ;({ data, error } = await auth.adminClient
        .from('settings')
        .update({ value: parsed.data.value, updated_by: auth.session.user.id, updated_at: new Date().toISOString() })
        .eq('key', parsed.data.key)
        .select()
        .single())
    } else {
      ;({ data, error } = await auth.adminClient
        .from('settings')
        .insert({ key: parsed.data.key, value: parsed.data.value, updated_by: auth.session.user.id })
        .select()
        .single())
    }

    if (error) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour.' }, { status: 500 })
    }

    await auth.adminClient.from('audit_logs').insert({
      user_id: auth.session.user.id,
      action: existing ? 'UPDATE' : 'CREATE',
      table_name: 'settings',
      record_id: parsed.data.key,
      old_values: existing ? { value: existing.value } : null,
      new_values: { value: parsed.data.value },
    })

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Admin settings PUT error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}