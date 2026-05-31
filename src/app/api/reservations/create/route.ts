import { NextRequest, NextResponse } from 'next/server'
import { reservationCreateSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { createSquarePayment } from '@/lib/square'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

    // Rate limit by IP
    const ipRl = await rateLimit(`reservation:ip:${ip}`, { limit: 5, window: 900 })
    if (!ipRl.success) {
      return NextResponse.json({ error: 'Trop de tentatives. Veuillez réessayer dans 15 minutes.' }, { status: 429 })
    }

    let body: unknown
    try { body = await req.json() } catch {
      return NextResponse.json({ error: 'Corps invalide.' }, { status: 400 })
    }

    const parsed = reservationCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { turnstileToken, sourceId, ...data } = parsed.data

    // Rate limit by email
    const emailRl = await rateLimit(`reservation:email:${data.email}`, { limit: 3, window: 900 })
    if (!emailRl.success) {
      return NextResponse.json({ error: 'Trop de tentatives pour cette adresse courriel.' }, { status: 429 })
    }

    const turnstileValid = await verifyTurnstile(turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Vérification de sécurité échouée.' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()

    // Fetch experience
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id, title_fr, status, capacity, spots_reserved, spots_confirmed, price_cents, currency, start_time')
      .eq('id', data.experienceId)
      .single()

    if (expError || !experience) {
      return NextResponse.json({ error: 'Expérience introuvable.' }, { status: 404 })
    }

    if (experience.status !== 'published') {
      return NextResponse.json({ error: 'Cette expérience n\'est plus disponible.' }, { status: 400 })
    }

    const spotsRemaining = experience.capacity - experience.spots_reserved - experience.spots_confirmed
    if (spotsRemaining < data.quantity) {
      return NextResponse.json({ error: `Seulement ${spotsRemaining} place(s) disponible(s).` }, { status: 409 })
    }

    const amountCents = experience.price_cents * data.quantity
    const idempotencyKey = randomUUID()
    const reservationId = randomUUID()

    // Create pending reservation first
    const { error: resError } = await supabase.from('reservations').insert({
      id: reservationId,
      experience_id: data.experienceId,
      customer_first_name: data.firstName,
      customer_last_name: data.lastName,
      customer_email: data.email,
      customer_phone: data.phone,
      quantity: data.quantity,
      notes: data.notes ?? null,
      consent_terms: true,
      status: 'pending',
      payment_status: 'pending',
      amount_cents: amountCents,
      currency: experience.currency ?? 'CAD',
    })

    if (resError) {
      console.error('Reservation insert error:', resError.message)
      return NextResponse.json({ error: 'Erreur lors de la création de la réservation.' }, { status: 500 })
    }

    // Reserve spots
    const { error: updateError } = await supabase
      .from('experiences')
      .update({ spots_reserved: experience.spots_reserved + data.quantity })
      .eq('id', data.experienceId)

    if (updateError) {
      console.error('Spots update error:', updateError.message)
    }

    // Create Square payment
    let payment
    try {
      payment = await createSquarePayment({
        sourceId,
        amountCents,
        currency: experience.currency ?? 'CAD',
        idempotencyKey,
        note: `Réservation — ${experience.title_fr}`,
        referenceId: reservationId,
      })
    } catch (squareErr: unknown) {
      console.error('Square payment error:', squareErr)
      // Roll back spots
      await supabase
        .from('experiences')
        .update({ spots_reserved: experience.spots_reserved })
        .eq('id', data.experienceId)
      await supabase
        .from('reservations')
        .update({ status: 'expired', payment_status: 'failed' })
        .eq('id', reservationId)
      return NextResponse.json({ error: 'Erreur lors du traitement du paiement.' }, { status: 502 })
    }

    // Update reservation with Square payment ID
    await supabase.from('reservations').update({
      square_payment_id: payment?.id ?? null,
      payment_status: 'pending',
    }).eq('id', reservationId)

    return NextResponse.json({
      success: true,
      reservationId,
      paymentId: payment?.id,
      status: payment?.status,
    })
  } catch (err) {
    console.error('Reservation create error:', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
