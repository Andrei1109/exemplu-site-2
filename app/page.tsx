import { Closing } from '@/components/invitation/closing'
import { InvitationMessage } from '@/components/invitation/invitation-message'
import { InvitationShell } from '@/components/invitation/invitation-shell'
import { Itinerary } from '@/components/invitation/itinerary'
import { RSVPSection } from '@/components/invitation/rsvp-section'
import { Story } from '@/components/invitation/story'
import { Venues } from '@/components/invitation/venues'
import { invitationConfig } from '@/lib/invitation-config'
import { resolveGuest } from '@/lib/invitation-utils'

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  const raw = params.invitat
  const guest = resolveGuest(invitationConfig, Array.isArray(raw) ? raw[0] : raw)

  return (
    <InvitationShell guestName={guest.displayName}>
      <InvitationMessage />
      <Story />
      <Itinerary />
      <Venues />
      <RSVPSection guest={guest} />
      <Closing />
    </InvitationShell>
  )
}
