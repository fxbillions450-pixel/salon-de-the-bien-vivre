import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Clock, Users } from 'lucide-react'
import { StaggerContainer, StaggerItem, HoverLift, FadeIn } from '@/components/home/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.experiences' })
  return { title: t('title'), description: t('description') }
}

const placeholderExperiences = [
  {
    id: 'yoga-matin',
    category: 'wellness',
    image: '/images/wellness-ballet.jpg',
    title_fr: 'Yoga du matin',
    title_en: 'Morning yoga',
    short_fr: '[Description à définir — séance de yoga pour bien commencer la journée]',
    short_en: '[Description to be defined — yoga session to start the day right]',
    duration: 60,
    capacity: 12,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'pilates-the',
    category: 'wellness',
    image: '/images/wellness-splits.jpg',
    title_fr: 'Pilates & thé',
    title_en: 'Pilates & tea',
    short_fr: '[Description à définir — pilates suivi d\'une dégustation de thé]',
    short_en: '[Description to be defined — pilates followed by a tea tasting]',
    duration: 75,
    capacity: 10,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'meditation',
    category: 'wellness',
    image: '/images/interior-dining.jpg',
    title_fr: 'Méditation guidée',
    title_en: 'Guided meditation',
    short_fr: '[Description à définir — séance de méditation et pleine conscience]',
    short_en: '[Description to be defined — meditation and mindfulness session]',
    duration: 45,
    capacity: 15,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'atelier-aquarelle',
    category: 'creative',
    image: '/images/event-embroidery.jpg',
    title_fr: 'Atelier aquarelle',
    title_en: 'Watercolour workshop',
    short_fr: '[Description à définir — initiation à la peinture aquarelle pour tous niveaux]',
    short_en: '[Description to be defined — watercolour painting introduction for all levels]',
    duration: 90,
    capacity: 8,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'atelier-ceramique',
    category: 'creative',
    image: '/images/market-jewelry.jpg',
    title_fr: 'Atelier céramique',
    title_en: 'Ceramics workshop',
    short_fr: '[Description à définir — modelage et décoration de céramique]',
    short_en: '[Description to be defined — ceramic modelling and decoration]',
    duration: 120,
    capacity: 6,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[INSTRUCTEUR·RICE À DÉFINIR]',
  },
  {
    id: 'degustation-the',
    category: 'tasting',
    image: '/images/food-tea-tray.jpg',
    title_fr: 'Dégustation de thés du monde',
    title_en: 'World tea tasting',
    short_fr: '[Description à définir — découverte guidée des thés des quatre coins du monde]',
    short_en: '[Description to be defined — guided discovery of teas from around the world]',
    duration: 60,
    capacity: 10,
    price_display: '[PRIX À DÉFINIR]',
    instructor: '[ANIMATEUR·RICE À DÉFINIR]',
  },
]

const categoryColors: Record<string, string> = {
  wellness: 'bg-sage/20 text-forest',
  creative: 'bg-terracotta/10 text-terracotta',
  tasting: 'bg-blush text-brown',
  workshop: 'bg-forest/10 text-forest',
}

export default async function ExperiencesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experiences' })

  const categoryLabels: Record<string, string> = {
    wellness: t('filter_wellness'),
    creative: t('filter_creative'),
    tasting: t('filter_tasting'),
    workshop: t('filter_workshop'),
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="bg-forest py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h1 className="text-4xl font-serif text-cream mb-4">{t('page_title')}</h1>
              <p className="text-cream/70 text-lg max-w-2xl mx-auto">{t('page_description')}</p>
            </FadeIn>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FadeIn>
            <div className="bg-blush/20 border border-terracotta/20 rounded-2xl p-4 mb-10 text-center">
              <p className="text-sm text-brown">
                {locale === 'fr'
                  ? 'Les dates et disponibilités sont à confirmer. Inscrivez-vous à notre infolettre pour être informé·e en premier.'
                  : 'Dates and availability are to be confirmed. Subscribe to our newsletter to be the first to know.'}
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={0.08}>
            {placeholderExperiences.map((exp) => (
              <StaggerItem key={exp.id}>
                <HoverLift as="article" className="card flex flex-col overflow-hidden ring-1 ring-black/5 shadow-sm h-full">
                  <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
                    <Image
                      src={exp.image}
                      alt={locale === 'fr' ? exp.title_fr : exp.title_en}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColors[exp.category] || 'bg-sage/20 text-forest'}`}
                      >
                        {categoryLabels[exp.category] || exp.category}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl text-forest mb-2">
                      {locale === 'fr' ? exp.title_fr : exp.title_en}
                    </h2>
                    <p className="text-sm text-brown/70 mb-4 flex-1">
                      {locale === 'fr' ? exp.short_fr : exp.short_en}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-brown/60 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                        {exp.duration} {t('minutes')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" aria-hidden="true" />
                        {locale === 'fr' ? `Max ${exp.capacity} pers.` : `Max ${exp.capacity} people`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-forest">{exp.price_display}</span>
                      <Link
                        href={`/${locale}/experiences/${exp.id}`}
                        className="btn-primary text-sm py-2 px-4 transition-all duration-200"
                      >
                        {t('book_now')}
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
