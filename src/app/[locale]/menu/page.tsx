import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StaggerContainer, StaggerItem, FadeIn, ImmersivePageHeader } from '@/components/home/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.menu' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

interface MenuItem {
  name: string
  description: string
  price: string
  tags: string[]
}

interface MenuCategory {
  id: string
  emoji: string
  title: string
  items: MenuItem[]
}

const menuCategories: MenuCategory[] = [
  {
    id: 'teas',
    emoji: '🫖',
    title: 'Thés & Infusions',
    items: [
      { name: 'Thé vert', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Camomille', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'sans-caféine'] },
      { name: 'Rooibos', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'sans-caféine'] },
    ],
  },
  {
    id: 'matcha',
    emoji: '🍵',
    title: 'Matcha & Café',
    items: [
      { name: 'Latte matcha', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Café du jour', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Americano', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
    ],
  },
  {
    id: 'fresh-juices',
    emoji: '🥤',
    title: 'Jus frais',
    items: [
      { name: 'Jus vert', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'cru'] },
      { name: 'Jus tropical', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'cru'] },
      { name: 'Limonade gingembre', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
    ],
  },
  {
    id: 'food',
    emoji: '🥗',
    title: 'Repas végétaliens',
    items: [
      { name: 'Bol du jour', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'local'] },
      { name: 'Soupe du moment', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Salade composée', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'local'] },
    ],
  },
  {
    id: 'pastries',
    emoji: '🥐',
    title: 'Pâtisseries',
    items: [
      { name: 'Gâteau du jour', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Muffin végétalien', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Cookie', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
    ],
  },
  {
    id: 'tisanes',
    emoji: '🌿',
    title: 'Tisanes',
    items: [
      { name: 'Tisane relaxante', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'sans-caféine'] },
      { name: 'Tisane digestive', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan', 'sans-caféine'] },
    ],
  },
  {
    id: 'seasonal',
    emoji: '🍂',
    title: 'Produits saisonniers',
    items: [
      { name: '[Produit saisonnier — à définir]', description: '[Description à ajouter selon la saison]', price: '[Prix à définir]', tags: ['saisonnier'] },
    ],
  },
  {
    id: 'specials',
    emoji: '✨',
    title: 'Boissons spéciales',
    items: [
      { name: 'Latte curcuma', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
      { name: 'Latte lavande', description: '[Description à ajouter]', price: '[Prix à définir]', tags: ['vegan'] },
    ],
  },
]

const tagColors: Record<string, string> = {
  vegan: 'bg-matcha/20 text-forest',
  'sans-caféine': 'bg-sage/10 text-sage',
  local: 'bg-terracotta/10 text-terracotta',
  cru: 'bg-honey/20 text-cocoa',
  saisonnier: 'bg-blush/40 text-brown',
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  await params

  return (
    <>
      <Header />
      <main id="main-content">
        <ImmersivePageHeader
          label="Notre Menu"
          heading="Notre menu"
          subheading="Un menu végétalien, local et fait avec soin. Aucune commande en ligne — menu consultable en salle et ici."
        />

        <section className="py-16 section-warm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {menuCategories.map((category) => (
                <div key={category.id} id={`category-${category.id}`}>
                  <FadeIn>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-3xl" aria-hidden="true">{category.emoji}</span>
                      <h2 className="font-serif text-2xl text-forest">{category.title}</h2>
                    </div>
                  </FadeIn>
                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" staggerDelay={0.06}>
                    {category.items.map((item) => (
                      <StaggerItem key={item.name}>
                      <article
                        className="card-warm p-5 hover:border-oat/80 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-charcoal">{item.name}</h3>
                          <span className="text-sm font-semibold text-terracotta ml-2 whitespace-nowrap">
                            {item.price}
                          </span>
                        </div>
                        <p className="text-sm text-brown/70 mb-3 italic">{item.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[tag] ?? 'bg-sage/20 text-forest'}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </article>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              ))}
            </div>

            <div className="mt-16 p-6 rounded-2xl bg-blush/20 border border-blush/40">
              <h2 className="font-serif text-lg text-brown mb-2">Allergènes & informations</h2>
              <p className="text-sm text-brown/80 leading-relaxed">
                Certains de nos produits peuvent contenir ou avoir été en contact avec des allergènes courants
                (noix, gluten, soja, etc.). Si vous avez des allergies ou des intolérances alimentaires,
                veuillez informer notre équipe lors de votre visite.{' '}
                <strong>[Informations détaillées sur les allergènes à ajouter par l&apos;administrateur.]</strong>
              </p>
              <p className="text-xs text-brown/60 mt-3 italic">
                Note : Les prix et la disponibilité des articles sont sujets à changement sans préavis.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
