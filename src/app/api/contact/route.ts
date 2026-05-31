import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { sendContactConfirmationEmail, sendAdminNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = await rateLimit(`contact:${ip}`, { limit: 5, window: 600 })
    if (!rl.success) {
      return NextResponse.json({ error: 'Trop de requêtes. Veuillez réessayer plus tard.' }, { status: 429 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
    }

    const parsed = contactFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
    }

    const { turnstileToken, ...data } = parsed.data
    const turnstileValid = await verifyTurnstile(turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json({ error: 'Vérification de sécurité échouée. Veuillez réessayer.' }, { status: 400 })
    }

    const supabase = await createAdminSupabaseClient()
    const { error: dbError } = await supabase.from('contact_messages').insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      category: data.category,
      message: data.message,
      status: 'new',
    })

    if (dbError) {
      console.error('DB insert error:', dbError.message)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.' }, { status: 500 })
    }

    await Promise.allSettled([
      sendContactConfirmationEmail({ to: data.email, name: data.name }),
      sendAdminNotificationEmail({
        subject: `Nouveau message — ${data.category} — ${data.name}`,
        html: `<div style="font-family: sans-serif;"><h2>Nouveau message de contact</h2><p><strong>Nom:</strong> ${data.name}</p><p><strong>Email:</strong> ${data.email}</p><p><strong>Catégorie:</strong> ${data.category}</p><p><strong>Message:</strong></p><p>${data.message.replace(/\n/g, '<br>')}</p></div>`,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact route error:', err)
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer.' }, { status: 500 })
  }
}
