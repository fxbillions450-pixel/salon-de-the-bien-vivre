'use client'

import Link from 'next/link'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { HeroVisual } from '@/components/visuals/HeroVisual'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'

interface AnimatedHeroProps {
  locale: string
  headline: string
  subheadline: string
  ctaPrimary: string
  ctaSecondary: string
  ctaTertiary: string
}

const ease = [0.22, 1, 0.36, 1] as const

export function AnimatedHero({
  locale,
  headline,
  subheadline,
  ctaPrimary,
  ctaSecondary,
  ctaTertiary,
}: AnimatedHeroProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12 },
        },
      }

  const itemVariants: Variants = shouldReduceMotion
    ? {}
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease },
        },
      }

  const btnHover = shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }

  return (
    <section
      className="relative bg-gradient-to-br from-[#F5F0E8] via-[#EEF5EE] to-[#F5F0E8] py-20 lg:py-28 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Three.js ambient canvas */}
      <HeroVisual />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              id="hero-heading"
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-serif text-forest leading-tight mb-6 whitespace-pre-line"
            >
              {headline}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl text-brown/80 mb-8 leading-relaxed"
            >
              {subheadline}
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.div whileHover={btnHover}>
                <Link href={`/${locale}/experiences`} className="btn-primary text-base transition-all duration-200">
                  {ctaPrimary}
                </Link>
              </motion.div>
              <motion.div whileHover={btnHover}>
                <Link href={`/${locale}/menu`} className="btn-secondary text-base transition-all duration-200">
                  {ctaSecondary}
                </Link>
              </motion.div>
              <Link
                href={`/${locale}/contact`}
                className="text-forest underline underline-offset-4 hover:text-terracotta transition-colors py-3 transition-all duration-200"
              >
                {ctaTertiary}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial={shouldReduceMotion ? undefined : 'hidden'}
            animate={shouldReduceMotion ? undefined : 'visible'}
          >
            <ImagePlaceholder
              label="Vue intérieure du Salon de Thé Bien Vivre"
              aspectRatio="aspect-[4/3]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
