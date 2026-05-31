'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ChevronDown } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/home/AnimatedSections'

interface FaqItem {
  question: string
  answer: string
}
interface FaqCategory {
  title: string
  items: FaqItem[]
}

function AccordionItem({ question, answer }: FaqItem) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-sage/20 rounded-xl overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-charcoal hover:bg-sage/10 transition-colors"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <span>{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-forest transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="px-5 py-4 bg-cream/50 text-brown/80 text-sm leading-relaxed border-t border-sage/20">
          {answer}
        </div>
      )}
    </div>
  )
}

export default function FaqPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const isFr = locale === 'fr'

  const faqData: FaqCategory[] = isFr
    ? [
        {
          title: '📅 Réservations',
          items: [
            {
              question: 'Comment réserver une expérience ?',
              answer: 'Rendez-vous sur notre page Expériences, choisissez l\'activité qui vous intéresse et cliquez sur « Réserver ». Vous pourrez compléter votre réservation en ligne avec paiement sécurisé.',
            },
            {
              question: 'Puis-je réserver pour plusieurs personnes ?',
              answer: 'Oui, lors de votre réservation, sélectionnez le nombre de places souhaité. Assurez-vous que la capacité de l\'expérience choisie le permet.',
            },
            {
              question: 'Combien de temps à l\'avance faut-il réserver ?',
              answer: 'Nous vous recommandons de réserver au moins 48 heures à l\'avance pour garantir votre place. Certains ateliers populaires se remplissent rapidement.',
            },
          ],
        },
        {
          title: '💳 Paiements',
          items: [
            {
              question: 'Quels modes de paiement acceptez-vous ?',
              answer: 'Les réservations en ligne se font par carte de crédit ou de débit via Square. En salle, nous acceptons également les paiements en espèces.',
            },
            {
              question: 'Le paiement est-il sécurisé ?',
              answer: 'Oui, tous les paiements en ligne sont traités par Square, une plateforme de paiement sécurisée et conforme aux normes PCI-DSS.',
            },
          ],
        },
        {
          title: '🔄 Annulations',
          items: [
            {
              question: 'Quelle est la politique d\'annulation ?',
              answer: '[Politique à définir par l\'administrateur. Veuillez consulter la page Politique d\'annulation pour les détails.]',
            },
            {
              question: 'Puis-je obtenir un remboursement ?',
              answer: '[Voir la politique d\'annulation complète sur notre page dédiée pour les conditions de remboursement.]',
            },
          ],
        },
        {
          title: '🎨 Ateliers',
          items: [
            {
              question: 'Les ateliers sont-ils adaptés aux débutants ?',
              answer: 'Oui ! Tous nos ateliers sont conçus pour être accessibles aux débutants. Aucune expérience préalable n\'est nécessaire, sauf indication contraire dans la description.',
            },
            {
              question: 'Y a-t-il un âge minimum pour les ateliers ?',
              answer: '[À confirmer par l\'administrateur selon les ateliers. Certains ateliers peuvent être réservés aux adultes ou nécessiter un accompagnement parental.]',
            },
          ],
        },
        {
          title: '♿ Accessibilité',
          items: [
            {
              question: 'L\'espace est-il accessible en fauteuil roulant ?',
              answer: '[À confirmer par l\'administrateur. Pour toute question sur l\'accessibilité, n\'hésitez pas à nous contacter directement.]',
            },
            {
              question: 'Y a-t-il un stationnement à proximité ?',
              answer: '[Voir la page Contact pour les informations sur le transport et le stationnement dans le quartier.]',
            },
          ],
        },
        {
          title: '🌱 Allergies & régimes',
          items: [
            {
              question: 'Proposez-vous des options sans gluten ?',
              answer: '[Consultez notre menu pour les informations sur les allergènes. N\'hésitez pas à informer notre équipe de vos allergies lors de votre visite.]',
            },
            {
              question: 'Votre cuisine est-elle 100% végétalienne ?',
              answer: '[À confirmer par l\'administrateur. Notre menu s\'inspire des valeurs végétales, mais certains produits peuvent contenir des ingrédients d\'origine animale. Consultez le menu ou contactez-nous.]',
            },
          ],
        },
      ]
    : [
        {
          title: '📅 Reservations',
          items: [
            {
              question: 'How do I book an experience?',
              answer: 'Visit our Experiences page, choose the activity that interests you, and click "Book". You can complete your reservation online with secure payment.',
            },
            {
              question: 'Can I book for multiple people?',
              answer: 'Yes, during your reservation, select the number of spots you need. Make sure the capacity of the chosen experience allows it.',
            },
            {
              question: 'How far in advance should I book?',
              answer: 'We recommend booking at least 48 hours in advance to guarantee your spot. Some popular workshops fill up quickly.',
            },
          ],
        },
        {
          title: '💳 Payments',
          items: [
            {
              question: 'What payment methods do you accept?',
              answer: 'Online reservations are made by credit or debit card via Square. In person, we also accept cash payments.',
            },
            {
              question: 'Is payment secure?',
              answer: 'Yes, all online payments are processed by Square, a secure payment platform compliant with PCI-DSS standards.',
            },
          ],
        },
        {
          title: '🔄 Cancellations',
          items: [
            {
              question: 'What is the cancellation policy?',
              answer: '[Policy to be defined by administrator. Please see the Cancellation Policy page for details.]',
            },
            {
              question: 'Can I get a refund?',
              answer: '[See the full cancellation policy on our dedicated page for refund conditions.]',
            },
          ],
        },
        {
          title: '🎨 Workshops',
          items: [
            {
              question: 'Are workshops suitable for beginners?',
              answer: 'Yes! All our workshops are designed to be accessible to beginners. No prior experience is needed unless otherwise stated in the description.',
            },
            {
              question: 'Is there a minimum age for workshops?',
              answer: '[To be confirmed by administrator depending on the workshop. Some workshops may be for adults only or require parental supervision.]',
            },
          ],
        },
        {
          title: '♿ Accessibility',
          items: [
            {
              question: 'Is the space wheelchair accessible?',
              answer: '[To be confirmed by administrator. For any accessibility questions, please contact us directly.]',
            },
            {
              question: 'Is there parking nearby?',
              answer: '[See the Contact page for information on transit and parking in the neighbourhood.]',
            },
          ],
        },
        {
          title: '🌱 Allergies & diets',
          items: [
            {
              question: 'Do you offer gluten-free options?',
              answer: '[Check our menu for allergen information. Please inform our team of your allergies when you visit.]',
            },
            {
              question: 'Is your kitchen 100% vegan?',
              answer: '[To be confirmed by administrator. Our menu is inspired by plant-based values, but some products may contain animal-derived ingredients. Check the menu or contact us.]',
            },
          ],
        },
      ]

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-forest py-16" aria-labelledby="faq-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h1 id="faq-heading" className="font-serif text-4xl md:text-5xl text-cream mb-4">
                {isFr ? 'Foire aux questions' : 'FAQ'}
              </h1>
              <p className="text-cream/70 text-lg max-w-xl mx-auto">
                {isFr
                  ? 'Les réponses à vos questions les plus fréquentes.'
                  : 'Answers to your most frequently asked questions.'}
              </p>
            </FadeIn>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {faqData.map((category) => (
              <FadeIn key={category.title} className="mb-10">
                <h2 className="font-serif text-2xl text-forest mb-5">{category.title}</h2>
                <StaggerContainer className="space-y-3">
                  {category.items.map((item) => (
                    <StaggerItem key={item.question}>
                      <AccordionItem question={item.question} answer={item.answer} />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </FadeIn>
            ))}

            <div className="mt-10 bg-white rounded-2xl p-6 border border-sage/20 text-center">
              <p className="text-brown/70 mb-4">
                {isFr
                  ? 'Vous ne trouvez pas la réponse à votre question ?'
                  : "Can't find the answer to your question?"}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="inline-flex bg-terracotta text-white font-medium px-6 py-3 rounded-full hover:bg-brown transition-colors"
              >
                {isFr ? 'Nous contacter' : 'Contact us'}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
