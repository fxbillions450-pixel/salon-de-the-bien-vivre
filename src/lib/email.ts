import { Resend } from 'resend'

export function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendReservationConfirmedEmail({
  to,
  firstName,
  experienceTitle,
  startTime,
  quantity,
  amountCents,
  reservationId,
  locale = 'fr',
}: {
  to: string
  firstName: string
  experienceTitle: string
  startTime: string
  quantity: number
  amountCents: number
  reservationId: string
  locale?: string
}) {
  const resend = getResendClient()
  const subject = locale === 'fr'
    ? `Réservation confirmée — ${experienceTitle}`
    : `Reservation confirmed — ${experienceTitle}`

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2B2926; background: #F7F1E8; padding: 32px;">
      <h1 style="color: #314D3B; font-size: 24px;">${locale === 'fr' ? 'Votre réservation est confirmée' : 'Your reservation is confirmed'} ✓</h1>
      <p>${locale === 'fr' ? 'Bonjour' : 'Hello'} ${firstName},</p>
      <p>${locale === 'fr' ? 'Merci pour votre réservation chez Salon de Thé Bien Vivre.' : 'Thank you for your reservation at Salon de Thé Bien Vivre.'}</p>
      <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p><strong>${locale === 'fr' ? 'Expérience' : 'Experience'}:</strong> ${experienceTitle}</p>
        <p><strong>${locale === 'fr' ? 'Date' : 'Date'}:</strong> ${new Date(startTime).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
        <p><strong>${locale === 'fr' ? 'Nombre de places' : 'Spots'}:</strong> ${quantity}</p>
        <p><strong>${locale === 'fr' ? 'Total payé' : 'Amount paid'}:</strong> ${(amountCents / 100).toFixed(2)} CAD</p>
        <p><strong>${locale === 'fr' ? 'Référence' : 'Reference'}:</strong> ${reservationId.slice(0, 8).toUpperCase()}</p>
      </div>
      <p>📍 1951 Rue Saint-Zotique Est, Montréal</p>
      <p style="font-size: 12px; color: #6B4F3F;">${locale === 'fr' ? 'Des questions ? Contactez-nous.' : 'Questions? Contact us.'}</p>
    </div>
  `

  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject,
    html,
  })
}

export async function sendAdminNotificationEmail({
  subject,
  html,
}: {
  subject: string
  html: string
}) {
  const resend = getResendClient()
  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to: process.env.ADMIN_NOTIFICATION_EMAIL!,
    subject,
    html,
  })
}

export async function sendContactConfirmationEmail({
  to,
  name,
  locale = 'fr',
}: {
  to: string
  name: string
  locale?: string
}) {
  const resend = getResendClient()
  return resend.emails.send({
    from: process.env.FROM_EMAIL!,
    to,
    subject: locale === 'fr' ? 'Message reçu — Salon de Thé Bien Vivre' : 'Message received — Salon de Thé Bien Vivre',
    html: `<div style="font-family: Georgia, serif; color: #2B2926; max-width: 600px; margin: 0 auto; background: #F7F1E8; padding: 32px;">
      <h2 style="color: #314D3B;">${locale === 'fr' ? 'Merci pour votre message' : 'Thank you for your message'}, ${name}</h2>
      <p>${locale === 'fr' ? 'Nous avons bien reçu votre message et vous répondrons dans les meilleurs délais.' : 'We have received your message and will get back to you shortly.'}</p>
      <p>📍 1951 Rue Saint-Zotique Est, Montréal</p>
    </div>`,
  })
}
