import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import type { Database } from './supabase/database.types'

const ADMIN_ROLES = ['owner', 'admin'] as const
const STAFF_ROLES = ['owner', 'admin', 'staff'] as const

export async function requireAdmin(req: NextRequest): Promise<
  { user: { id: string }; profile: { role: string } } | NextResponse
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  })

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
  { user: { id: string }; profile: { role: string } } | NextResponse
> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: { getAll: () => [], setAll: () => {} },
  })

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
