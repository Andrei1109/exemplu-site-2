import { invitationConfig as config } from '@/lib/invitation-config'
import { Artwork } from './artwork'
import { Countdown } from './countdown'
import { MaskReveal, Reveal } from './reveal'

export function InvitationMessage() {
  const { invitation, couple } = config
  return (
    <section aria-labelledby="invitatie-title" className="relative px-5 py-24 md:py-32">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
        <MaskReveal className="w-56 md:w-72" aria-hidden="true">
          <Artwork
            asset={config.images.oliveBranch}
            className="aspect-[1411/421] w-full"
            imageClassName="object-contain"
            sizes="288px"
            fallback={<span />}
          />
        </MaskReveal>

        <Reveal className="flex flex-col items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">{invitation.eyebrow}</p>
          <h2 id="invitatie-title" className="font-serif text-4xl leading-tight text-balance md:text-6xl">
            {invitation.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col gap-5 text-lg leading-relaxed text-pretty md:text-xl">
          {invitation.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col items-center gap-1">
          <span className="font-hand text-3xl text-terracotta">{invitation.signOff}</span>
          <span className="font-serif text-2xl italic">
            {couple.partnerOne} &amp; {couple.partnerTwo}
          </span>
        </Reveal>
      </div>

      {config.countdown.enabled && (
        <Reveal delay={0.1} className="mx-auto mt-20 max-w-3xl">
          <Countdown target={config.weddingDate} />
        </Reveal>
      )}
    </section>
  )
}
