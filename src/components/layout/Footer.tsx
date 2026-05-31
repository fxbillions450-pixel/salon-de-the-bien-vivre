'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Instagram, Facebook } from 'lucide-react'

export function Footer() {
  const t = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tNewsletter = useTranslations('newsletter')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const localizedHref = (path: string) => `/${locale}${path}`

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, turnstileToken: 'footer-signup' }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer className="bg-charcoal text-cream/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link
              href={localizedHref('/')}
              className="inline-flex items-center gap-2 mb-3"
              aria-label="Salon de Thé Bien Vivre — Accueil"
            >
              <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center">
                <span className="text-forest text-xs font-serif font-bold">BV</span>
              </div>
              <span className="font-serif text-xl text-cream">Bien Vivre</span>
            </Link>
            <p className="text-sm text-cream/60 mb-4">{t('tagline')}</p>
            <div className="flex gap-3">
              <a
                href="[LIEN INSTAGRAM À DÉFINIR]"
                aria-label="Instagram"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="[LIEN FACEBOOK À DÉFINIR]"
                aria-label="Facebook"
                className="p-2 rounded-full bg-cream/10 hover:bg-cream/20 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wider">
              {t('navigation')}
            </h3>
            <ul className="space-y-2">
              {[
                { key: 'menu', href: '/menu' },
                { key: 'experiences', href: '/experiences' },
                { key: 'workshops', href: '/ateliers' },
                { key: 'wellness', href: '/bien-etre' },
                { key: 'events', href: '/evenements' },
                { key: 'private', href: '/location-privee' },
                { key: 'about', href: '/a-propos' },
                { key: 'gallery', href: '/galerie' },
                { key: 'contact', href: '/contact' },
                { key: 'faq', href: '/faq' },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={localizedHref(href)}
                    className="text-sm text-cream/60 hover:text-cream transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-cream mb-4 text-sm uppercase tracking-wider">
              {t('address')}
            </h3>
            <address className="not-italic text-sm text-cream/60 space-y-2 mb-6">
              <p>1951 Rue Saint-Zotique Est</p>
              <p>Montréal, QC</p>
              <p>[TÉLÉPHONE À DÉFINIR]</p>
              <p>[COURRIEL À DÉFINIR]</p>
            </address>

            <h3 className="font-semibold text-cream mb-2 text-sm uppercase tracking-wider">
              {t('hours')}
            </h3>
            <p className="text-sm text-cream/60">[HORAIRES À DÉFINIR]</p>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-cream mb-2 text-sm uppercase tracking-wider">
              {tNewsletter('title')}
            </h3>
            <p className="text-sm text-cream/60 mb-4">{tNewsletter('subtitle')}</p>
            {status === 'success' ? (
              <p className="text-sm text-sage">{tNewsletter('success')}</p>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div>
                  <label htmlFor="footer-email" className="sr-only">
                    {tNewsletter('email_placeholder')}
                  </label>
                  <input
                    id="footer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={tNewsletter('email_placeholder')}
                    className="w-full px-4 py-2 rounded-lg bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 text-sm focus:outline-none focus:ring-2 focus:ring-sage"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary text-sm py-2 disabled:opacity-50"
                >
                  {status === 'loading' ? '…' : tNewsletter('submit')}
                </button>
                {status === 'error' && (
                  <p role="alert" className="text-xs text-red-400">{tNewsletter('error')}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cream/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">
            {t('copyright').replace('{year}', new Date().getFullYear().toString())}
          </p>
          <div className="flex gap-4 text-xs">
            <Link
              href={localizedHref('/politique-de-confidentialite')}
              className="text-cream/40 hover:text-cream/70 transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={localizedHref('/conditions-utilisation')}
              className="text-cream/40 hover:text-cream/70 transition-colors"
            >
              {t('terms')}
            </Link>
            <Link
              href={localizedHref('/politique-annulation')}
              className="text-cream/40 hover:text-cream/70 transition-colors"
            >
              {t('cancellation')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
