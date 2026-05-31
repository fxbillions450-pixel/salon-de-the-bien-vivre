'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FadeIn, ImmersivePageHeader } from '@/components/home/AnimatedSections'

const eventTypes_fr = [
  'Anniversaire',
  'Baby shower',
  'Cercle bien-être',
  'Atelier privé',
  'Création de contenu',
  "Événement d'équipe",
  'Autre',
]
const eventTypes_en = [
  'Birthday',
  'Baby shower',
  'Wellness circle',
  'Private workshop',
  'Content creation',
  'Team event',
  'Other',
]

export default function LocationPriveePage() {
  const params = useParams()
  const locale = (params?.locale as string) || 'fr'
  const isFr = locale === 'fr'

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    preferredDate: '',
    preferredTime: '',
    guestCount: '',
    budgetRange: '',
    foodDrinkNeeds: '',
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
      const res = await fetch('/api/private-event-inquiry', {
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
  const eventTypes = isFr ? eventTypes_fr : eventTypes_en

  return (
    <>
      <Header />
      <main id="main-content">
        <ImmersivePageHeader
          label={isFr ? 'Location privée' : 'Private rental'}
          heading={isFr ? 'Réservez votre espace privé' : 'Book your private space'}
          subheading={isFr
            ? 'Notre salon est disponible pour vos événements privés : anniversaires, baby showers, ateliers et plus encore.'
            : 'Our salon is available for your private events: birthdays, baby showers, workshops and more.'}
        />

        {/* Event types + image */}
        <section className="py-16 section-deep" aria-labelledby="private-event-types">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <FadeIn>
                <h2 id="private-event-types" className="font-serif text-3xl text-cream mb-6">
                  {isFr ? 'Types d\'événements' : 'Event types'}
                </h2>
                <ul className="space-y-2">
                  {eventTypes.map((type) => (
                    <li key={type} className="flex items-center gap-2 text-cream/80 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta flex-shrink-0" />
                      {type}
                    </li>
                  ))}
                </ul>
              </FadeIn>
              <FadeIn delay={0.15}>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg warm-glow">
                  <Image
                    src="/images/interior-full-event.jpg"
                    alt={isFr ? 'Location privée au Salon de Thé Bien Vivre' : 'Private rental at Salon de Thé Bien Vivre'}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16 section-warm" aria-labelledby="inquiry-form-heading">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
            <h2 id="inquiry-form-heading" className="font-serif text-3xl text-forest mb-2 text-center">
              {isFr ? 'Demande de réservation' : 'Booking inquiry'}
            </h2>
            <p className="text-brown/70 text-center mb-10">
              {isFr
                ? 'Remplissez ce formulaire et nous vous contacterons dans les 48 heures.'
                : 'Fill out this form and we will contact you within 48 hours.'}
            </p>
            </FadeIn>

            {status === 'success' ? (
              <div className="bg-sage/20 rounded-2xl p-10 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-serif text-2xl text-forest mb-2">
                  {isFr ? 'Demande envoyée !' : 'Inquiry sent!'}
                </h3>
                <p className="text-brown/70">
                  {isFr
                    ? 'Merci ! Nous vous contacterons prochainement pour confirmer les détails.'
                    : 'Thank you! We will contact you soon to confirm the details.'}
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                aria-label={isFr ? 'Formulaire de demande location privée' : 'Private event inquiry form'}
                className="space-y-5 bg-white rounded-2xl p-8 shadow-sm border border-sage/10"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="inquiry-name" className={labelClass}>
                      {isFr ? 'Nom complet' : 'Full name'} *
                    </label>
                    <input
                      id="inquiry-name"
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
                    <label htmlFor="inquiry-email" className={labelClass}>
                      {isFr ? 'Courriel' : 'Email'} *
                    </label>
                    <input
                      id="inquiry-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className={labelClass}>
                    {isFr ? 'Téléphone' : 'Phone'}
                  </label>
                  <input
                    id="inquiry-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="event-type" className={labelClass}>
                    {isFr ? "Type d'événement" : 'Event type'} *
                  </label>
                  <select
                    id="event-type"
                    name="eventType"
                    required
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value })}
                    className={inputClass}
                  >
                    <option value="">{isFr ? "— Choisir un type —" : '— Select a type —'}</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="preferred-date" className={labelClass}>
                      {isFr ? 'Date souhaitée' : 'Preferred date'} *
                    </label>
                    <input
                      id="preferred-date"
                      name="preferredDate"
                      type="date"
                      required
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="preferred-time" className={labelClass}>
                      {isFr ? 'Heure souhaitée' : 'Preferred time'}
                    </label>
                    <input
                      id="preferred-time"
                      name="preferredTime"
                      type="time"
                      value={form.preferredTime}
                      onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="guest-count" className={labelClass}>
                      {isFr ? 'Nombre d\'invité·e·s' : 'Guest count'} *
                    </label>
                    <input
                      id="guest-count"
                      name="guestCount"
                      type="number"
                      min={1}
                      max={100}
                      required
                      value={form.guestCount}
                      onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="budget-range" className={labelClass}>
                      {isFr ? 'Budget approximatif' : 'Approximate budget'}
                    </label>
                    <select
                      id="budget-range"
                      name="budgetRange"
                      value={form.budgetRange}
                      onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">{isFr ? '— Sélectionner —' : '— Select —'}</option>
                      <option value="<200">Moins de 200$</option>
                      <option value="200-500">200$ – 500$</option>
                      <option value="500-1000">500$ – 1 000$</option>
                      <option value=">1000">Plus de 1 000$</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="food-drink" className={labelClass}>
                    {isFr ? 'Besoins en restauration et boissons' : 'Food & drink needs'}
                  </label>
                  <textarea
                    id="food-drink"
                    name="foodDrinkNeeds"
                    rows={3}
                    value={form.foodDrinkNeeds}
                    onChange={(e) => setForm({ ...form, foodDrinkNeeds: e.target.value })}
                    placeholder={isFr ? 'Thés, plateau de collations, allergies…' : 'Teas, snack platter, allergies…'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div>
                  <label htmlFor="private-message" className={labelClass}>
                    {isFr ? 'Message supplémentaire' : 'Additional message'}
                  </label>
                  <textarea
                    id="private-message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={isFr ? 'Décrivez votre événement…' : 'Describe your event…'}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    id="private-consent"
                    name="consent"
                    type="checkbox"
                    required
                    checked={form.consent}
                    onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest"
                  />
                  <label htmlFor="private-consent" className="text-sm text-brown/80">
                    {isFr
                      ? "J'accepte que mes informations soient utilisées pour traiter ma demande de réservation."
                      : 'I agree that my information will be used to process my booking inquiry.'}
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
                    : (isFr ? 'Envoyer ma demande' : 'Send my inquiry')}
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
