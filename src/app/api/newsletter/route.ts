import { NextRequest, NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { createAdminSupabaseClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = await rateLimit(`newsletter:${ip}`, { limit: 3, window: 600 })
    if (!rl.success) {
      return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 })
    }

    let body: unknown
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 })
    }

    const parsed = newsletterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { turnstileToken, ...data } = parsed.data
    const turnstileValid = await verifyTurnstile(turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Vérification échouée.' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()

    // Check if already subscribed
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id, status')
      .eq('email', data.email)
      .single()

    if (existing) {
      if (existing.status === 'active') {
        return NextResponse.json({ success: true, message: 'Déjà inscrit.' })
      }
      // Reactivate
      await supabase
        .from('newsletter_subscribers')
        .update({ status: 'active', unsubscribed_at: null })
        .eq('id', existing.id)
      return NextResponse.json({ success: true })
    }

    const { error: dbError } = await supabase.from('newsletter_subscribers').insert({
      email: data.email,
      first_name: data.firstName ?? null,
      consent_given_at: new Date().toISOString(),
      status: 'active',
    })

    if (dbError) {
      console.error('Newsletter DB error:', dbError.message)
      return NextResponse.json({ error: 'Erreur lors de l\'inscription.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Newsletter route error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
