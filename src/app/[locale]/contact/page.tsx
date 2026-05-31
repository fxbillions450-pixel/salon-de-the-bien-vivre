'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { MapPin, Clock, Phone, Mail } from 'lucide-react'
import { FadeIn, ImmersivePageHeader, ScrollReveal } from '@/components/home/AnimatedSections'

export default function ContactPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const isFr = locale === 'fr'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    message: '',
    turnstileToken: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
        setErrorMsg(isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.')
      }
    } catch {
      setStatus('error')
      setErrorMsg(isFr ? 'Une erreur réseau est survenue.' : 'A network error occurred.')
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-sage/40 bg-cream/50 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal placeholder-brown/40'
  const labelClass = 'block text-sm font-medium text-charcoal mb-1'

  const categories_fr = [
    'Question générale',
    'Réservation',
    'Événement privé',
    'Atelier',
    'Pop-up / collaboration',
    'Médias',
    'Autre',
  ]
  const categories_en = [
    'General question',
    'Reservation',
    'Private event',
    'Workshop',
    'Pop-up / collaboration',
    'Media',
    'Other',
  ]
  const categories = isFr ? categories_fr : categories_en

  return (
    <>
      <Header />
      <main id="main-content">
        <ImmersivePageHeader
          label={isFr ? 'Contact' : 'Contact'}
          heading={isFr ? 'Nous contacter' : 'Contact us'}
          subheading={isFr
            ? 'Une question, une réservation, un projet ? Nous sommes là.'
            : 'A question, a reservation, a project? We are here.'}
        />

        <section className="py-16 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Left: Info */}
              <FadeIn className="w-full">
                <h2 className="font-serif text-2xl text-forest mb-6">
                  {isFr ? 'Informations pratiques' : 'Practical information'}
                </h2>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-charcoal">1951 Rue Saint-Zotique Est</p>
                      <p className="text-sm text-brown/70">Montréal, QC</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-charcoal">
                        {isFr ? 'Horaires' : 'Hours'}
                      </p>
                      <p className="text-sm text-brown/70">
                        {isFr ? '[Horaires à configurer par l\'administrateur]' : '[Hours to be configured by administrator]'}
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-charcoal">
                        {isFr ? 'Téléphone' : 'Phone'}
                      </p>
                      <a href="tel:+15148296912" className="text-sm text-brown/70 hover:text-terracotta transition-colors">
                        514 829-6912
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <div>
                      <p className="font-medium text-charcoal">Instagram</p>
                      <a
                        href="https://www.instagram.com/salondethe.bienvivre"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brown/70 hover:text-terracotta transition-colors"
                      >
                        @salondethe.bienvivre
                      </a>
                    </div>
                  </li>
                </ul>

                {/* Google Maps embed — no API key required */}
                <div className="rounded-2xl overflow-hidden aspect-video mb-6 shadow-md border border-oat">
                  <iframe
                    src="https://www.google.com/maps?q=1951+Rue+Saint-Zotique+Est,+Montr%C3%A9al,+QC+H2G+1K9&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={isFr ? 'Salon de Thé Bien Vivre sur Google Maps' : 'Salon de Thé Bien Vivre on Google Maps'}
                  />
                </div>

                <a
                  href="https://maps.google.com/?q=1951+Rue+Saint-Zotique+Est,+Montréal,+QC"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-cocoa font-medium transition-colors mb-6"
                >
                  <MapPin className="w-4 h-4" />
                  {isFr ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}
                </a>

                <div className="bg-white rounded-xl p-4 border border-sage/20 text-sm text-brown/70">
                  <p className="font-medium text-charcoal mb-1">
                    {isFr ? 'Transport en commun' : 'Public transit'}
                  </p>
                  <p>
                    {isFr
                      ? 'Métro Rosemont (ligne orange) · Bus 97 Saint-Zotique'
                      : 'Rosemont metro (orange line) · Bus 97 Saint-Zotique'}
                  </p>
                </div>
              </FadeIn>

              {/* Right: Form */}
              <FadeIn delay={0.15} className="w-full">
                <h2 className="font-serif text-2xl text-forest mb-6">
                  {isFr ? 'Envoyer un message' : 'Send a message'}
                </h2>

                {status === 'success' ? (
                  <div className="bg-sage/20 rounded-2xl p-10 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-serif text-2xl text-forest mb-2">
                      {isFr ? 'Message envoyé !' : 'Message sent!'}
                    </h3>
                    <p className="text-brown/70">
                      {isFr
                        ? 'Merci pour votre message. Nous vous répondrons bientôt.'
                        : 'Thank you for your message. We will reply soon.'}
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    aria-label={isFr ? 'Formulaire de contact' : 'Contact form'}
                    className="space-y-5"
                  >
                    <div>
                      <label htmlFor="contact-name" className={labelClass}>
                        {isFr ? 'Nom complet' : 'Full name'} *
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className={labelClass}>
                        {isFr ? 'Courriel' : 'Email'} *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-phone" className={labelClass}>
                        {isFr ? 'Téléphone (optionnel)' : 'Phone (optional)'}
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-category" className={labelClass}>
                        {isFr ? 'Objet de votre demande' : 'Subject of your request'}
                      </label>
                      <select
                        id="contact-category"
                        name="category"
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className={inputClass}
                      >
                        <option value="">{isFr ? '— Choisir —' : '— Select —'}</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className={labelClass}>
                        {isFr ? 'Message' : 'Message'} *
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        required
                        minLength={10}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder={isFr ? 'Votre message…' : 'Your message…'}
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    {/* Turnstile placeholder */}
                    <div className="bg-cream/80 rounded-xl p-3 border border-dashed border-sage/30">
                      <p className="text-xs text-brown/50 text-center">
                        [Cloudflare Turnstile — à configurer]
                      </p>
                      <input type="hidden" name="turnstileToken" value="" />
                    </div>

                    <p className="text-xs text-brown/50">
                      {isFr
                        ? <>Vos informations sont protégées. Consultez notre{' '}<Link href={`/${locale}/politique-de-confidentialite`} className="underline hover:text-forest">politique de confidentialité</Link>.</>
                        : <>Your information is protected. See our{' '}<Link href={`/${locale}/politique-de-confidentialite`} className="underline hover:text-forest">privacy policy</Link>.</>}
                    </p>

                    {status === 'error' && (
                      <p role="alert" className="text-sm text-red-600">
                        {errorMsg}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-terracotta text-white font-medium py-3 rounded-full hover:bg-brown transition-colors disabled:opacity-50"
                    >
                      {status === 'loading'
                        ? (isFr ? 'Envoi en cours…' : 'Sending…')
                        : (isFr ? 'Envoyer le message' : 'Send message')}
                    </button>
                  </form>
                )}
              </FadeIn>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
