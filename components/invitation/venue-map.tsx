'use client'

import dynamic from 'next/dynamic'
import type { Venue } from '@/lib/invitation-config'

const VenueMapInner = dynamic(() => import('./venue-map-inner'), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-muted" />,
})

export function VenueMap({ venues }: { venues: Venue[] }) {
  return (
    <div
      role="region"
      aria-label={`Hartă cu locațiile: ${venues.map((v) => v.name).join(', ')}`}
      className="relative isolate z-0 h-[22rem] w-full overflow-hidden md:h-[30rem]"
    >
      <VenueMapInner venues={venues} />
    </div>
  )
}
