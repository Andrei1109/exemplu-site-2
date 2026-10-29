'use client'

import { motion, type HTMLMotionProps } from 'motion/react'

const breezeEase = [0.22, 0.61, 0.36, 1] as const

type RevealProps = HTMLMotionProps<'div'> & { delay?: number }

export function Reveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease: breezeEase, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Soft mask wipe — illustrations surface like a postcard pulled from an envelope. */
export function MaskReveal({ delay = 0, children, ...rest }: RevealProps) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0% 0% 0%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease: breezeEase, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Slow sea-breeze sway for botanical illustrations. Disabled automatically under reduced motion. */
export function Breeze({ children, className, amplitude = 1.6, duration = 9 }: {
  children: React.ReactNode
  className?: string
  amplitude?: number
  duration?: number
}) {
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: '12% 40%' }}
      animate={{ rotate: [0, amplitude, -amplitude * 0.5, amplitude * 0.7, 0] }}
      transition={{ duration, ease: 'easeInOut', repeat: Infinity }}
    >
      {children}
    </motion.div>
  )
}
