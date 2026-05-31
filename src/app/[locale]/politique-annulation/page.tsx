import type { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  return {
    title: isFr
      ? "Politique d'annulation — Salon de Thé Bien Vivre"
      : 'Cancellation Policy — Salon de Thé Bien Vivre',
    description: isFr
      ? "Politique d'annulation et de remboursement du Salon de Thé Bien Vivre."
      : 'Cancellation and refund policy for Salon de Thé Bien Vivre.',
  }
}

export default async function PolitiqueAnnulationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-forest py-12" aria-labelledby="cancellation-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="cancellation-heading" className="font-serif text-3xl text-cream mb-2">
              {isFr ? "Politique d'annulation" : 'Cancellation Policy'}
            </h1>
            <p className="text-cream/60 text-sm">
              {isFr ? 'Dernière mise à jour : [Date à mettre à jour]' : 'Last updated: [Date to be updated]'}
            </p>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Admin instructions */}
            <div className="bg-forest/5 border-2 border-dashed border-forest/30 rounded-2xl p-6 mb-8">
              <p className="text-sm font-medium text-forest mb-2">
                {isFr ? '📋 Note pour l\'administrateur' : '📋 Administrator note'}
              </p>
              <p className="text-sm text-brown/70">
                {isFr
                  ? 'Ce contenu doit être complété par l\'administrateur. Veuillez définir : les délais d\'annulation (ex. 24h, 48h, 72h avant), les conditions de remboursement complet, partiel et de non-remboursement, ainsi que les exceptions (maladie, intempéries, etc.).'
                  : 'This content must be completed by the administrator. Please define: cancellation deadlines (e.g. 24h, 48h, 72h before), full, partial and non-refund conditions, as well as exceptions (illness, weather, etc.).'}
              </p>
            </div>

            {/* Placeholder content */}
            <div className="bg-white rounded-2xl p-8 border border-sage/20 space-y-6 text-charcoal/80 leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-forest mb-3">
                  {isFr ? 'Politique d\'annulation et de remboursement' : 'Cancellation and Refund Policy'}
                </h2>
                <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-4">
                  <p className="text-brown font-medium text-sm">
                    {isFr
                      ? '[Politique d\'annulation et de remboursement à définir par l\'administrateur]'
                      : '[Cancellation and refund policy to be defined by administrator]'}
                  </p>
                </div>
              </section>

              <section>
                <h3 className="font-semibold text-forest mb-2">
                  {isFr ? 'Annulation par le client' : 'Customer cancellation'}
                </h3>
                <p className="text-sm italic text-brown/60">
                  {isFr
                    ? '[Ex : Annulation plus de 48h à l\'avance : remboursement complet. Annulation entre 24h et 48h : crédit ou remboursement partiel. Annulation moins de 24h : non remboursable. À définir.]'
                    : '[E.g.: Cancellation more than 48h in advance: full refund. Cancellation between 24h and 48h: credit or partial refund. Cancellation less than 24h: non-refundable. To be defined.]'}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-forest mb-2">
                  {isFr ? 'Annulation par le salon' : 'Cancellation by the salon'}
                </h3>
                <p className="text-sm italic text-brown/60">
                  {isFr
                    ? '[En cas d\'annulation de notre part (fermeture exceptionnelle, instructeur indisponible, etc.), vous serez remboursé(e) intégralement ou pourrez reporter votre réservation. À définir.]'
                    : '[In case of cancellation on our part (exceptional closure, instructor unavailable, etc.), you will be fully refunded or may reschedule your reservation. To be defined.]'}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-forest mb-2">
                  {isFr ? 'Remboursements' : 'Refunds'}
                </h3>
                <p className="text-sm italic text-brown/60">
                  {isFr
                    ? '[Les remboursements sont traités dans un délai de [X] jours ouvrables via le mode de paiement original. À définir.]'
                    : '[Refunds are processed within [X] business days via the original payment method. To be defined.]'}
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-forest mb-2">
                  {isFr ? 'Contact' : 'Contact'}
                </h3>
                <p className="text-sm text-brown/70">
                  {isFr
                    ? 'Pour toute demande d\'annulation ou de remboursement, contactez-nous à : [Courriel à configurer]'
                    : 'For any cancellation or refund request, contact us at: [Email to be configured]'}
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
