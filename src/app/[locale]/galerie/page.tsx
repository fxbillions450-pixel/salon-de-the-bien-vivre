import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  return {
    title: isFr ? 'Galerie — Salon de Thé Bien Vivre' : 'Gallery — Salon de Thé Bien Vivre',
    description: isFr
      ? 'Découvrez en images notre espace, nos ateliers, nos thés et notre communauté.'
      : 'Discover our space, workshops, teas and community in pictures.',
  }
}

const galleryItems = [
  { src: '/images/interior-full-event.jpg', label_fr: 'Espace principal — événement', label_en: 'Main space — event' },
  { src: '/images/interior-event.jpg', label_fr: 'Salon & communauté', label_en: 'Salon & community' },
  { src: '/images/interior-customers.jpg', label_fr: 'Détente au salon', label_en: 'Relaxing at the salon' },
  { src: '/images/food-tea-tray.jpg', label_fr: 'Service de thé', label_en: 'Tea service' },
  { src: '/images/food-soup.jpg', label_fr: 'Cuisine végétalienne', label_en: 'Vegan cuisine' },
  { src: '/images/food-avocado.jpg', label_fr: 'Repas maison', label_en: 'Homemade meals' },
  { src: '/images/wellness-ballet.jpg', label_fr: 'Bien-être & mouvement', label_en: 'Wellness & movement' },
  { src: '/images/wellness-splits.jpg', label_fr: 'Performance artistique', label_en: 'Artistic performance' },
  { src: '/images/event-embroidery.jpg', label_fr: 'Atelier créatif', label_en: 'Creative workshop' },
  { src: '/images/event-chess.jpg', label_fr: 'Jeux & relaxation', label_en: 'Games & relaxation' },
  { src: '/images/market-jewelry.jpg', label_fr: 'Pop-up & artisanat', label_en: 'Pop-up & craft market' },
  { src: '/images/owner-community.jpg', label_fr: 'Notre communauté', label_en: 'Our community' },
]

export default async function GaleriePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'
  await getTranslations({ locale, namespace: 'pages.gallery' })

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-forest py-16" aria-labelledby="gallery-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FadeIn>
              <h1 id="gallery-heading" className="font-serif text-4xl md:text-5xl text-cream mb-4">
                {isFr ? 'Galerie' : 'Gallery'}
              </h1>
              <p className="text-cream/70 text-lg max-w-xl mx-auto">
                {isFr
                  ? 'Découvrez notre univers en images.'
                  : 'Discover our world in pictures.'}
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Admin note */}
        <div className="bg-terracotta/10 border-b border-terracotta/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-sm text-brown/70 text-center italic">
              {isFr
                ? 'Galerie — les photos peuvent être ajoutées via le tableau de bord administrateur.'
                : 'Gallery — photos can be added via the admin dashboard.'}
            </p>
          </div>
        </div>

        {/* Gallery grid */}
        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item) => (
                <StaggerItem key={item.label_fr}>
                  <div className="group relative img-hover-zoom">
                    <div className="relative aspect-square rounded-xl overflow-hidden">
                      <Image
                        src={item.src}
                        alt={isFr ? item.label_fr : item.label_en}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <div className="mt-2 text-center">
                      <p className="text-xs text-brown/60">
                        {isFr ? item.label_fr : item.label_en}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
