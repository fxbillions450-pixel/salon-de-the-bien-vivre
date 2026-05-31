import React from 'react'
import { OrganicBlob } from './OrganicBlob'

interface WarmGradientBackgroundProps {
  variant?: 'cream' | 'sage' | 'deep' | 'honey'
  children: React.ReactNode
  blobs?: boolean
  className?: string
}

export function WarmGradientBackground({ variant = 'cream', children, blobs = true, className = '' }: WarmGradientBackgroundProps) {
  const bgMap = {
    cream: 'bg-gradient-to-br from-cream via-oat to-cream',
    sage: 'bg-gradient-to-br from-[#EDF3EA] via-[#E2EDD9] to-[#EDF3EA]',
    deep: 'bg-gradient-to-br from-forest via-[#1a2d20] to-forest',
    honey: 'bg-gradient-to-br from-[#FDF0DC] via-[#F5E0C0] to-[#FDF0DC]',
  }
  return (
    <div className={`relative overflow-hidden ${bgMap[variant]} ${className}`}>
      {blobs && (
        <>
          <OrganicBlob color="#C96F4A" size={300} opacity={0.08} className="top-[-80px] right-[-60px]" />
          <OrganicBlob color="#D6A84F" size={250} opacity={0.07} className="bottom-[-60px] left-[-40px]" delay={2} />
          {variant === 'sage' && <OrganicBlob color="#8AA66A" size={200} opacity={0.1} className="top-[30%] left-[60%]" delay={1} />}
        </>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
