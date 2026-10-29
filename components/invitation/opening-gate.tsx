'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { invitationConfig as config } from '@/lib/invitation-config'
import { formatDayMonthYear } from '@/lib/invitation-utils'
import { Artwork } from './artwork'

type OpeningGateProps = {
  guestName: string | null
  onOpened: () => void
}

export function OpeningGate({ guestName, onOpened }: OpeningGateProps) {
  const [opening, setOpening] = useState(false)
  const reduceMotion = useReducedMotion()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    buttonRef.current?.focus({ preventScroll: true })
    return () => {
      root.style.overflow = previous
    }
  }, [])

  function open() {
    if (opening) return
    if (reduceMotion) {
      onOpened()
      return
    }
    setOpening(true)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      className="paper-grain fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-background px-6"
      initial={false}
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, delay: opening ? 0.75 : 0, ease: 'easeOut' }}
      onAnimationComplete={() => {
        if (opening) onOpened()
      }}
    >
      <div className="awning absolute inset-x-0 top-0 h-12" aria-hidden="true" />

      <motion.div
        className="flex flex-col items-center gap-7 text-center"
        animate={opening ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {guestName ? 'O cartolină pentru' : 'O cartolină de vară'}
          {guestName && <span className="mt-2 block font-serif text-lg normal-case tracking-normal text-foreground italic">{guestName}</span>}
        </p>
      </motion.div>

      <motion.div
        className="relative my-7 w-[min(62vw,17rem)] rounded-t-full border-2 border-sea p-2"
        animate={opening ? { scale: 7, borderColor: 'rgba(0,0,0,0)' } : { scale: 1 }}
        transition={{ duration: 1.25, ease: [0.65, 0, 0.35, 1] }}
        style={{ maxHeight: '48vh', aspectRatio: '2 / 3' }}
      >
        <Artwork
          asset={config.images.hero}
          className="size-full rounded-t-full"
          sizes="(max-width: 640px) 62vw, 272px"
          priority
        />
      </motion.div>

      <motion.div
        className="flex flex-col items-center gap-5 text-center"
        animate={opening ? { opacity: 0, y: -12 } : { opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h2 id="gate-title" className="font-serif text-4xl leading-tight text-balance sm:text-5xl" style={{ fontVariationSettings: '"SOFT" 100, "WONK" 1' }}>
          {config.couple.partnerOne} <span className="italic text-terracotta">&amp;</span> {config.couple.partnerTwo}
        </h2>
        <p className="text-sm tracking-wide text-muted-foreground">{formatDayMonthYear(config.weddingDate, config)}</p>
        <button
          ref={buttonRef}
          type="button"
          onClick={open}
          className="rounded-full bg-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-terracotta disabled:opacity-70"
          disabled={opening}
        >
          Deschide invitația
        </button>
      </motion.div>
    </motion.div>
  )
}
