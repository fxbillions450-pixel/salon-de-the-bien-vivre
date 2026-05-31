import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Clock, Users } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.wellness' })
  return { title: t('title'), description: t('description') }
}

const wellnessServices = [
  {
    id: 'yoga-matin',
    image: '/images/wellness-ballet.jpg',
    title_fr: 'Yoga du matin',
    title_en: 'Morning yoga',
    desc_fr: '[Description à définir — séance de yoga accessible à tous les niveaux pour bien commencer la journée]',
    desc_en: '[Description to be defined — yoga session accessible to all levels to start the day right]',
    duration: 60,
    capacity: 12,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'pilates',
    image: '/images/wellness-splits.jpg',
    title_fr: 'Pilates',
    title_en: 'Pilates',
    desc_fr: '[Description à définir — renforcement musculaire doux et alignement du corps]',
    desc_en: '[Description to be defined — gentle muscle strengthening and body alignment]',
    duration: 60,
    capacity: 10,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'meditation',
    image: '/images/interior-dining.jpg',
    title_fr: 'Méditation guidée',
    title_en: 'Guided meditation',
    desc_fr: '[Description à définir — séance de pleine conscience et respiration pour libérer le stress]',
    desc_en: '[Description to be defined — mindfulness and breathing session to release stress]',
    duration: 45,
    capacity: 15,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM ANIMATEUR·RICE À DÉFINIR]',
  },
  {
    id: 'yoga-soir',
    image: '/images/wellness-ballet-2.jpg',
    title_fr: 'Yoga du soir',
    title_en: 'Evening yoga',
    desc_fr: '[Description à définir — yoga doux et restauratif pour décompresser après la journée]',
    desc_en: '[Description to be defined — gentle and restorative yoga to unwind after the day]',
    duration: 60,
    capacity: 12,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'respiration',
    image: '/images/wellness-ballet-3.jpg',
    title_fr: 'Atelier respiration & bien-être',
    title_en: 'Breathing & wellness workshop',
    desc_fr: '[Description à définir — techniques de respiration pour la gestion du stress et l\'énergie]',
    desc_en: '[Description to be defined — breathing techniques for stress management and energy]',
    duration: 60,
    capacity: 15,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM ANIMATEUR·RICE À DÉFINIR]',
  },
  {
    id: 'the-bien-etre',
    image: '/images/food-tea-tray.jpg',
    title_fr: 'Thé & bien-être',
    title_en: 'Tea & wellness',
    desc_fr: '[Description à définir — découverte des propriétés des thés et herbes pour la santé]',
    desc_en: '[Description to be defined — discovering the properties of teas and herbs for health]',
    duration: 75,
    capacity: 10,
    price_display: '[PRIX À DÉFINIR]',
    instructor_fr: '[NOM ANIMATEUR·RICE À DÉFINIR]',
  },
]

export default async function BienEtrePage({
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
        <div className="bg-forest py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h1 className="text-4xl font-serif text-cream mb-4">
                {isFr ? 'Bien-être' : 'Wellness'}
              </h1>
              <p className="text-cream/70 text-lg max-w-2xl mx-auto">
                {isFr
                  ? 'Yoga, pilates, méditation et ateliers bien-être dans un espace dédié à votre santé.'
                  : 'Yoga, pilates, meditation and wellness workshops in a space dedicated to your health.'}
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blush/20 border border-terracotta/20 rounded-2xl p-4 mb-10 text-center">
            <p className="text-sm text-brown">
              {isFr
                ? 'Les horaires sont à confirmer. Inscrivez-vous à l\'infolettre pour être informé·e des prochaines séances.'
                : 'Schedules are to be confirmed. Subscribe to the newsletter to be informed of upcoming sessions.'}
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessServices.map((s) => (
              <StaggerItem key={s.id}>
              <HoverLift as="article" className="card flex flex-col overflow-hidden h-full">
                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                  <Image
                    src={s.image}
                    alt={isFr ? s.title_fr : s.title_en}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-serif text-xl text-forest mb-2">
                    {isFr ? s.title_fr : s.title_en}
                  </h2>
                  <p className="text-sm text-brown/70 mb-4 flex-1">
                    {isFr ? s.desc_fr : s.desc_en}
                  </p>
                  <p className="text-xs text-brown/60 mb-4">
                    {isFr ? 'Animé par :' : 'Led by:'} {s.instructor_fr}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-brown/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {s.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" aria-hidden="true" />
                      Max {s.capacity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest">{s.price_display}</span>
                    <Link
                      href={`/${locale}/experiences/${s.id}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      {isFr ? 'Réserver' : 'Book'}
                    </Link>
                  </div>
                </div>
              </HoverLift>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </main>
      <Footer />
    </>
  )
}
