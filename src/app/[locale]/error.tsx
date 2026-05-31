'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ROUTE_ERROR]', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-cream">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-serif text-forest mb-3">Une erreur est survenue</h1>
        <p className="text-brown/70 mb-6">
          La page n&apos;a pas pu être chargée correctement. Veuillez réessayer.
        </p>
        <button
          onClick={reset}
          className="btn-primary"
        >
          Réessayer
        </button>
      </div>
    </main>
  )
}
