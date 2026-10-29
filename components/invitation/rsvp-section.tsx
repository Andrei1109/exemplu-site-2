import { invitationConfig as config } from '@/lib/invitation-config'
import type { ResolvedGuest } from '@/lib/invitation-utils'
import { Artwork } from './artwork'
import { Breeze, Reveal } from './reveal'
import { RSVPForm } from './rsvp-form'

export function RSVPSection({ guest }: { guest: ResolvedGuest }) {
  if (!config.rsvp.enabled) return null
  return (
    <section id="rsvp" aria-labelledby="rsvp-title" className="relative scroll-mt-6 overflow-hidden bg-muted px-5 py-24 md:py-32">
      <div className="pointer-events-none absolute -top-6 -left-16 w-60 opacity-90 md:w-80" aria-hidden="true">
        <Breeze>
          <Artwork
            asset={config.images.lemonBranch}
            className="aspect-[1376/686] w-full -scale-x-100"
            imageClassName="object-contain"
            sizes="320px"
            fallback={<span />}
          />
        </Breeze>
      </div>

      <div className="relative mx-auto flex max-w-2xl flex-col gap-12">
        <Reveal className="flex flex-col items-center gap-4 pt-16 text-center md:pt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">R.S.V.P.</p>
          <h2 id="rsvp-title" className="font-serif text-4xl leading-tight text-balance md:text-6xl">
            Confirmă prezența
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-pretty">
            Ne ajută enorm să știm din timp cine ni se alătură. Durează mai puțin de un minut.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <RSVPForm guestName={guest.displayName} inviteToken={guest.token} maxCompanions={guest.maxCompanions} />
        </Reveal>
      </div>
    </section>
  )
}
