'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { invitationConfig as config } from '@/lib/invitation-config'
import { formatLongDate, formatPostmark, formatTime } from '@/lib/invitation-utils'
import { Artwork } from './artwork'
import { Breeze } from './reveal'

const ease = [0.22, 0.61, 0.36, 1] as const
const lively = { fontVariationSettings: '"SOFT" 100, "WONK" 1' }

export function Hero({ opened, guestName }: { opened: boolean; guestName: string | null }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  const state = opened ? 'show' : 'hidden'
  const line = {
    hidden: { opacity: 0, y: 28 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 1, ease, delay: 0.25 + i * 0.12 } }),
  }

  const [ceremony, reception] = config.venues

  return (
    <header ref={ref} className="paper-grain relative overflow-hidden">
      <div className="awning h-12 md:h-16" aria-hidden="true" />

      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pt-6 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground md:px-8">
        <span>Invitație de nuntă</span>
        <span className="tabular">{formatPostmark(config.weddingDate, config)}</span>
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-10 pb-20 md:px-8 lg:grid-cols-12 lg:gap-16 lg:pt-14 lg:pb-28">
        <div className="relative mx-auto w-full max-w-[21rem] lg:col-span-5 lg:max-w-none">
          <div className="rounded-t-full border-2 border-sea p-2.5">
            <motion.div
              className="relative aspect-[2/3] overflow-hidden rounded-t-full"
              initial={false}
              animate={opened ? { clipPath: 'inset(0% 0% 0% 0% round 999px 999px 0 0)' } : { clipPath: 'inset(18% 14% 0% 14% round 999px 999px 0 0)' }}
              transition={{ duration: 1.4, ease }}
            >
              <motion.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: imageY }}>
                <Artwork
                  asset={config.images.hero}
                  className="size-full"
                  sizes="(max-width: 1024px) 336px, 420px"
                  priority
                />
              </motion.div>
            </motion.div>
          </div>

          <motion.div
            className="pointer-events-none absolute -top-8 -right-14 w-44 sm:-right-20 sm:w-56 lg:-right-24 lg:w-64"
            initial={{ opacity: 0 }}
            animate={opened ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1.2, delay: 0.9 }}
            aria-hidden="true"
          >
            <Breeze>
              <Artwork
                asset={config.images.lemonBranch}
                className="aspect-[1376/686] w-full"
                imageClassName="object-contain"
                sizes="256px"
                fallback={<span />}
              />
            </Breeze>
          </motion.div>

          <div
            className="absolute -bottom-5 left-4 -rotate-6 bg-sun px-4 py-2 font-serif text-sm italic text-sea shadow-[0_1px_0_var(--sea)]"
            aria-hidden="true"
          >
            vara lui {config.weddingDate.slice(0, 4)}
          </div>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-7">
          {guestName && (
            <motion.p
              className="font-hand text-2xl text-terracotta"
              variants={line}
              initial="hidden"
              animate={state}
              custom={0}
            >
              Dragi {guestName},
            </motion.p>
          )}

          <motion.p
            className="max-w-md font-serif text-xl leading-snug italic text-pretty md:text-2xl"
            variants={line}
            initial="hidden"
            animate={state}
            custom={0}
          >
            {config.tagline}
          </motion.p>

          <h1 className="font-serif leading-[0.92] font-normal tracking-tight" style={lively}>
            <motion.span className="block text-[clamp(3.4rem,15vw,8.5rem)]" variants={line} initial="hidden" animate={state} custom={1}>
              {config.couple.partnerOne}
            </motion.span>
            <motion.span
              className="block pl-[0.6em] text-[clamp(3.4rem,15vw,8.5rem)]"
              variants={line}
              initial="hidden"
              animate={state}
              custom={2}
            >
              <span className="mr-[0.15em] italic text-terracotta">&amp;</span>
              {config.couple.partnerTwo}
            </motion.span>
          </h1>

          <motion.div
            className="flex flex-col gap-5 border-t border-border pt-6"
            variants={line}
            initial="hidden"
            animate={state}
            custom={3}
          >
            <p className="font-serif text-2xl md:text-3xl">{formatLongDate(config.weddingDate, config)}</p>
            <dl className="flex flex-wrap gap-3 text-sm">
              {[ceremony, reception].filter(Boolean).map((venue) => (
                <div key={venue.id} className="flex items-baseline gap-2 border border-sea px-3 py-1.5">
                  <dt className="font-semibold uppercase tracking-[0.16em] text-[0.7rem]">{venue.kind}</dt>
                  <dd className="tabular font-serif text-base">{formatTime(venue.startsAt, config)}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
              {config.rsvp.enabled && (
                <a
                  href="#rsvp"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-terracotta"
                >
                  Confirmă prezența
                </a>
              )}
              <a href="#itinerariu" className="text-sm font-semibold underline decoration-sun decoration-2 underline-offset-4 hover:decoration-terracotta">
                Vezi itinerariul zilei
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  )
}
