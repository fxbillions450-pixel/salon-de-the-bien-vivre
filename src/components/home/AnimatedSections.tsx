'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

interface FadeInSectionHeadingProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function FadeInSectionHeading({ children, className, id }: FadeInSectionHeadingProps) {
  const shouldReduceMotion = useReducedMotion()
  const variants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
      }

  return (
    <motion.h2
      id={id}
      className={className}
      variants={variants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-60px' }}
    >
      {children}
    </motion.h2>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({ children, className, staggerDelay = 0.08 }: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion()

  const containerVariants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: {},
        visible: {
          transition: { staggerChildren: staggerDelay },
        },
      }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial={shouldReduceMotion ? undefined : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion()

  const itemVariants: Variants | undefined = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease },
        },
      }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

interface HoverLiftProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article'
}

export function HoverLift({ children, className, as: Tag = 'div' }: HoverLiftProps) {
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[Tag]
  const btnHover = shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2 } }

  return (
    <MotionTag className={className} whileHover={btnHover}>
      {children}
    </MotionTag>
  )
}

interface FadeInProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease, delay }}
      viewport={{ once: true, margin: '-40px' }}
    >
      {children}
    </motion.div>
  )
}
