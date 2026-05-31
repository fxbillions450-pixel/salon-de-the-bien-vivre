'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useReducedMotion, useInView, type Variants } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

// ── FadeIn ──────────────────────────────────────────────────────────────────
export function FadeIn({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── FadeInSectionHeading ────────────────────────────────────────────────────
export function FadeInSectionHeading({ children, className = '', id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      id={id}
      className={className}
      initial={reduce ? undefined : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : reduce ? undefined : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease }}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerContainer ────────────────────────────────────────────────────────
export function StaggerContainer({ children, className = '', stagger = 0.1, staggerDelay }: { children: ReactNode; className?: string; stagger?: number; staggerDelay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduce = useReducedMotion()
  const delay = staggerDelay ?? stagger

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: delay } },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={reduce ? undefined : container}
      initial={reduce ? undefined : 'hidden'}
      animate={inView ? 'visible' : reduce ? undefined : 'hidden'}
    >
      {children}
    </motion.div>
  )
}

// ── StaggerItem ─────────────────────────────────────────────────────────────
export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
  }
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

// ── HoverLift ───────────────────────────────────────────────────────────────
export function HoverLift({ children, className = '', as: Tag = 'div' }: { children: ReactNode; className?: string; as?: 'div' | 'article' }) {
  const reduce = useReducedMotion()
  const MotionTag = motion[Tag]
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <MotionTag
      className={className}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
    >
      {children}
    </MotionTag>
  )
}

// ── TiltCard ─────────────────────────────────────────────────────────────────
export function TiltCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      whileHover={{
        rotateX: -4,
        rotateY: 4,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  )
}

// ── FloatingCard ─────────────────────────────────────────────────────────────
export function FloatingCard({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── ScrollReveal ──────────────────────────────────────────────────────────────
export function ScrollReveal({ children, className = '', direction = 'up', delay = 0 }: {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useReducedMotion()

  const dirMap = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: 40 },
    right: { x: -40 },
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reduce ? undefined : { opacity: 0, ...dirMap[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : reduce ? undefined : { opacity: 0, ...dirMap[direction] }}
      transition={{ duration: 0.8, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── AnimatedDivider ───────────────────────────────────────────────────────────
export function AnimatedDivider({ color = '#D6A84F', className = '' }: { color?: string; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  return (
    <div ref={ref} className={`flex items-center justify-center gap-4 py-4 ${className}`}>
      <motion.div
        className="h-px flex-1 max-w-20"
        style={{ background: color }}
        initial={reduce ? undefined : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : reduce ? undefined : { scaleX: 0 }}
        transition={{ duration: 0.6, ease }}
      />
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: color }}
        initial={reduce ? undefined : { scale: 0 }}
        animate={inView ? { scale: 1 } : reduce ? undefined : { scale: 0 }}
        transition={{ duration: 0.4, ease, delay: 0.3 }}
      />
      <motion.div
        className="h-px flex-1 max-w-20"
        style={{ background: color }}
        initial={reduce ? undefined : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : reduce ? undefined : { scaleX: 0 }}
        transition={{ duration: 0.6, ease }}
      />
    </div>
  )
}

// ── SectionIntro ──────────────────────────────────────────────────────────────
export function SectionIntro({
  label,
  heading,
  subheading,
  className = '',
  align = 'center'
}: {
  label?: string
  heading: string
  subheading?: string
  className?: string
  align?: 'left' | 'center'
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : ''
  return (
    <FadeInSectionHeading className={`max-w-2xl ${alignClass} ${className}`}>
      {label && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-terracotta mb-3 px-3 py-1 bg-terracotta/10 rounded-full">
          {label}
        </span>
      )}
      <h2 className="section-title">{heading}</h2>
      {subheading && <p className="section-subtitle mt-3">{subheading}</p>}
      <AnimatedDivider className="mt-4" />
    </FadeInSectionHeading>
  )
}

// ── ImmersivePageHeader ───────────────────────────────────────────────────────
export function ImmersivePageHeader({
  label,
  heading,
  subheading,
  className = '',
}: {
  label?: string
  heading: string
  subheading?: string
  className?: string
}) {
  return (
    <section className={`relative overflow-hidden py-16 lg:py-24 ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-forest via-[#1e3328] to-[#263D2B]" />
      <div aria-hidden="true" className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,111,74,0.2) 0%, transparent 70%)', filter: 'blur(30px)' }} />
      <div aria-hidden="true" className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(214,168,79,0.15) 0%, transparent 70%)', filter: 'blur(25px)' }} />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {label && (
          <motion.span
            className="inline-block text-xs font-semibold tracking-widest uppercase text-honey mb-4 px-3 py-1 bg-honey/10 rounded-full border border-honey/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {label}
          </motion.span>
        )}
        <motion.h1
          className="text-4xl lg:text-6xl font-serif text-cream mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {heading}
        </motion.h1>
        {subheading && (
          <motion.p
            className="text-lg text-cream/70 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {subheading}
          </motion.p>
        )}
      </div>
    </section>
  )
}
