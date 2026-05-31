import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './supabase/database.types'

type ProfileRow = Database['public']['Tables']['profiles']['Row']

const ADMIN_ROLES = ['owner', 'admin'] as const
const STAFF_ROLES = ['owner', 'admin', 'staff'] as const

function getAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}

export async function requireAdmin(req: NextRequest): Promise<
  { user: { id: string }; profile: Pick<ProfileRow, 'role'> } | NextResponse
> {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supabase = getAdminClient()

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ error: 'Token invalide.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !ADMIN_ROLES.includes(profile.role as typeof ADMIN_ROLES[number])) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
  }

  return { user: { id: user.id }, profile }
}

export async function requireStaff(req: NextRequest): Promise<
  { user: { id: string }; profile: Pick<ProfileRow, 'role'> } | NextResponse
> {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supabase = getAdminClient()

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error || !user) {
    return NextResponse.json({ error: 'Token invalide.' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !STAFF_ROLES.includes(profile.role as typeof STAFF_ROLES[number])) {
    return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 })
  }

  return { user: { id: user.id }, profile }
}
