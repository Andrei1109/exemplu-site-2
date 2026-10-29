import { invitationConfig as config } from '@/lib/invitation-config'
import { formatLongDate } from '@/lib/invitation-utils'
import { Reveal } from './reveal'

export function Itinerary() {
  return (
    <section id="itinerariu" aria-labelledby="itinerariu-title" className="relative scroll-mt-6 bg-sea text-cream">
      <div className="mx-auto max-w-4xl px-5 pt-14 pb-24 md:pt-20 md:pb-32">
        <Reveal className="flex flex-col gap-4 border-b border-cream/30 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sun">Programul zilei</p>
            <h2 id="itinerariu-title" className="font-serif text-4xl leading-tight md:text-6xl">
              Itinerariul
            </h2>
          </div>
          <p className="font-serif text-lg italic text-cream/85">{formatLongDate(config.weddingDate, config)}</p>
        </Reveal>

        <ol className="flex flex-col">
          {config.itinerary.map((stop, i) => (
            <li key={`${stop.time}-${stop.title}`}>
              <Reveal
                delay={i * 0.05}
                className="grid grid-cols-[5.5rem_1fr] gap-x-5 gap-y-1 border-b border-cream/20 py-7 md:grid-cols-[9rem_1fr_auto] md:items-baseline md:gap-x-8"
              >
                <time className="tabular row-span-2 font-serif text-3xl leading-none text-sun md:row-span-1 md:text-5xl">
                  {stop.time}
                </time>
                <div className="flex flex-col gap-1">
                  <h3 className="font-serif text-2xl leading-snug md:text-3xl">{stop.title}</h3>
                  {stop.detail && <p className="leading-relaxed text-cream/80">{stop.detail}</p>}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cream/75 md:text-right">{stop.place}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
