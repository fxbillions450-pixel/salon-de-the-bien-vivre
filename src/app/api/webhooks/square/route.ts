import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { verifySquareWebhookSignature } from '@/lib/square'
import { sendReservationConfirmedEmail, sendAdminNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  let rawBody: string
  try {
    rawBody = await req.text()
  } catch {
    return NextResponse.json({ error: 'Cannot read body.' }, { status: 400 })
  }

  const signature = req.headers.get('x-square-hmacsha256-signature') ?? ''
  const webhookUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/square`

  const isValid = verifySquareWebhookSignature({ body: rawBody, signature, webhookUrl })
  if (!isValid) {
    console.warn('Invalid Square webhook signature')
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  let event: Record<string, unknown>
  try {
    event = JSON.parse(rawBody) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 })
  }

  const providerEventId = event['event_id'] as string | undefined
  const eventType = event['type'] as string | undefined

  if (!providerEventId) {
    return NextResponse.json({ ok: true })
  }

  const supabase = await createAdminSupabaseClient()

  // Idempotency check
  const { data: existing } = await supabase
    .from('webhook_events')
    .select('id')
    .eq('provider_event_id', providerEventId)
    .single()

  if (existing) {
    return NextResponse.json({ ok: true, message: 'Already processed.' })
  }

  // Log webhook event
  await supabase.from('webhook_events').insert({
    provider: 'square',
    event_type: eventType ?? 'unknown',
    provider_event_id: providerEventId,
    payload: event,
    signature_valid: true,
    processed_at: new Date().toISOString(),
  })

  // Process payment completion
  if (eventType === 'payment.updated' || eventType === 'payment.created') {
    const data = event['data'] as Record<string, unknown> | undefined
    const obj = data?.['object'] as Record<string, unknown> | undefined
    const paymentObj = obj?.['payment'] as Record<string, unknown> | undefined

    if (paymentObj?.['status'] === 'COMPLETED') {
      const paymentId = paymentObj['id'] as string
      const referenceId = paymentObj['reference_id'] as string | undefined

      if (referenceId) {
        // Find reservation by ID (referenceId = reservationId)
        const { data: reservation } = await supabase
          .from('reservations')
          .select('*, experiences(title_fr, start_time, spots_reserved, spots_confirmed)')
          .eq('id', referenceId)
          .single()

        if (reservation && reservation.status !== 'confirmed') {
          // Confirm reservation
          await supabase.from('reservations').update({
            status: 'confirmed',
            payment_status: 'paid',
            square_payment_id: paymentId,
          }).eq('id', referenceId)

          // Update spots: move from reserved to confirmed
          const exp = reservation.experiences as {
            title_fr: string
            start_time: string
            spots_reserved: number
            spots_confirmed: number
          } | null

          if (exp) {
            await supabase.from('experiences').update({
              spots_reserved: Math.max(0, (exp.spots_reserved ?? 0) - reservation.quantity),
              spots_confirmed: (exp.spots_confirmed ?? 0) + reservation.quantity,
            }).eq('id', reservation.experience_id)
          }

          // Send confirmation emails
          await Promise.allSettled([
            sendReservationConfirmedEmail({
              to: reservation.customer_email,
              firstName: reservation.customer_first_name,
              experienceTitle: exp?.title_fr ?? 'Expérience',
              startTime: exp?.start_time ?? '',
              quantity: reservation.quantity,
              amountCents: reservation.amount_cents,
              reservationId: referenceId,
            }),
            sendAdminNotificationEmail({
              subject: `Réservation confirmée — ${exp?.title_fr ?? 'Expérience'}`,
              html: `<p>Réservation <strong>${referenceId.slice(0, 8).toUpperCase()}</strong> confirmée.</p><p>${reservation.customer_first_name} ${reservation.customer_last_name} — ${reservation.customer_email}</p><p>${reservation.quantity} place(s)</p>`,
            }),
          ])
        }
      }
    }
  }

  return NextResponse.json({ ok: true })
}
