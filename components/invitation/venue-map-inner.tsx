'use client'

import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useMemo } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import { invitationConfig, type Venue } from '@/lib/invitation-config'
import { directionsUrl } from '@/lib/invitation-utils'

function pinIcon(label: string) {
  const safe = label.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
  return L.divIcon({
    className: 'venue-pin',
    html: `<span class="venue-pin__label">${safe}</span><span class="venue-pin__stem"></span><span class="venue-pin__dot"></span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  })
}

export default function VenueMapInner({ venues }: { venues: Venue[] }) {
  const points = useMemo(
    () => venues.map((v) => [v.coordinates.lat, v.coordinates.lng] as [number, number]),
    [venues],
  )
  const bounds = useMemo(() => L.latLngBounds(points).pad(0.35), [points])
  const icons = useMemo(() => venues.map((v) => pinIcon(v.kind)), [venues])

  return (
    <MapContainer
      bounds={bounds}
      scrollWheelZoom={false}
      className="size-full"
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {points.length > 1 && (
        <Polyline positions={points} pathOptions={{ color: invitationConfig.theme.colors.sea, weight: 2, dashArray: '6 8' }} />
      )}
      {venues.map((venue, i) => (
        <Marker key={venue.id} position={points[i]} icon={icons[i]} title={venue.name}>
          <Popup>
            <strong>{venue.name}</strong>
            <br />
            <a href={directionsUrl(venue)} target="_blank" rel="noopener noreferrer">
              Indicații de drum
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
