'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { HeroVisual } from '@/components/visuals/HeroVisual'
import { BotanicalAccent } from '@/components/visuals/BotanicalAccent'

interface AnimatedHeroProps {
  locale: string
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
  ctaTertiary: string
}

const ease = [0.22, 1, 0.36, 1] as const

export function AnimatedHero({ locale, headline, subheadline, ctaPrimary, ctaSecondary, ctaTertiary }: AnimatedHeroProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = shouldReduceMotion ? {} : {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  }

  const itemVariants: Variants = shouldReduceMotion ? {} : {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  }

  const btnHover = shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }

  return (
    <section
      className="relative bg-gradient-to-br from-cream via-oat to-[#EAD2B7] py-20 lg:py-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <HeroVisual />

      {/* Decorative botanical accents */}
      <BotanicalAccent variant="leaf" color="#556B45" size={160} className="absolute bottom-8 left-4 hidden lg:block" opacity={0.12} />
      <BotanicalAccent variant="branch" color="#C96F4A" size={100} className="absolute top-12 left-[45%] hidden xl:block" opacity={0.08} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <motion.span
              variants={itemVariants}
              className="inline-block text-xs font-semibold tracking-widest uppercase text-terracotta mb-5 px-3 py-1 bg-terracotta/10 rounded-full border border-terracotta/20"
            >
              Montréal · Rosemont–La Petite-Patrie
            </motion.span>
            <motion.h1
              id="hero-heading"
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-serif text-espresso leading-tight mb-6 whitespace-pre-line"
            >
              {headline}
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl text-brown/80 mb-8 leading-relaxed">
              {subheadline}
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <motion.div whileHover={btnHover}>
                <Link href={`/${locale}/experiences`} className="btn-primary honey-glow text-base">
                  {ctaPrimary}
                </Link>
              </motion.div>
              <motion.div whileHover={btnHover}>
                <Link href={`/${locale}/menu`} className="btn-secondary text-base">
                  {ctaSecondary}
                </Link>
              </motion.div>
              <Link
                href={`/${locale}/contact`}
                className="text-forest underline underline-offset-4 hover:text-terracotta transition-colors py-3"
              >
                {ctaTertiary}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl warm-glow">
              <Image
                src="/images/interior-full-event.jpg"
                alt="Intérieur du Salon de Thé Bien Vivre avec des clients"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/20 to-transparent" />
            </div>
            {/* Floating badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-oat"
              animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
            >
              <p className="text-xs font-semibold text-terracotta uppercase tracking-wider">Réservez</p>
              <p className="text-sm font-medium text-espresso">Expériences uniques</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
