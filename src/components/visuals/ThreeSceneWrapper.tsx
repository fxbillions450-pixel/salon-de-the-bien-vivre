'use client'

import { useReducedMotion } from 'framer-motion'
import { Suspense, useEffect, useState, type ReactNode } from 'react'

interface ThreeSceneWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
  height?: string
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    return !!ctx
  } catch {
    return false
  }
}

export function ThreeSceneWrapper({ children, fallback = null, className = '', height = '100%' }: ThreeSceneWrapperProps) {
  const shouldReduceMotion = useReducedMotion()
  const [hasWebGL, setHasWebGL] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    setMounted(true)
    setHasWebGL(detectWebGL())

    const handleContextLost = () => setContextLost(true)
    window.addEventListener('webglcontextlost', handleContextLost)
    return () => window.removeEventListener('webglcontextlost', handleContextLost)
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
      <Suspense fallback={null}>{children}</Suspense>
    </div>
  )
}
