'use client'

import { useEffect, useRef, useState } from 'react'
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
  const [particleCount, setParticleCount] = useState(40)
  const containerRef = useRef<HTMLDivElement>(null)

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
      setParticleCount(20)
    }

    setReady('webgl')
  }, [])

  // Handle WebGL context loss after canvas is mounted
  useEffect(() => {
    if (ready !== 'webgl') return
    const container = containerRef.current
    if (!container) return
    const canvas = container.querySelector('canvas')
    if (!canvas) return
    const handleContextLost = (e: Event) => {
      e.preventDefault()
      setReady('fallback')
    }
    canvas.addEventListener('webglcontextlost', handleContextLost)
    return () => canvas.removeEventListener('webglcontextlost', handleContextLost)
  }, [ready])

  if (ready === 'pending') return null
  if (ready === 'fallback') return <CSSFallback />

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-0"
      style={{ pointerEvents: 'none' }}
    >
      <AmbientHeroCanvas particleCount={particleCount} />
    </div>
  )
}
