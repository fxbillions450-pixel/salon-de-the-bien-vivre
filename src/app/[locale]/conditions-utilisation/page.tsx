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
      ? "Conditions d'utilisation — Salon de Thé Bien Vivre"
      : 'Terms of Use — Salon de Thé Bien Vivre',
    description: isFr
      ? "Conditions d'utilisation du Salon de Thé Bien Vivre."
      : 'Terms of Use for Salon de Thé Bien Vivre.',
  }
}

export default async function ConditionsUtilisationPage({
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
        <section className="bg-forest py-12" aria-labelledby="terms-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="terms-heading" className="font-serif text-3xl text-cream mb-2">
              {isFr ? "Conditions d'utilisation" : 'Terms of Use'}
            </h1>
            <p className="text-cream/60 text-sm">
              {isFr ? 'Dernière mise à jour : [Date à mettre à jour]' : 'Last updated: [Date to be updated]'}
            </p>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {isFr ? (
              <div className="space-y-8 text-charcoal/80 leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">1. Utilisation du site</h2>
                  <p>
                    En accédant au site du Salon de Thé Bien Vivre, vous acceptez les présentes conditions
                    d'utilisation. Ce site est fourni à titre informatif et pour faciliter les réservations.
                    [Contenu complet à définir par l'administrateur.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">2. Réservations en ligne</h2>
                  <p>
                    En effectuant une réservation en ligne, vous acceptez de fournir des informations exactes
                    et complètes. Le paiement est traité de manière sécurisée via Square.
                    [Conditions détaillées à définir par l'administrateur.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">3. Propriété intellectuelle</h2>
                  <p>
                    Tout le contenu présent sur ce site (textes, images, logos, design) est la propriété
                    du Salon de Thé Bien Vivre ou de ses contributeurs. Toute reproduction sans autorisation
                    est interdite.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">4. Limitation de responsabilité</h2>
                  <p>
                    [Clause de limitation de responsabilité à définir par l'administrateur en consultation
                    avec un conseiller juridique.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">5. Loi applicable</h2>
                  <p>
                    Les présentes conditions sont régies par les lois en vigueur au Québec, Canada.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">6. Modifications</h2>
                  <p>
                    Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
                    seront publiées sur cette page avec une date de mise à jour.
                  </p>
                </section>

                <div className="bg-terracotta/10 rounded-xl p-4 border border-terracotta/20 text-sm italic text-brown/70">
                  Ce document est provisoire et doit être complété par l'administrateur en consultation
                  avec un conseiller juridique. [Date à mettre à jour]
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-charcoal/80 leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">1. Use of the site</h2>
                  <p>
                    By accessing the Salon de Thé Bien Vivre website, you accept these terms of use.
                    This site is provided for informational purposes and to facilitate reservations.
                    [Full content to be defined by administrator.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">2. Online reservations</h2>
                  <p>
                    By making an online reservation, you agree to provide accurate and complete information.
                    Payment is processed securely via Square.
                    [Detailed terms to be defined by administrator.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">3. Intellectual property</h2>
                  <p>
                    All content on this site (text, images, logos, design) is the property of Salon de Thé
                    Bien Vivre or its contributors. Any reproduction without authorization is prohibited.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">4. Limitation of liability</h2>
                  <p>
                    [Limitation of liability clause to be defined by administrator in consultation with
                    legal counsel.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">5. Applicable law</h2>
                  <p>These terms are governed by the laws of Quebec, Canada.</p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">6. Modifications</h2>
                  <p>
                    We reserve the right to modify these terms at any time. Changes will be posted on
                    this page with an updated date.
                  </p>
                </section>

                <div className="bg-terracotta/10 rounded-xl p-4 border border-terracotta/20 text-sm italic text-brown/70">
                  This document is provisional and should be completed by the administrator in consultation
                  with legal counsel. [Date to be updated]
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
