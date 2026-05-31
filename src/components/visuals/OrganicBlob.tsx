'use client'

interface OrganicBlobProps {
  color?: string
  size?: number
  opacity?: number
  className?: string
  delay?: number
}

export function OrganicBlob({
  color = '#C96F4A',
  size = 400,
  opacity = 0.12,
  className = '',
  delay = 0
}: OrganicBlobProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute rounded-full animate-blob ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}${Math.round(opacity*255).toString(16).padStart(2,'0')} 0%, transparent 70%)`,
        filter: 'blur(40px)',
        animationDelay: `${delay}s`,
      }}
    />
  )
}
