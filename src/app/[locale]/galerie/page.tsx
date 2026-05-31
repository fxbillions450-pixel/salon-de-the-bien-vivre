import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
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
  { label_fr: 'Photo intérieure — espace principal', label_en: 'Interior photo — main space', needed: true },
  { label_fr: 'Photo thés & infusions', label_en: 'Teas & infusions photo', needed: true },
  { label_fr: 'Photo atelier créatif', label_en: 'Creative workshop photo', needed: true },
  { label_fr: 'Photo yoga', label_en: 'Yoga photo', needed: true },
  { label_fr: 'Photo plantes', label_en: 'Plants photo', needed: true },
  { label_fr: 'Photo repas végétalien', label_en: 'Vegan meal photo', needed: true },
  { label_fr: 'Photo lounge soir', label_en: 'Evening lounge photo', needed: true },
  { label_fr: 'Photo événement pop-up', label_en: 'Pop-up event photo', needed: true },
  { label_fr: 'Photo bar thés', label_en: 'Tea bar photo', needed: true },
  { label_fr: 'Photo atelier peinture', label_en: 'Painting workshop photo', needed: true },
  { label_fr: 'Photo extérieur', label_en: 'Exterior photo', needed: true },
  { label_fr: 'Photo équipe', label_en: 'Team photo', needed: true },
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
                    <ImagePlaceholder
                      label={isFr ? item.label_fr : item.label_en}
                      aspectRatio="aspect-square"
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs text-brown/60">
                        {isFr ? item.label_fr : item.label_en}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <p className="text-center text-sm text-brown/50 italic mt-10">
              {isFr
                ? '[Les photos seront ajoutées prochainement par l\'administrateur]'
                : '[Photos will be added soon by the administrator]'}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
