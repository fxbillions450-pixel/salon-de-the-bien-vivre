import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MapPin, Clock, Phone, Instagram, Leaf, Heart, Sparkles, Users, Calendar, ChevronRight } from 'lucide-react'
import { AnimatedHero } from '@/components/home/AnimatedHero'
import {
  FadeInSectionHeading,
  StaggerContainer,
  StaggerItem,
  HoverLift,
  FadeIn,
} from '@/components/home/AnimatedSections'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pages.home' })
  return {
    title: t('title'),
    description: t('description'),
  }
}

function AlertBar() {
  const t = useTranslations('hero')
  return (
    <div className="bg-forest text-cream text-sm py-2 px-4 text-center">
      <p>{t('alert')}</p>
    </div>
  )
}

function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero')
  return (
    <AnimatedHero
      locale={locale}
      headline={t('headline')}
      subheadline={t('subheadline')}
      ctaPrimary={t('cta_primary')}
      ctaSecondary={t('cta_secondary')}
      ctaTertiary={t('cta_tertiary')}
    />
  )
}

function QuickInfoSection() {
  const items = [
    {
      icon: <MapPin className="w-6 h-6 text-terracotta" aria-hidden="true" />,
      label: 'Adresse',
      value: '1951 Rue Saint-Zotique Est, Montréal',
    },
    {
      icon: <Clock className="w-6 h-6 text-terracotta" aria-hidden="true" />,
      label: 'Heures',
      value: '[HORAIRES À DÉFINIR]',
    },
    {
      icon: <Phone className="w-6 h-6 text-terracotta" aria-hidden="true" />,
      label: 'Téléphone',
      value: '[TÉLÉPHONE À DÉFINIR]',
    },
    {
      icon: <Instagram className="w-6 h-6 text-terracotta" aria-hidden="true" />,
      label: 'Instagram',
      value: '@[COMPTE À DÉFINIR]',
    },
  ]
  return (
    <section className="bg-white py-12" aria-label="Informations pratiques">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon, label, value }) => (
            <StaggerItem key={label}>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-cream/50 ring-1 ring-black/5 shadow-sm h-full">
                <div className="mt-0.5 flex-shrink-0">{icon}</div>
                <div>
                  <p className="text-xs text-brown/60 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-charcoal">{value}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

function ExperiencesSection({ locale }: { locale: string }) {
  const t = useTranslations('sections')
  const tExp = useTranslations('experiences')

  const experiences = [
    {
      category: tExp('filter_wellness'),
      title: 'Yoga du matin',
      description: '[Description à définir — séance de yoga pour bien commencer la journée]',
      duration: '60',
      price: '[PRIX]',
      icon: <Leaf className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
    {
      category: tExp('filter_wellness'),
      title: 'Pilates & thé',
      description: '[Description à définir — pilates suivi d\'une dégustation de thé]',
      duration: '75',
      price: '[PRIX]',
      icon: <Heart className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
    {
      category: tExp('filter_creative'),
      title: 'Atelier aquarelle',
      description: '[Description à définir — initiation à la peinture aquarelle]',
      duration: '90',
      price: '[PRIX]',
      icon: <Sparkles className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
    {
      category: tExp('filter_tasting'),
      title: 'Dégustation de thés',
      description: '[Description à définir — découverte guidée des thés du monde]',
      duration: '60',
      price: '[PRIX]',
      icon: <Leaf className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
    {
      category: tExp('filter_creative'),
      title: 'Atelier céramique',
      description: '[Description à définir — modelage et décoration de céramique]',
      duration: '120',
      price: '[PRIX]',
      icon: <Sparkles className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
    {
      category: tExp('filter_wellness'),
      title: 'Méditation guidée',
      description: '[Description à définir — séance de méditation et pleine conscience]',
      duration: '45',
      price: '[PRIX]',
      icon: <Heart className="w-8 h-8 text-forest" aria-hidden="true" />,
    },
  ]

  return (
    <section className="py-20 bg-cream" aria-labelledby="experiences-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInSectionHeading id="experiences-heading" className="section-title">
            {t('experiences_title')}
          </FadeInSectionHeading>
          <FadeIn delay={0.1}>
            <p className="section-subtitle mx-auto">{t('experiences_subtitle')}</p>
          </FadeIn>
        </div>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <StaggerItem key={exp.title}>
              <HoverLift as="article" className="card p-6 ring-1 ring-black/5 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-sage/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    {exp.icon}
                  </div>
                  <div>
                    <span className="text-xs text-terracotta font-medium uppercase tracking-wider">
                      {exp.category}
                    </span>
                    <h3 className="font-serif text-lg text-forest">{exp.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-brown/70 mb-4">{exp.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-brown/60">
                    {exp.duration} {tExp('minutes')}
                  </span>
                  <span className="font-semibold text-forest">{exp.price}</span>
                </div>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="text-center mt-10">
          <Link href={`/${locale}/experiences`} className="btn-primary transition-all duration-200">
            {tExp('book_now')}
          </Link>
        </div>
      </div>
    </section>
  )
}

function MenuPreviewSection({ locale }: { locale: string }) {
  const t = useTranslations('sections')
  const tMenu = useTranslations('menu')

  const categories = [
    { key: 'teas', emoji: '🫖', items: 3 },
    { key: 'hot_drinks', emoji: '☕', items: 4 },
    { key: 'cold_drinks', emoji: '🧊', items: 3 },
    { key: 'food', emoji: '🥗', items: 5 },
    { key: 'pastries', emoji: '🥐', items: 4 },
    { key: 'snacks', emoji: '🍵', items: 3 },
    { key: 'wine', emoji: '🍷', items: 2 },
    { key: 'cocktails', emoji: '🧃', items: 4 },
  ]

  return (
    <section className="py-20 bg-white" aria-labelledby="menu-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInSectionHeading id="menu-heading" className="section-title">
            {t('menu_title')}
          </FadeInSectionHeading>
          <FadeIn delay={0.1}>
            <p className="section-subtitle mx-auto">{t('menu_subtitle')}</p>
          </FadeIn>
        </div>
        <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8" staggerDelay={0.06}>
          {categories.map(({ key, emoji, items }) => (
            <StaggerItem key={key}>
              <HoverLift className="p-4 rounded-2xl bg-cream/60 border border-sage/20 text-center hover:border-sage/50 transition-colors ring-1 ring-black/5 h-full">
                <div className="text-3xl mb-2" aria-hidden="true">{emoji}</div>
                <p className="text-sm font-medium text-forest">{tMenu(`categories.${key}` as Parameters<typeof tMenu>[0])}</p>
                <p className="text-xs text-brown/50 mt-0.5">{items} articles</p>
              </HoverLift>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <p className="text-center text-sm text-brown/60 mb-6 italic">{tMenu('info_note')}</p>
        <div className="text-center">
          <Link href={`/${locale}/menu`} className="btn-secondary transition-all duration-200">
            {t('menu_title')} →
          </Link>
        </div>
      </div>
    </section>
  )
}

function AmbianceSection() {
  return (
    <section className="py-20 bg-forest text-cream" aria-labelledby="ambiance-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn className="w-full">
            <h2 id="ambiance-heading" className="text-4xl font-serif text-cream mb-6">
              Un espace conçu pour votre bien-être
            </h2>
            <p className="text-cream/80 text-lg mb-4 leading-relaxed">
              [TEXTE À DÉFINIR — décrivez l&apos;ambiance unique du salon : décoration, lumière, musique, odeurs]
            </p>
            <p className="text-cream/70 leading-relaxed">
              [TEXTE SUPPLÉMENTAIRE À DÉFINIR — valeurs, engagement envers la communauté, ingrédients locaux, etc.]
            </p>
            <div className="grid grid-cols-3 gap-6 mt-10">
              {[
                { value: '[#]', label: 'Variétés de thés' },
                { value: '[#]', label: 'Ateliers par mois' },
                { value: '[#]', label: 'Années d\'expérience' },
              ].map(({ value, label }) => (
                <div key={label} className="text-center">
                  <div className="text-3xl font-serif text-sage">{value}</div>
                  <div className="text-sm text-cream/60 mt-1">{label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
          <StaggerContainer className="grid grid-cols-2 gap-4" staggerDelay={0.1}>
            <StaggerItem>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/interior-customers.jpg" alt="Clients au salon" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/food-tea-tray.jpg" alt="Service de thé au Bien Vivre" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/event-embroidery.jpg" alt="Atelier créatif au salon" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <Image src="/images/wellness-ballet.jpg" alt="Espace bien-être" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </div>
    </section>
  )
}

const galleryImages = [
  { src: '/images/interior-event.jpg', labelFr: 'Salle principale', labelEn: 'Main room' },
  { src: '/images/food-tea-tray.jpg', labelFr: 'Service de thé', labelEn: 'Tea service' },
  { src: '/images/wellness-splits.jpg', labelFr: 'Espace bien-être', labelEn: 'Wellness space' },
  { src: '/images/food-croissant.jpg', labelFr: 'Pâtisseries', labelEn: 'Pastries' },
  { src: '/images/event-community.jpg', labelFr: 'Événement communautaire', labelEn: 'Community event' },
  { src: '/images/event-embroidery.jpg', labelFr: 'Atelier créatif', labelEn: 'Creative workshop' },
]

function GallerySection({ locale }: { locale: string }) {
  const t = useTranslations('sections')
  const isFr = locale === 'fr'
  return (
    <section className="py-20 bg-cream" aria-labelledby="gallery-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <FadeInSectionHeading id="gallery-heading" className="section-title">
            {t('gallery_title')}
          </FadeInSectionHeading>
          <FadeIn delay={0.1}>
            <p className="section-subtitle mx-auto">{t('gallery_subtitle')}</p>
          </FadeIn>
        </div>
        <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" staggerDelay={0.07}>
          {galleryImages.map((img) => (
            <StaggerItem key={img.src}>
              <div className="relative aspect-square rounded-2xl overflow-hidden img-hover-zoom">
                <Image
                  src={img.src}
                  alt={isFr ? img.labelFr : img.labelEn}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
        <div className="text-center">
          <Link href={`/${locale}/galerie`} className="btn-secondary transition-all duration-200">
            Voir toute la galerie →
          </Link>
        </div>
      </div>
    </section>
  )
}

function PrivateEventsSection({ locale }: { locale: string }) {
  const t = useTranslations('sections')
  const tPe = useTranslations('private_event')

  const eventTypes = [
    { icon: <Users className="w-6 h-6" aria-hidden="true" />, label: 'Anniversaires' },
    { icon: <Heart className="w-6 h-6" aria-hidden="true" />, label: 'Mariages & Shower' },
    { icon: <Sparkles className="w-6 h-6" aria-hidden="true" />, label: 'Lancements de produits' },
    { icon: <Calendar className="w-6 h-6" aria-hidden="true" />, label: 'Retraites d\'entreprise' },
  ]

  return (
    <section className="py-20 bg-blush/20" aria-labelledby="private-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn className="w-full">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/interior-full-event.jpg"
                alt="Événement privé au Salon de Thé Bien Vivre"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <div>
            <FadeInSectionHeading id="private-heading" className="section-title">
              {t('private_title')}
            </FadeInSectionHeading>
            <FadeIn delay={0.1}>
              <p className="section-subtitle mb-8">{t('private_subtitle')}</p>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-2 gap-4 mb-8" staggerDelay={0.08}>
              {eventTypes.map(({ icon, label }) => (
                <StaggerItem key={label}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/70 ring-1 ring-black/5">
                    <div className="text-terracotta">{icon}</div>
                    <span className="text-sm font-medium text-charcoal">{label}</span>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
            <Link href={`/${locale}/location-privee`} className="btn-primary inline-flex items-center gap-2 transition-all duration-200">
              {tPe('form_title')} <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function NewsletterSection() {
  const t = useTranslations('newsletter')
  return (
    <section className="py-20 bg-sage/20" aria-labelledby="newsletter-heading">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <FadeInSectionHeading id="newsletter-heading" className="section-title">
          {t('title')}
        </FadeInSectionHeading>
        <FadeIn delay={0.1}>
          <p className="section-subtitle mx-auto mb-8">{t('subtitle')}</p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <form
            action="/api/newsletter"
            method="POST"
            className="flex flex-col gap-4 max-w-md mx-auto"
            aria-label="Formulaire d'inscription à l'infolettre"
          >
            <div>
              <label htmlFor="newsletter-firstname" className="sr-only">
                {t('first_name_placeholder')}
              </label>
              <input
                id="newsletter-firstname"
                name="firstName"
                type="text"
                autoComplete="given-name"
                placeholder={t('first_name_placeholder')}
                className="w-full px-4 py-3 rounded-full border border-sage/40 bg-white focus:outline-none focus:ring-2 focus:ring-forest text-charcoal placeholder-brown/40"
              />
            </div>
            <div>
              <label htmlFor="newsletter-email" className="sr-only">
                {t('email_placeholder')}
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder={t('email_placeholder')}
                className="w-full px-4 py-3 rounded-full border border-sage/40 bg-white focus:outline-none focus:ring-2 focus:ring-forest text-charcoal placeholder-brown/40"
              />
            </div>
            <div className="flex items-start gap-3 text-left">
              <input
                id="newsletter-consent"
                name="consent"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest"
              />
              <label htmlFor="newsletter-consent" className="text-sm text-brown/80">
                {t('consent')}
              </label>
            </div>
            <button type="submit" className="btn-primary transition-all duration-200">
              {t('submit')}
            </button>
            <p className="text-xs text-brown/50">{t('privacy_note')}</p>
          </form>
        </FadeIn>
      </div>
    </section>
  )
}

function ContactSection({ locale }: { locale: string }) {
  const t = useTranslations('contact')
  const tSections = useTranslations('sections')
  return (
    <section className="py-20 bg-white" aria-labelledby="contact-section-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn className="w-full">
            <h2 id="contact-section-heading" className="section-title">
              {tSections('contact_title')}
            </h2>
            <p className="section-subtitle mb-8">
              {tSections('contact_subtitle')}
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-terracotta flex-shrink-0" aria-hidden="true" />
                <span className="text-charcoal">1951 Rue Saint-Zotique Est, Montréal</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-terracotta flex-shrink-0" aria-hidden="true" />
                <span className="text-charcoal">[HORAIRES À DÉFINIR]</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-terracotta flex-shrink-0" aria-hidden="true" />
                <span className="text-charcoal">[TÉLÉPHONE À DÉFINIR]</span>
              </div>
            </div>
            <Link href={`/${locale}/contact`} className="btn-primary transition-all duration-200">
              {t('submit')}
            </Link>
          </FadeIn>
          <FadeIn delay={0.15} className="w-full">
            <div
              className="rounded-2xl overflow-hidden bg-sage/20 aspect-video flex items-center justify-center border-2 border-dashed border-sage/50"
              aria-label={t('map_title')}
            >
              <p className="text-forest/60 text-sm text-center p-4">
                [Carte Google Maps intégrée]<br />
                <span className="text-xs text-brown/40">1951 Rue Saint-Zotique Est, Montréal</span>
              </p>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  return (
    <>
      <AlertBar />
      <Header />
      <main id="main-content">
        <HeroSection locale={locale} />
        <QuickInfoSection />
        <ExperiencesSection locale={locale} />
        <MenuPreviewSection locale={locale} />
        <AmbianceSection />
        <GallerySection locale={locale} />
        <PrivateEventsSection locale={locale} />
        <NewsletterSection />
        <ContactSection locale={locale} />
      </main>
      <Footer />
    </>
  )
}
