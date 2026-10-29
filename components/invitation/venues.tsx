import { ArrowUpRight, Navigation } from 'lucide-react'
import { invitationConfig as config, type Venue } from '@/lib/invitation-config'
import { directionsUrl, formatLongDate, formatTime, mapsSearchUrl } from '@/lib/invitation-utils'
import { MaskReveal, Reveal } from './reveal'
import { VenueMap } from './venue-map'

export function Venues() {
  const venues = config.venues
  return (
    <section id="locatii" aria-labelledby="locatii-title" className="px-5 py-24 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col gap-14">
        <Reveal className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">Unde ne întâlnim</p>
          <h2 id="locatii-title" className="font-serif text-4xl leading-tight text-balance md:text-6xl">
            Locațiile
          </h2>
        </Reveal>

        <MaskReveal>
          <div className="border-2 border-sea p-2">
            <VenueMap venues={venues} />
          </div>
        </MaskReveal>

        <ul className="grid gap-8 md:grid-cols-2">
          {venues.map((venue, i) => (
            <li key={venue.id}>
              <Reveal delay={i * 0.1} className="h-full">
                <VenueTag venue={venue} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function VenueTag({ venue }: { venue: Venue }) {
  return (
    <article className="relative flex h-full flex-col gap-6 border-2 border-terracotta bg-card p-6 outline-1 outline-offset-4 outline-terracotta md:p-8">
      <span
        className="absolute top-6 right-6 size-4 rounded-full border-2 border-terracotta bg-background md:top-8 md:right-8"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-2 pr-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-terracotta">{venue.kind}</p>
        <h3 className="font-serif text-3xl leading-tight text-balance md:text-4xl">{venue.name}</h3>
        {venue.address && <p className="leading-relaxed text-muted-foreground">{venue.address}</p>}
      </div>

      <dl className="grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-2 border-y border-border py-4">
        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ora</dt>
        <dd className="tabular font-serif text-2xl">{formatTime(venue.startsAt, config)}</dd>
        <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Data</dt>
        <dd>{formatLongDate(venue.startsAt, config)}</dd>
      </dl>

      {venue.note && <p className="leading-relaxed text-pretty">{venue.note}</p>}

      <div className="mt-auto flex flex-wrap gap-3">
        <a
          href={directionsUrl(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-terracotta"
        >
          <Navigation className="size-4" aria-hidden="true" />
          Indicații de drum
          <span className="sr-only">către {venue.name} (se deschide într-o filă nouă)</span>
        </a>
        <a
          href={mapsSearchUrl(venue)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-sea px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-sea hover:text-cream"
        >
          Vezi pe hartă
          <ArrowUpRight className="size-4" aria-hidden="true" />
          <span className="sr-only">{venue.name} (se deschide într-o filă nouă)</span>
        </a>
      </div>
    </article>
  )
}
