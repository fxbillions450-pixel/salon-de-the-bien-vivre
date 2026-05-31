'use client'

import { useEffect } from 'react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[ADMIN_ROUTE_ERROR]', {
      message: error.message,
      digest: error.digest,
    })
  }, [error])

  return (
    <div className="p-8">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold text-red-700 mb-2">Erreur d&apos;administration</h1>
        <p className="text-gray-600 mb-4">
          Une erreur est survenue lors du chargement de cette page.
          {error.digest && (
            <span className="block text-xs text-gray-400 mt-1">digest: {error.digest}</span>
          )}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-forest text-cream rounded-lg text-sm hover:bg-forest/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
