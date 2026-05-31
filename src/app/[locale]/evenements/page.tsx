'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function EvenementsPage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const isFr = locale === 'fr'

  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    instagram: '',
    productType: '',
    preferredDate: '',
    spaceNeeds: '',
    message: '',
    consent: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/vendor-application', {
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

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero */}
        <section className="bg-forest py-16" aria-labelledby="events-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 id="events-heading" className="font-serif text-4xl md:text-5xl text-cream mb-4">
              {isFr ? 'Pop-ups & Événements' : 'Pop-ups & Events'}
            </h1>
            <p className="text-cream/70 text-lg max-w-2xl mx-auto">
              {isFr
                ? 'Découvrez nos prochains pop-ups et participez en tant que vendeur·se ou visiteur·se.'
                : 'Discover our upcoming pop-ups and participate as a vendor or visitor.'}
            </p>
          </div>
        </section>

        {/* Upcoming events placeholder */}
        <section className="py-16 bg-cream" aria-labelledby="upcoming-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="upcoming-heading" className="font-serif text-3xl text-forest mb-6 text-center">
              {isFr ? 'Événements à venir' : 'Upcoming events'}
            </h2>
            <div className="bg-white rounded-2xl border-2 border-dashed border-sage/40 p-12 text-center">
              <div className="text-5xl mb-4">🌸</div>
              <p className="text-lg font-medium text-forest mb-2">
                {isFr
                  ? 'Pop-ups & événements à venir — restez à l\'affût !'
                  : 'Pop-ups & events coming soon — stay tuned!'}
              </p>
              <p className="text-brown/70 mb-6">
                {isFr
                  ? 'Inscrivez-vous à notre infolettre pour être les premiers informé·e·s.'
                  : 'Subscribe to our newsletter to be the first to know.'}
              </p>
              <Link
                href={`/${locale}/#newsletter`}
                className="inline-flex bg-terracotta text-white font-medium px-6 py-3 rounded-full hover:bg-brown transition-colors"
              >
                {isFr ? "S'inscrire à l'infolettre" : 'Subscribe to newsletter'}
              </Link>
            </div>
          </div>
        </section>

        {/* Vendor application */}
        <section className="py-16 bg-white" aria-labelledby="vendor-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="vendor-heading" className="font-serif text-3xl text-forest mb-4">
                {isFr ? 'Devenir vendeur·se' : 'Become a vendor'}
              </h2>
              <p className="text-brown/70">
                {isFr
                  ? 'Vous avez une marque, un produit ou un service en lien avec notre univers ? Proposez votre candidature pour participer à nos pop-ups.'
                  : 'Do you have a brand, product or service related to our universe? Submit your application to participate in our pop-ups.'}
              </p>
            </div>

            {status === 'success' ? (
              <div className="bg-sage/20 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-serif text-2xl text-forest mb-2">
                  {isFr ? 'Candidature envoyée !' : 'Application sent!'}
                </h3>
                <p className="text-brown/70">
                  {isFr
                    ? 'Merci pour votre intérêt. Nous vous contacterons prochainement.'
                    : 'Thank you for your interest. We will contact you soon.'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={isFr ? 'Formulaire de candidature vendeur' : 'Vendor application form'}
                className="space-y-5 bg-cream/50 rounded-2xl p-8 border border-sage/20"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="business-name" className={labelClass}>
                      {isFr ? 'Nom de l\'entreprise' : 'Business name'} *
                    </label>
                    <input
                      id="business-name"
                      name="businessName"
                      type="text"
                      autoComplete="organization"
                      required
                      value={form.businessName}
                      onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>
                      {isFr ? 'Nom du contact' : 'Contact name'} *
                    </label>
                    <input
                      id="contact-name"
                      name="contactName"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="vendor-email" className={labelClass}>
                      {isFr ? 'Courriel' : 'Email'} *
                    </label>
                    <input
                      id="vendor-email"
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
                    <label htmlFor="vendor-phone" className={labelClass}>
                      {isFr ? 'Téléphone' : 'Phone'}
                    </label>
                    <input
                      id="vendor-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="vendor-instagram" className={labelClass}>
                    Instagram
                  </label>
                  <input
                    id="vendor-instagram"
                    name="instagram"
                    type="text"
                    autoComplete="off"
                    placeholder="@votre_compte"
                    value={form.instagram}
                    onChange={(e) => setForm({ ...form, instagram: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="product-type" className={labelClass}>
                    {isFr ? 'Type de produit / service' : 'Product / service type'} *
                  </label>
                  <select
                    id="product-type"
                    name="productType"
                    required
                    value={form.productType}
                    onChange={(e) => setForm({ ...form, productType: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{isFr ? '— Choisir une catégorie —' : '— Select a category —'}</option>
                    <option value="alimentation">Alimentation</option>
                    <option value="mode">{isFr ? 'Mode & accessoires' : 'Fashion & accessories'}</option>
                    <option value="art">{isFr ? 'Art & artisanat' : 'Art & crafts'}</option>
                    <option value="bien-etre">{isFr ? 'Bien-être & beauté' : 'Wellness & beauty'}</option>
                    <option value="plantes">Plantes</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="preferred-date" className={labelClass}>
                    {isFr ? 'Date souhaitée' : 'Preferred date'}
                  </label>
                  <input
                    id="preferred-date"
                    name="preferredDate"
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="space-needs" className={labelClass}>
                    {isFr ? 'Besoins en espace' : 'Space needs'}
                  </label>
                  <textarea
                    id="space-needs"
                    name="spaceNeeds"
                    rows={3}
                    value={form.spaceNeeds}
                    onChange={(e) => setForm({ ...form, spaceNeeds: e.target.value })}
                    placeholder={isFr ? 'Table, espace, électricité, etc.' : 'Table, space, electricity, etc.'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="vendor-message" className={labelClass}>
                    {isFr ? 'Message' : 'Message'}
                  </label>
                  <textarea
                    id="vendor-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isFr ? 'Parlez-nous de votre entreprise...' : 'Tell us about your business...'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="vendor-consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest"
                  />
                  <label htmlFor="vendor-consent" className="text-sm text-brown/80">
                    {isFr
                      ? "J'accepte que mes informations soient utilisées pour traiter ma candidature."
                      : 'I agree that my information will be used to process my application.'}
                  </label>
                </div>

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
                    : (isFr ? 'Envoyer ma candidature' : 'Send my application')}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
