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
      ? 'Politique de confidentialité — Salon de Thé Bien Vivre'
      : 'Privacy Policy — Salon de Thé Bien Vivre',
    description: isFr
      ? 'Politique de confidentialité du Salon de Thé Bien Vivre.'
      : 'Privacy Policy for Salon de Thé Bien Vivre.',
  }
}

export default async function PolitiqueConfidentialitePage({
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
        <section className="bg-forest py-12" aria-labelledby="privacy-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="privacy-heading" className="font-serif text-3xl text-cream mb-2">
              {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
            </h1>
            <p className="text-cream/60 text-sm">
              {isFr ? 'Dernière mise à jour : [Date à mettre à jour]' : 'Last updated: [Date to be updated]'}
            </p>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm prose-brown max-w-none">
            {isFr ? (
              <div className="space-y-8 text-charcoal/80 leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">1. Collecte des données</h2>
                  <p>
                    Dans le cadre de nos services, le Salon de Thé Bien Vivre peut collecter les informations
                    personnelles suivantes :
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Nom et prénom</li>
                    <li>Adresse courriel</li>
                    <li>Numéro de téléphone</li>
                    <li>Informations relatives aux réservations (date, heure, type d'expérience)</li>
                    <li>Messages envoyés via le formulaire de contact</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">2. Utilisation des données</h2>
                  <p>Vos données personnelles sont utilisées uniquement pour :</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Traiter vos réservations et confirmer votre participation</li>
                    <li>Vous envoyer l'infolettre si vous y avez consenti</li>
                    <li>Répondre à vos demandes de contact</li>
                    <li>Traiter vos demandes de location privée ou de candidature vendeur</li>
                  </ul>
                  <p className="mt-3">
                    Nous ne vendons ni ne louons vos données à des tiers.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">3. Paiements — Square</h2>
                  <p>
                    Les paiements en ligne sont traités par Square, une plateforme de paiement sécurisée
                    conforme aux normes PCI-DSS (Payment Card Industry Data Security Standard). Le Salon
                    de Thé Bien Vivre ne stocke aucune information de carte de crédit ou de débit.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">4. Cookies</h2>
                  <p>
                    [Politique sur les cookies à définir par l'administrateur. Indiquer quels cookies sont
                    utilisés, à quelle fin, et comment les désactiver.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">5. Conservation des données</h2>
                  <p>
                    Nous conservons vos données personnelles uniquement le temps nécessaire aux fins
                    décrites dans cette politique, ou tel que requis par la loi applicable au Québec
                    (Loi 25 / Loi sur la protection des renseignements personnels dans le secteur privé).
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">6. Vos droits</h2>
                  <p>
                    Conformément à la législation applicable, vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Droit d'accès à vos données personnelles</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l'effacement (« droit à l'oubli »)</li>
                    <li>Droit de retirer votre consentement à tout moment</li>
                  </ul>
                  <p className="mt-3">
                    Pour exercer ces droits, contactez-nous à : [Courriel à configurer]
                  </p>
                </section>

                <div className="bg-terracotta/10 rounded-xl p-4 border border-terracotta/20 text-sm italic text-brown/70">
                  Cette politique est un document provisoire. [Date à mettre à jour]
                </div>
              </div>
            ) : (
              <div className="space-y-8 text-charcoal/80 leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">1. Data collection</h2>
                  <p>
                    In the course of our services, Salon de Thé Bien Vivre may collect the following
                    personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>First and last name</li>
                    <li>Email address</li>
                    <li>Phone number</li>
                    <li>Reservation information (date, time, experience type)</li>
                    <li>Messages sent via the contact form</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">2. Use of data</h2>
                  <p>Your personal data is used solely to:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Process your reservations and confirm your participation</li>
                    <li>Send you the newsletter if you have consented</li>
                    <li>Respond to your contact requests</li>
                    <li>Process private event or vendor application inquiries</li>
                  </ul>
                  <p className="mt-3">We do not sell or rent your data to third parties.</p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">3. Payments — Square</h2>
                  <p>
                    Online payments are processed by Square, a secure payment platform compliant with
                    PCI-DSS standards. Salon de Thé Bien Vivre does not store any credit or debit card
                    information.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">4. Cookies</h2>
                  <p>
                    [Cookie policy to be defined by administrator. Indicate which cookies are used, for
                    what purpose, and how to disable them.]
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">5. Data retention</h2>
                  <p>
                    We retain your personal data only as long as necessary for the purposes described in
                    this policy, or as required by applicable law.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-forest mb-3">6. Your rights</h2>
                  <p>Under applicable law, you have the following rights:</p>
                  <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                    <li>Right of access to your personal data</li>
                    <li>Right of rectification</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to withdraw consent at any time</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, contact us at: [Email to be configured]
                  </p>
                </section>

                <div className="bg-terracotta/10 rounded-xl p-4 border border-terracotta/20 text-sm italic text-brown/70">
                  This policy is a provisional document. [Date to be updated]
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
