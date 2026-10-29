import { invitationConfig as config } from '@/lib/invitation-config'
import { Artwork } from './artwork'
import { MaskReveal, Reveal } from './reveal'

export function Story() {
  const { story, couple } = config
  if (!story.enabled) return null

  return (
    <section aria-labelledby="poveste-title" className="bg-muted px-5 py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-7">
          <MaskReveal>
            <figure className="-rotate-1 bg-card p-3 pb-4 shadow-[0_18px_40px_-24px_var(--sea)] md:p-4 md:pb-5">
              <Artwork asset={story.image} className="aspect-[1376/768] w-full" sizes="(max-width: 768px) 92vw, 640px" />
              <figcaption className="flex items-center justify-between gap-4 pt-3">
                <span className="font-hand text-2xl text-terracotta">{story.caption}</span>
                <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  {couple.initials}
                </span>
              </figcaption>
            </figure>
          </MaskReveal>
        </div>

        <Reveal className="flex flex-col gap-6 md:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">{story.eyebrow}</p>
          <h2 id="poveste-title" className="font-serif text-4xl leading-tight text-balance md:text-5xl">
            {story.title}
          </h2>
          <div className="flex flex-col gap-4 text-lg leading-relaxed text-pretty">
            {story.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
