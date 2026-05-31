'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

const AmbientHeroCanvas = dynamic(
  () => import('./AmbientHeroCanvas').then((m) => m.AmbientHeroCanvas),
  { ssr: false }
)

function CSSFallback() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 hero-gradient-fallback"
      style={{ pointerEvents: 'none' }}
    />
  )
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    const ctx =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!ctx
  } catch {
    return false
  }
}

export function HeroVisual() {
  const [ready, setReady] = useState<'pending' | 'webgl' | 'fallback'>('pending')
  const [particleCount, setParticleCount] = useState(60)

  useEffect(() => {
    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      setReady('fallback')
      return
    }

    // Detect WebGL support
    if (!detectWebGL()) {
      setReady('fallback')
      return
    }

    // Reduce particle count on mobile
    if (window.innerWidth < 768) {
      setParticleCount(30)
    }

    setReady('webgl')

    // Pause on visibility change
    const handleVisibility = () => {
      // The R3F canvas handles its own RAF; no explicit pause needed,
      // but we can swap to fallback if we wanted. Currently a no-op.
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  if (ready === 'pending') return null
  if (ready === 'fallback') return <CSSFallback />

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    >
      <AmbientHeroCanvas particleCount={particleCount} />
    </div>
  )
}
