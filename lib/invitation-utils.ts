import type { InvitationConfig, Venue } from './invitation-config'

export type ResolvedGuest = {
  token: string | null
  displayName: string | null
  maxCompanions: number
}

export function resolveGuest(config: InvitationConfig, token: string | undefined): ResolvedGuest {
  const normalized = token?.trim().toLowerCase()
  const invite = normalized ? config.guests[normalized] : undefined
  if (invite && normalized) {
    return { token: normalized, displayName: invite.displayName, maxCompanions: invite.maxCompanions }
  }
  return { token: null, displayName: null, maxCompanions: config.rsvp.defaultMaxCompanions }
}

function capitalize(value: string) {
  return value.charAt(0).toLocaleUpperCase('ro-RO') + value.slice(1)
}

export function formatLongDate(iso: string, config: InvitationConfig) {
  return capitalize(
    new Intl.DateTimeFormat(config.locale, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: config.timeZone,
    }).format(new Date(iso)),
  )
}

export function formatDayMonthYear(iso: string, config: InvitationConfig) {
  return new Intl.DateTimeFormat(config.locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: config.timeZone,
  }).format(new Date(iso))
}

export function formatTime(iso: string, config: InvitationConfig) {
  return new Intl.DateTimeFormat(config.locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: config.timeZone,
  }).format(new Date(iso))
}

export function formatPostmark(iso: string, config: InvitationConfig) {
  const parts = new Intl.DateTimeFormat(config.locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: config.timeZone,
  }).formatToParts(new Date(iso))
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? ''
  return `${get('day')}.${get('month')}.${get('year')}`
}

function venueQuery(venue: Venue) {
  if (venue.address) return `${venue.name}, ${venue.address}`
  return `${venue.coordinates.lat},${venue.coordinates.lng}`
}

export function mapsSearchUrl(venue: Venue) {
  if (venue.mapsUrl) return venue.mapsUrl
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueQuery(venue))}`
}

export function directionsUrl(venue: Venue) {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(venueQuery(venue))}`
}
