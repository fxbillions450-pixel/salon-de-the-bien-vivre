import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isFr = locale === 'fr'
  return {
    title: isFr ? 'À propos — Salon de Thé Bien Vivre' : 'About — Salon de Thé Bien Vivre',
    description: isFr
      ? 'Découvrez l\'histoire, la mission et les valeurs du Salon de Thé Bien Vivre à Montréal.'
      : 'Discover the story, mission and values of Salon de Thé Bien Vivre in Montreal.',
  }
}

const values = [
  { emoji: '🌿', title_fr: 'Bien-être', title_en: 'Wellness', desc_fr: 'Prendre soin de soi, corps et esprit.', desc_en: 'Taking care of oneself, body and mind.' },
  { emoji: '🎨', title_fr: 'Créativité', title_en: 'Creativity', desc_fr: 'Explorer, créer, s\'exprimer librement.', desc_en: 'Exploring, creating, expressing freely.' },
  { emoji: '🤝', title_fr: 'Communauté', title_en: 'Community', desc_fr: 'Se rassembler, partager, appartenir.', desc_en: 'Gathering, sharing, belonging.' },
  { emoji: '🍃', title_fr: 'Simplicité', title_en: 'Simplicity', desc_fr: 'Revenir à l\'essentiel, sans excès.', desc_en: 'Getting back to basics, without excess.' },
  { emoji: '🔆', title_fr: 'Chaleur', title_en: 'Warmth', desc_fr: 'Un accueil sincère et bienveillant pour tous.', desc_en: 'A sincere and caring welcome for all.' },
  { emoji: '🧘', title_fr: 'Présence', title_en: 'Presence', desc_fr: 'Vivre pleinement le moment présent.', desc_en: 'Fully living in the present moment.' },
]

export default async function AProposPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isFr = locale === 'fr'
  await getTranslations({ locale, namespace: 'pages.about' })

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-forest py-20" aria-labelledby="about-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="about-heading" className="font-serif text-4xl md:text-5xl text-cream mb-4">
              {isFr ? 'À propos' : 'About us'}
            </h1>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto">
              {isFr
                ? 'Un salon de thé, un espace bien-être, un lieu de communauté au cœur de Montréal.'
                : 'A tea salon, a wellness space, a community hub in the heart of Montreal.'}
            </p>
          </div>
        </section>

        {/* Notre espace */}
        <section className="py-16 bg-cream" aria-labelledby="space-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="space-heading" className="font-serif text-3xl text-forest mb-6">
                  {isFr ? 'Notre espace' : 'Our space'}
                </h2>
                <p className="text-brown/80 leading-relaxed mb-4">
                  {isFr
                    ? 'Situé au 1951 Rue Saint-Zotique Est à Montréal, le Salon de Thé Bien Vivre est un espace chaleureux et lumineux, conçu pour vous inviter à ralentir.'
                    : 'Located at 1951 Rue Saint-Zotique Est in Montreal, Salon de Thé Bien Vivre is a warm and luminous space, designed to invite you to slow down.'}
                </p>
                <p className="text-brown/80 leading-relaxed mb-4">
                  {isFr
                    ? '[Description de l\'espace physique à ajouter — décoration, ambiance, capacité, caractéristiques particulières.]'
                    : '[Description of the physical space to be added — decor, ambiance, capacity, special features.]'}
                </p>
                <p className="text-sm text-brown/60 italic">
                  1951 Rue Saint-Zotique Est, Montréal, QC
                </p>
              </div>
              <div>
                <ImagePlaceholder
                  label={isFr ? 'Intérieur du salon' : 'Salon interior'}
                  aspectRatio="aspect-[4/3]"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notre mission */}
        <section className="py-16 bg-white" aria-labelledby="mission-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 id="mission-heading" className="font-serif text-3xl text-forest mb-6">
              {isFr ? 'Notre mission' : 'Our mission'}
            </h2>
            <p className="text-xl text-brown/80 leading-relaxed font-serif italic">
              {isFr
                ? '"Notre mission est de créer un espace de bien-être, de créativité et de communauté accessible à tous."'
                : '"Our mission is to create a space of wellness, creativity and community accessible to all."'}
            </p>
          </div>
        </section>

        {/* Ce que vous pouvez vivre ici */}
        <section className="py-16 bg-cream" aria-labelledby="activities-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="activities-heading" className="font-serif text-3xl text-forest mb-8 text-center">
              {isFr ? 'Ce que vous pouvez vivre ici' : 'What you can experience here'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { fr: '🫖 Déguster des thés & infusions du monde', en: '🫖 Tasting teas & infusions from around the world' },
                { fr: '🧘 Yoga, pilates & méditation', en: '🧘 Yoga, pilates & meditation' },
                { fr: '🎨 Ateliers créatifs pour tous niveaux', en: '🎨 Creative workshops for all levels' },
                { fr: '🌿 Découvrir les plantes & le bien-être', en: '🌿 Discovering plants & wellness' },
                { fr: '🌸 Pop-ups & événements communautaires', en: '🌸 Pop-ups & community events' },
                { fr: '🏡 Louer l\'espace pour vos événements privés', en: '🏡 Renting the space for your private events' },
                { fr: '🥗 Savourer des repas végétaliens faits maison', en: '🥗 Enjoying homemade vegan meals' },
                { fr: '📿 Participer à des ateliers bijoux & artisanat', en: '📿 Joining jewellery & craft workshops' },
              ].map((item) => (
                <div
                  key={item.fr}
                  className="p-4 rounded-xl bg-white border border-sage/20 text-sm text-charcoal font-medium"
                >
                  {isFr ? item.fr : item.en}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* L'histoire — placeholder */}
        <section className="py-16 bg-white" aria-labelledby="story-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="story-heading" className="font-serif text-3xl text-forest mb-6 text-center">
              {isFr ? 'Notre histoire' : 'Our story'}
            </h2>
            <div className="border-2 border-dashed border-terracotta/40 rounded-2xl p-8 bg-terracotta/5">
              <p className="text-center text-brown/60 text-sm font-medium uppercase tracking-wider mb-3">
                {isFr ? '[ Contenu à ajouter ]' : '[ Content to be added ]'}
              </p>
              <p className="text-center text-brown/70 italic">
                {isFr
                  ? '[Histoire du fondateur / de la fondatrice à ajouter — parcours, inspiration, vision, anecdotes fondatrices. Ce texte sera rempli par l\'administrateur.]'
                  : '[Founder\'s story to be added — background, inspiration, vision, founding anecdotes. This text will be filled in by the administrator.]'}
              </p>
            </div>
          </div>
        </section>

        {/* Nos valeurs */}
        <section className="py-16 bg-cream" aria-labelledby="values-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="values-heading" className="font-serif text-3xl text-forest mb-10 text-center">
              {isFr ? 'Nos valeurs' : 'Our values'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {values.map((v) => (
                <div
                  key={v.title_fr}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-sage/10 text-center hover:border-sage/30 transition-colors"
                >
                  <span className="text-4xl mb-3 block" aria-hidden="true">{v.emoji}</span>
                  <h3 className="font-serif text-xl text-forest mb-2">
                    {isFr ? v.title_fr : v.title_en}
                  </h3>
                  <p className="text-sm text-brown/70">
                    {isFr ? v.desc_fr : v.desc_en}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team image */}
        <section className="py-16 bg-forest" aria-label={isFr ? 'Notre équipe' : 'Our team'}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ImagePlaceholder
              label={isFr ? 'Photo de l\'équipe — à ajouter' : 'Team photo — to be added'}
              aspectRatio="aspect-[16/6]"
            />
            <p className="text-center text-cream/60 text-sm mt-4">
              {isFr
                ? '[Photo de l\'équipe et présentation des membres à ajouter par l\'administrateur]'
                : '[Team photo and member introductions to be added by administrator]'}
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
