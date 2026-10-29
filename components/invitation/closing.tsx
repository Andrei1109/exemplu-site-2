import { invitationConfig as config } from '@/lib/invitation-config'
import { formatPostmark } from '@/lib/invitation-utils'
import { Reveal } from './reveal'

export function Closing() {
  const { closing, couple, footer } = config
  return (
    <>
      <section aria-labelledby="final-title" className="px-5 py-24 md:py-36">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <span className="flex size-20 items-center justify-center rounded-full border-2 border-sea font-serif text-2xl italic" aria-hidden="true">
            {couple.initials}
          </span>
          <h2 id="final-title" className="font-serif text-4xl leading-tight text-balance md:text-6xl">
            {closing.title}
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-pretty">{closing.body}</p>
          <p className="flex flex-col items-center gap-1">
            <span className="font-hand text-3xl text-terracotta">{closing.signature}</span>
            <span className="font-serif text-2xl italic">
              {couple.partnerOne} &amp; {couple.partnerTwo}
            </span>
          </p>
        </Reveal>
      </section>

      <footer className="bg-sea text-cream">
        <div className="awning h-8 opacity-90" aria-hidden="true" />
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm sm:flex-row md:px-8">
          <p className="tabular tracking-wide text-cream/85">
            {couple.initials} · {formatPostmark(config.weddingDate, config)} · {footer.note}
          </p>
          <p className="text-cream/85">
            Creată cu{' '}
            <a href={footer.platformUrl} className="font-semibold text-cream underline decoration-sun underline-offset-4">
              {footer.platform}
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
