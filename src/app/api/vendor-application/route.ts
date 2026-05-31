import { NextRequest, NextResponse } from 'next/server'
import { vendorApplicationSchema } from '@/lib/validations'
import { rateLimit } from '@/lib/ratelimit'
import { verifyTurnstile } from '@/lib/turnstile'
import { createAdminSupabaseClient } from '@/lib/supabase/server'
import { sendAdminNotificationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    const rl = await rateLimit(`vendor-app:${ip}`, { limit: 3, window: 3600 })
    if (!rl.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'Corps de requête invalide.' }, { status: 400 })
    }

    const parsed = vendorApplicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Données invalides.', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { turnstileToken, ...data } = parsed.data
    const turnstileValid = await verifyTurnstile(turnstileToken)
    if (!turnstileValid) {
      return NextResponse.json(
        { error: 'Vérification de sécurité échouée. Veuillez réessayer.' },
        { status: 400 }
      )
    }

    const supabase = await createAdminSupabaseClient()
    const { error: dbError } = await supabase.from('vendor_applications').insert({
      business_name: data.businessName,
      contact_name: data.contactName,
      email: data.email,
      phone: data.phone,
      instagram: data.instagram ?? null,
      product_type: data.productType,
      preferred_date: data.preferredDate,
      space_needs: data.spaceNeeds ?? null,
      message: data.message ?? null,
      status: 'new',
      consent_terms: data.consentTerms,
      ip_address: ip !== 'unknown' ? ip : null,
    })

    if (dbError) {
      console.error('DB insert error:', dbError.message)
      return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.' }, { status: 500 })
    }

    await Promise.allSettled([
      sendAdminNotificationEmail({
        subject: `Nouvelle candidature vendeur — ${data.businessName}`,
        html: `<div style="font-family: sans-serif;">
          <h2>Nouvelle candidature vendeur</h2>
          <p><strong>Entreprise:</strong> ${data.businessName}</p>
          <p><strong>Contact:</strong> ${data.contactName}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Téléphone:</strong> ${data.phone}</p>
          <p><strong>Instagram:</strong> ${data.instagram ?? 'Non précisé'}</p>
          <p><strong>Type de produits:</strong> ${data.productType}</p>
          <p><strong>Date souhaitée:</strong> ${data.preferredDate}</p>
          <p><strong>Besoins en espace:</strong> ${data.spaceNeeds ?? 'Non précisé'}</p>
          <p><strong>Message:</strong> ${data.message ?? 'Aucun'}</p>
        </div>`,
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Vendor application error:', err)
    return NextResponse.json({ error: 'Erreur serveur. Veuillez réessayer.' }, { status: 500 })
  }
}
