import React from 'react'

interface BotanicalAccentProps {
  variant?: 'leaf' | 'branch' | 'vine'
  color?: string
  size?: number
  className?: string
  opacity?: number
}

export function BotanicalAccent({
  variant = 'leaf',
  color = '#556B45',
  size = 120,
  className = '',
  opacity = 0.18
}: BotanicalAccentProps) {
  const paths: Record<string, string> = {
    leaf: 'M10 80 C10 40, 40 10, 80 10 C80 50, 50 80, 10 80Z M10 80 L80 10',
    branch: 'M5 90 Q20 70 35 50 Q50 30 70 15 M35 50 Q50 45 60 35 M35 50 Q30 40 20 35',
    vine: 'M5 90 Q15 75 10 60 Q5 45 15 30 Q25 15 20 5 M10 60 Q20 58 25 50 M15 30 Q25 28 30 20',
  }
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 90 90"
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      fill="none"
    >
      <path d={paths[variant]} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
