import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { Clock, Users } from 'lucide-react'
import { FadeIn, StaggerContainer, StaggerItem, HoverLift } from '@/components/ui/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.workshops' })
  return { title: t('title'), description: t('description') }
}

const workshops = [
  {
    id: 'aquarelle',
    title_fr: 'Atelier aquarelle',
    title_en: 'Watercolour workshop',
    desc_fr: '[Description à définir — initiation à la peinture aquarelle pour tous niveaux. Matériel fourni.]',
    desc_en: '[Description to be defined — watercolour painting introduction for all levels. Materials provided.]',
    duration: 90,
    capacity: 8,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Matériel fourni, thé inclus',
    included_en: 'Materials provided, tea included',
  },
  {
    id: 'ceramique',
    title_fr: 'Atelier céramique',
    title_en: 'Ceramics workshop',
    desc_fr: '[Description à définir — modelage, décoration et cuisson de pièces en céramique]',
    desc_en: '[Description to be defined — ceramic modelling, decoration and firing]',
    duration: 120,
    capacity: 6,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Argile, outils, cuisson incluse',
    included_en: 'Clay, tools, firing included',
  },
  {
    id: 'calligraphie',
    title_fr: 'Atelier calligraphie',
    title_en: 'Calligraphy workshop',
    desc_fr: '[Description à définir — initiation à la calligraphie moderne ou traditionnelle]',
    desc_en: '[Description to be defined — introduction to modern or traditional calligraphy]',
    duration: 90,
    capacity: 10,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Plumes, encres et papier fournis',
    included_en: 'Nibs, inks and paper provided',
  },
  {
    id: 'macrame',
    title_fr: 'Atelier macramé',
    title_en: 'Macramé workshop',
    desc_fr: '[Description à définir — créez un objet de décoration en macramé]',
    desc_en: '[Description to be defined — create a macramé decorative item]',
    duration: 120,
    capacity: 8,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Fil et cadre fournis',
    included_en: 'Thread and frame provided',
  },
  {
    id: 'degustation-the-creation',
    title_fr: 'Créer son mélange de thé',
    title_en: 'Create your tea blend',
    desc_fr: '[Description à définir — atelier de création de mélanges de thé personnalisés]',
    desc_en: '[Description to be defined — workshop to create personalized tea blends]',
    duration: 75,
    capacity: 8,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Thés, épices, et contenant fournis',
    included_en: 'Teas, spices and container provided',
  },
  {
    id: 'broderie',
    title_fr: 'Atelier broderie',
    title_en: 'Embroidery workshop',
    desc_fr: '[Description à définir — initiation à la broderie sur tissu]',
    desc_en: '[Description to be defined — introduction to fabric embroidery]',
    duration: 90,
    capacity: 8,
    price_display: '[PRIX À DÉFINIR]',
    included_fr: 'Matériel complet fourni',
    included_en: 'Complete materials provided',
  },
]

export default async function AteliersPage({
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
                {isFr ? 'Ateliers créatifs' : 'Creative workshops'}
              </h1>
              <p className="text-cream/70 text-lg max-w-2xl mx-auto">
                {isFr
                  ? 'Exprimez votre créativité dans notre espace chaleureux, thé à la main.'
                  : 'Express your creativity in our warm space, tea in hand.'}
              </p>
            </FadeIn>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-blush/20 border border-terracotta/20 rounded-2xl p-4 mb-10 text-center">
            <p className="text-sm text-brown">
              {isFr
                ? 'Les dates sont à confirmer. Inscrivez-vous à l\'infolettre pour être informé·e des prochains ateliers.'
                : 'Dates are to be confirmed. Subscribe to the newsletter to be informed of upcoming workshops.'}
            </p>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((w) => (
              <StaggerItem key={w.id}>
              <HoverLift as="article" className="card flex flex-col overflow-hidden h-full">
                <ImagePlaceholder
                  label={isFr ? w.title_fr : w.title_en}
                  aspectRatio="aspect-video"
                  className="rounded-b-none"
                />
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="font-serif text-xl text-forest mb-2">
                    {isFr ? w.title_fr : w.title_en}
                  </h2>
                  <p className="text-sm text-brown/70 mb-4 flex-1">
                    {isFr ? w.desc_fr : w.desc_en}
                  </p>
                  <p className="text-xs text-brown/60 mb-4">
                    ✓ {isFr ? w.included_fr : w.included_en}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-brown/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      {w.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" aria-hidden="true" />
                      Max {w.capacity}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-forest">{w.price_display}</span>
                    <Link
                      href={`/${locale}/experiences/${w.id}`}
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
