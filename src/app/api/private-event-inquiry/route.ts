import { NextRequest, NextResponse } from 'next/server'
import { privateEventInquirySchema } from '@/lib/validations'
import { rateLimit } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { sendAdminNotificationEmail } from '@/lib/email'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = await rateLimit(`private-event:${ip}`, { limit: 5, window: 1800 })
    if (!rl.success) {
      return NextResponse.json({ error: 'Trop de requêtes.' }, { status: 429 })
    }

    let body: unknown
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 })
    }

    const parsed = privateEventInquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { turnstileToken, ...data } = parsed.data
    const turnstileValid = await verifyTurnstile(turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Vérification échouée.' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()
    const { error: dbError } = await supabase.from('private_event_inquiries').insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      event_type: data.eventType,
      preferred_date: data.preferredDate,
      preferred_time: data.preferredTime,
      guest_count: data.guestCount,
      budget_range: data.budgetRange ?? null,
      food_drink_needs: data.foodDrinkNeeds ?? null,
      message: data.message ?? null,
      status: 'new',
    })

    if (dbError) {
      console.error('Private event DB error:', dbError.message)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.' }, { status: 500 })
    }

    // Send emails
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      await Promise.allSettled([
        resend.emails.send({
          from: process.env.FROM_EMAIL!,
          to: data.email,
          subject: 'Demande reçue — Salon de Thé Bien Vivre',
          html: `<div style="font-family: Georgia, serif; color: #2B2926; max-width: 600px; margin: 0 auto; background: #F7F1E8; padding: 32px;"><h2 style="color: #314D3B;">Merci pour votre demande, ${data.name}</h2><p>Nous avons reçu votre demande de location privée et vous contacterons dans les meilleurs délais.</p><p>📍 1951 Rue Saint-Zotique Est, Montréal</p></div>`,
        }),
        sendAdminNotificationEmail({
          subject: `Nouvelle demande de location privée — ${data.name}`,
          html: `<div style="font-family: sans-serif;"><h2>Nouvelle demande</h2><p><strong>Nom:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Téléphone:</strong> ${data.phone}</p><p><strong>Type d'événement:</strong> ${data.eventType}</p><p><strong>Date souhaitée:</strong> ${data.preferredDate}</p><p><strong>Heure souhaitée:</strong> ${data.preferredTime}</p><p><strong>Nombre d'invités:</strong> ${data.guestCount}</p>${data.budgetRange ? `<p><strong>Budget:</strong> ${data.budgetRange}</p>` : ''}${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}</div>`,
        }),
      ])
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Private event error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
