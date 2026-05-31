export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase/server'

async function checkAdminAuth() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Unauthorized', status: 401 }

  const adminClient = await createAdminSupabaseClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('role, status')
    .eq('id', session.user.id)
    .single()

  if (!profile) return { error: 'Profile not found', status: 403 }
  if (profile.status !== 'active') return { error: 'Account inactive', status: 403 }
  if (!['owner', 'admin', 'staff'].includes(profile.role)) return { error: 'Forbidden', status: 403 }

  return { session, profile, adminClient }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await checkAdminAuth()
    if ('error' in auth) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { adminClient } = auth

    const [
      reservationsResult,
      pendingInquiriesResult,
      vendorAppsResult,
      newMessagesResult,
    ] = await Promise.all([
      adminClient.from('reservations').select('status', { count: 'exact' }).gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
      adminClient.from('private_event_inquiries').select('id', { count: 'exact' }).eq('status', 'new'),
      adminClient.from('vendor_applications').select('id', { count: 'exact' }).eq('status', 'new'),
      adminClient.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'new'),
    ])

    return NextResponse.json({
      stats: {
        reservations_7d: reservationsResult.count ?? 0,
        pending_inquiries: pendingInquiriesResult.count ?? 0,
        pending_vendor_apps: vendorAppsResult.count ?? 0,
        new_messages: newMessagesResult.count ?? 0,
      },
    })
  } catch (err) {
    console.error('Admin dashboard error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}