'use client'

import { useState } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder'
import { FormField } from '@/components/ui/FormField'
import { Button } from '@/components/ui/Button'
import { Clock, Users, ChevronLeft, CheckCircle } from 'lucide-react'

// Placeholder data — replace with DB fetch
const placeholderExperience = {
  id: 'placeholder',
  title_fr: '[Titre de l\'expérience]',
  title_en: '[Experience title]',
  description_fr: '[Description complète de l\'expérience à définir. Expliquez ce que les participants vont vivre, apprendre, ressentir.]',
  description_en: '[Full experience description to be defined. Explain what participants will experience, learn, feel.]',
  instructor_name: '[NOM INSTRUCTEUR·RICE]',
  duration_minutes: 60,
  capacity: 12,
  price_cents: 0,
  price_display: '[PRIX À DÉFINIR]',
  included_fr: '[Ce qui est inclus à définir : matériel, thé, etc.]',
  included_en: '[What is included to be defined: materials, tea, etc.]',
  requirements_fr: '[Ce qu\'il faut apporter ou savoir à définir]',
  requirements_en: '[What to bring or know to be defined]',
  status: 'published',
}

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  quantity: number
  notes: string
  consentTerms: boolean
}

const initialForm: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  quantity: 1,
  notes: '',
  consentTerms: false,
}

export default function ExperienceDetailPage() {
  const params = useParams()
  const locale = (params.locale as string) || 'fr'
  const isFr = locale === 'fr'

  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const exp = placeholderExperience

  const validate = () => {
    const newErrors: Partial<Record<keyof FormState, string>> = {}
    if (!form.firstName.trim()) newErrors.firstName = isFr ? 'Champ obligatoire' : 'Required'
    if (!form.lastName.trim()) newErrors.lastName = isFr ? 'Champ obligatoire' : 'Required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = isFr ? 'Courriel invalide' : 'Invalid email'
    if (!form.phone.trim()) newErrors.phone = isFr ? 'Champ obligatoire' : 'Required'
    if (!form.consentTerms) newErrors.consentTerms = isFr ? 'Vous devez accepter les conditions' : 'You must accept the terms'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setStatus('loading')
    setErrorMsg('')

    try {
      // In a real implementation, this would:
      // 1. Get a Square payment nonce from the web payment SDK
      // 2. POST to /api/reservations/create
      // For now, show a placeholder success
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg(isFr ? 'Une erreur est survenue. Veuillez réessayer.' : 'An error occurred. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <>
        <Header />
        <main id="main-content">
          <div className="min-h-screen flex items-center justify-center bg-cream py-20">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-forest" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-serif text-forest mb-4">
                {isFr ? 'Réservation confirmée !' : 'Reservation confirmed!'}
              </h1>
              <p className="text-brown/70 mb-8">
                {isFr
                  ? 'Un courriel de confirmation vous a été envoyé.'
                  : 'A confirmation email has been sent to you.'}
              </p>
              <Link href={`/${locale}/experiences`} className="btn-primary">
                {isFr ? 'Voir toutes les expériences' : 'View all experiences'}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href={`/${locale}/experiences`}
            className="inline-flex items-center gap-2 text-sm text-brown/70 hover:text-forest transition-colors mb-6"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            {isFr ? 'Retour aux expériences' : 'Back to experiences'}
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Details */}
            <div>
              <ImagePlaceholder
                label={isFr ? exp.title_fr : exp.title_en}
                aspectRatio="aspect-[4/3]"
                className="mb-6"
              />
              <h1 className="text-4xl font-serif text-forest mb-4">
                {isFr ? exp.title_fr : exp.title_en}
              </h1>
              <div className="flex items-center gap-4 text-sm text-brown/60 mb-6">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {exp.duration_minutes} min
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  {isFr ? `Max ${exp.capacity} pers.` : `Max ${exp.capacity} people`}
                </span>
                <span className="font-semibold text-forest text-base">{exp.price_display}</span>
              </div>
              <p className="text-brown/80 leading-relaxed mb-6">
                {isFr ? exp.description_fr : exp.description_en}
              </p>
              {exp.instructor_name && (
                <div className="mb-4">
                  <h2 className="font-semibold text-forest mb-1">
                    {isFr ? 'Animateur·rice' : 'Instructor'}
                  </h2>
                  <p className="text-brown/70">{exp.instructor_name}</p>
                </div>
              )}
              <div className="mb-4">
                <h2 className="font-semibold text-forest mb-1">
                  {isFr ? 'Ce qui est inclus' : "What's included"}
                </h2>
                <p className="text-brown/70">{isFr ? exp.included_fr : exp.included_en}</p>
              </div>
              <div>
                <h2 className="font-semibold text-forest mb-1">
                  {isFr ? "Ce qu'il faut apporter" : 'What to bring'}
                </h2>
                <p className="text-brown/70">{isFr ? exp.requirements_fr : exp.requirements_en}</p>
              </div>
            </div>

            {/* Right: Booking form */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-8 sticky top-24">
                <h2 className="text-2xl font-serif text-forest mb-6">
                  {isFr ? 'Réserver' : 'Book now'}
                </h2>
                <form onSubmit={handleSubmit} noValidate aria-label={isFr ? 'Formulaire de réservation' : 'Booking form'}>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        id="firstName"
                        label={isFr ? 'Prénom' : 'First name'}
                        required
                        error={errors.firstName}
                      >
                        <input
                          id="firstName"
                          name="firstName"
                          type="text"
                          autoComplete="given-name"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                          className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                        />
                      </FormField>
                      <FormField
                        id="lastName"
                        label={isFr ? 'Nom' : 'Last name'}
                        required
                        error={errors.lastName}
                      >
                        <input
                          id="lastName"
                          name="lastName"
                          type="text"
                          autoComplete="family-name"
                          required
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                          className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                        />
                      </FormField>
                    </div>

                    <FormField
                      id="email"
                      label={isFr ? 'Courriel' : 'Email'}
                      required
                      error={errors.email}
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                      />
                    </FormField>

                    <FormField
                      id="phone"
                      label={isFr ? 'Téléphone' : 'Phone'}
                      required
                      error={errors.phone}
                    >
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                      />
                    </FormField>

                    <FormField
                      id="quantity"
                      label={isFr ? 'Nombre de places' : 'Number of spots'}
                      required
                    >
                      <select
                        id="quantity"
                        name="quantity"
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </FormField>

                    <FormField
                      id="notes"
                      label={isFr ? 'Notes ou demandes spéciales' : 'Notes or special requests'}
                    >
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        placeholder={
                          isFr
                            ? 'Allergies, mobilité réduite, occasion spéciale…'
                            : 'Allergies, mobility needs, special occasion…'
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-sage/40 bg-cream/30 focus:outline-none focus:ring-2 focus:ring-forest text-charcoal resize-none"
                      />
                    </FormField>

                    {/* Payment placeholder */}
                    <div className="bg-sage/10 rounded-xl p-4 border border-dashed border-sage/40">
                      <p className="text-sm font-medium text-forest mb-1">
                        {isFr ? 'Paiement sécurisé' : 'Secure payment'}
                      </p>
                      <p className="text-xs text-brown/60">
                        {isFr
                          ? '[Widget de paiement Square à intégrer ici. Votre paiement est traité de manière sécurisée.]'
                          : '[Square payment widget to be integrated here. Your payment is processed securely.]'}
                      </p>
                    </div>

                    {/* Turnstile placeholder */}
                    <div className="bg-cream/50 rounded-xl p-3 border border-dashed border-sage/30">
                      <p className="text-xs text-brown/50 text-center">
                        [Turnstile CAPTCHA widget]
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <input
                        id="consentTerms"
                        name="consentTerms"
                        type="checkbox"
                        required
                        checked={form.consentTerms}
                        onChange={(e) => setForm({ ...form, consentTerms: e.target.checked })}
                        aria-describedby={errors.consentTerms ? 'consentTerms-error' : undefined}
                        className="mt-1 w-4 h-4 rounded border-sage/40 text-forest focus:ring-forest"
                      />
                      <label htmlFor="consentTerms" className="text-sm text-brown/80">
                        {isFr
                          ? "J'accepte les conditions d'utilisation et la politique d'annulation"
                          : 'I accept the terms of use and the cancellation policy'}
                      </label>
                    </div>
                    {errors.consentTerms && (
                      <p id="consentTerms-error" role="alert" className="text-sm text-red-600">
                        {errors.consentTerms}
                      </p>
                    )}

                    <div className="flex items-center justify-between border-t border-sage/20 pt-4">
                      <div>
                        <p className="text-xs text-brown/60">{isFr ? 'Total' : 'Total'}</p>
                        <p className="font-semibold text-forest">{exp.price_display}</p>
                      </div>
                      <Button type="submit" isLoading={status === 'loading'} size="lg">
                        {isFr ? 'Confirmer et payer' : 'Confirm and pay'}
                      </Button>
                    </div>

                    {status === 'error' && (
                      <p role="alert" className="text-sm text-red-600 text-center">
                        {errorMsg}
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
