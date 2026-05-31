'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const ImmersiveHeroScene = dynamic(() => import('./ImmersiveHeroScene'), { ssr: false })

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch { return false }
}

export function HeroVisual() {
  const [ready, setReady] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    setHasWebGL(detectWebGL())
    setReady(true)
    const canvas = document.querySelector('canvas')
    const handler = () => setHasWebGL(false)
    canvas?.addEventListener('webglcontextlost', handler)
    return () => canvas?.removeEventListener('webglcontextlost', handler)
  }, [])

  if (!ready || !hasWebGL || shouldReduceMotion) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hero-gradient-fallback"
      />
    )
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <ImmersiveHeroScene />
    </div>
  )
}
