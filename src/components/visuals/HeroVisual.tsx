'use client'

import { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useReducedMotion } from 'framer-motion'

const ImmersiveHeroScene = dynamic(() => import('./ImmersiveHeroScene'), { ssr: false })

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!ctx) return false
    // Also check we're not on a low-end device with no real GPU
    const ext = (ctx as WebGLRenderingContext).getExtension('WEBGL_lose_context')
    // Clean up the probe canvas
    ext?.loseContext()
    return true
  } catch {
    return false
  }
}

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < 768
}

export function HeroVisual() {
  const [ready, setReady] = useState(false)
  const [hasWebGL, setHasWebGL] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const shouldReduceMotion = useReducedMotion()

  const handleContextLost = useCallback(() => {
    setContextLost(true)
  }, [])

  useEffect(() => {
    setHasWebGL(detectWebGL())
    setIsMobile(isMobileViewport())
    setReady(true)
  }, [])

  const showCanvas = ready && hasWebGL && !shouldReduceMotion && !contextLost

  if (!showCanvas) {
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none hero-gradient-fallback"
      />
    )
  }

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <ImmersiveHeroScene onContextLost={handleContextLost} isMobile={isMobile} />
    </div>
  )
}
