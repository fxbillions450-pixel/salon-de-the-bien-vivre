import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'

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

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = 50
    const offset = (page - 1) * limit

    const { data, error, count } = await auth.adminClient
      .from('audit_logs')
      .select('*, profiles(full_name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ data, count, page, limit })
  } catch (err) {
    console.error('Admin audit logs GET error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
