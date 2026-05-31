'use client'

import { useReducedMotion } from 'framer-motion'
import { Suspense, useEffect, useState, useCallback, type ReactNode } from 'react'

interface ThreeSceneWrapperProps {
  children: (opts: { onContextLost: () => void; isMobile: boolean }) => ReactNode
  fallback?: ReactNode
  className?: string
  height?: string
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

/**
 * Safe wrapper for all Three.js canvas scenes.
 * Checks WebGL availability, reduced-motion, and tracks context loss.
 * Children receive { onContextLost, isMobile } to wire into their Canvas.
 */
export function ThreeSceneWrapper({
  children,
  fallback = null,
  className = '',
  height = '100%',
}: ThreeSceneWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hasWebGL, setHasWebGL] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [contextLost, setContextLost] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const handleContextLost = useCallback(() => {
    setContextLost(true)
  }, [])

  useEffect(() => {
    setMounted(true)
    setHasWebGL(detectWebGL())
    setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768)
  }, [])

  if (!mounted || !hasWebGL || shouldReduceMotion || contextLost) {
    return <>{fallback}</>
  }

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ height }}
    >
      <Suspense fallback={null}>
        {children({ onContextLost: handleContextLost, isMobile })}
      </Suspense>
    </div>
  )
}
