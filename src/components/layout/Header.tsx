'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { key: 'menu', href: '/menu' },
  { key: 'experiences', href: '/experiences' },
  { key: 'workshops', href: '/ateliers' },
  { key: 'wellness', href: '/bien-etre' },
  { key: 'events', href: '/evenements' },
  { key: 'private', href: '/location-privee' },
  { key: 'about', href: '/a-propos' },
  { key: 'contact', href: '/contact' },
] as const

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const localizedHref = (path: string) => `/${locale}${path}`

  const isActive = (href: string) => {
    const full = `/${locale}${href}`
    return pathname === full || pathname.startsWith(full + '/')
  }

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const otherLocalePath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-sage/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={localizedHref('/')}
            className="flex items-center gap-2 group"
            aria-label="Salon de Thé Bien Vivre — Accueil"
          >
            <Image
              src="/images/logo-badge.png"
              alt="Bien Vivre Salon de Thé"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
            <span className="font-serif text-xl text-forest group-hover:text-terracotta transition-colors">
              Bien Vivre
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={localizedHref(href)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive(href)
                    ? 'bg-forest/10 text-forest'
                    : 'text-charcoal/70 hover:text-forest hover:bg-forest/5'
                )}
              >
                {t(key)}
              </Link>
            ))}
          </nav>

          {/* Right side: lang switcher + book CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href={otherLocalePath}
              className="text-sm text-brown/70 hover:text-forest transition-colors font-medium uppercase tracking-wide"
              aria-label={`Passer en ${otherLocale === 'fr' ? 'français' : 'English'}`}
            >
              {otherLocale.toUpperCase()}
            </Link>
            <Link
              href={localizedHref('/experiences')}
              className="btn-primary text-sm py-2 px-5"
            >
              {t('book')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-charcoal hover:bg-forest/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            className="lg:hidden bg-cream border-t border-sage/20 overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav
              aria-label="Navigation mobile"
              className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1"
            >
              {navLinks.map(({ key, href }) => (
                <Link
                  key={key}
                  href={localizedHref(href)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(href)
                      ? 'bg-forest/10 text-forest'
                      : 'text-charcoal/70 hover:text-forest hover:bg-forest/5'
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {t(key)}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3 border-t border-sage/20 mt-2">
                <Link
                  href={otherLocalePath}
                  className="text-sm text-brown/70 hover:text-forest transition-colors font-medium uppercase tracking-wide"
                  onClick={() => setMobileOpen(false)}
                >
                  {otherLocale.toUpperCase()}
                </Link>
                <Link
                  href={localizedHref('/experiences')}
                  className="btn-primary text-sm py-2 px-5"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('book')}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
