export type ImageAsset = {
  src: string
  alt: string
  width: number
  height: number
}

export type Venue = {
  id: string
  kind: string
  name: string
  /** Leave null when no verified address exists — the UI will show the name only. */
  address: string | null
  startsAt: string
  note?: string
  /** Optional explicit Maps URL. When omitted, a search link is generated from name + address. */
  mapsUrl?: string
  /** Exact pin position on the interactive map, also used for directions. */
  coordinates: { lat: number; lng: number }
}

export type ItineraryStop = {
  time: string
  title: string
  place: string
  detail?: string
}

export type GuestInvite = {
  displayName: string
  maxCompanions: number
}

export type InvitationConfig = {
  eventId: string
  locale: string
  timeZone: string
  couple: {
    partnerOne: string
    partnerTwo: string
    initials: string
  }
  weddingDate: string
  tagline: string
  theme: {
    colors: {
      sea: string
      sun: string
      cream: string
      olive: string
      terracotta: string
    }
  }
  images: {
    hero: ImageAsset | null
    lemonBranch: ImageAsset | null
    oliveBranch: ImageAsset | null
  }
  invitation: {
    eyebrow: string
    heading: string
    body: string[]
    signOff: string
  }
  venues: Venue[]
  itinerary: ItineraryStop[]
  story: {
    enabled: boolean
    eyebrow: string
    title: string
    paragraphs: string[]
    image: ImageAsset | null
    caption: string
  }
  countdown: { enabled: boolean }
  rsvp: {
    enabled: boolean
    deadline: string
    /** Palfi Events RSVP endpoint. When null, the form runs in clearly labeled demo mode. */
    endpoint: string | null
    defaultMaxCompanions: number
    dietaryOptions: string[]
  }
  /** Personalized links: ?invitat=<token> */
  guests: Record<string, GuestInvite>
  audio: {
    enabled: boolean
    src: string | null
    title: string
  }
  closing: {
    title: string
    body: string
    signature: string
  }
  footer: {
    note: string
    platform: string
    platformUrl: string
  }
}

export const invitationConfig: InvitationConfig = {
  eventId: 'palfi-evt-2027-alexandra-matei',
  locale: 'ro-RO',
  timeZone: 'Europe/Bucharest',
  couple: {
    partnerOne: 'Alexandra',
    partnerTwo: 'Matei',
    initials: 'A & M',
  },
  weddingDate: '2027-06-12T15:00:00+03:00',
  tagline: 'Sub soarele nostru, începe o nouă poveste',
  theme: {
    colors: {
      sea: '#285B91',
      sun: '#F3CD60',
      cream: '#FFF8E9',
      olive: '#78835B',
      terracotta: '#B76D54',
    },
  },
  images: {
    hero: {
      src: '/images/hero-coast.png',
      alt: 'Fotografie cu o coastă mediteraneeană: case în culori pastel pe stâncă, marea albastră și ramuri de lămâi în prim-plan',
      width: 848,
      height: 1264,
    },
    lemonBranch: {
      src: '/images/lemon-branch.png',
      alt: '',
      width: 1376,
      height: 686,
    },
    oliveBranch: {
      src: '/images/olive-branch.png',
      alt: '',
      width: 1411,
      height: 421,
    },
  },
  invitation: {
    eyebrow: 'Invitație',
    heading: 'Vă invităm să ne fiți alături',
    body: [
      'Într-o zi de iunie, când lumina e caldă și serile par să nu se mai termine, ne vom spune „da” în fața celor dragi.',
      'Ne-ar bucura nespus să împărțim cu voi emoția cununiei, o cină lungă sub cerul de vară și dansul care va urma.',
    ],
    signOff: 'cu drag,',
  },
  venues: [
    {
      id: 'ceremony',
      kind: 'Cununia religioasă',
      name: 'Biserica Sfântul Nicolae',
      address: null,
      startsAt: '2027-06-12T15:00:00+03:00',
      note: 'Vă rugăm să sosiți cu aproximativ 15 minute înainte.',
      // Demo coordinates — replace with the real venue location.
      coordinates: { lat: 45.6366, lng: 25.583 },
    },
    {
      id: 'reception',
      kind: 'Petrecerea',
      name: 'The Garden Estate',
      address: null,
      startsAt: '2027-06-12T19:00:00+03:00',
      note: 'Cina și petrecerea au loc în grădină, sub cerul liber.',
      // Demo coordinates — replace with the real venue location.
      coordinates: { lat: 45.6152, lng: 25.6198 },
    },
  ],
  itinerary: [
    {
      time: '15:00',
      title: 'Cununia religioasă',
      place: 'Biserica Sfântul Nicolae',
    },
    {
      time: '19:00',
      title: 'Aperitiv la apus',
      place: 'The Garden Estate',
      detail: 'Limonadă rece, prosecco și primele îmbrățișări',
    },
    {
      time: '20:00',
      title: 'Cina de vară',
      place: 'The Garden Estate',
      detail: 'O masă lungă, ca în serile din sud',
    },
    {
      time: '22:00',
      title: 'Primul dans',
      place: 'The Garden Estate',
    },
    {
      time: '23:30',
      title: 'Tortul & dansul până târziu',
      place: 'The Garden Estate',
    },
  ],
  story: {
    enabled: true,
    eyebrow: 'Din jurnalul nostru',
    title: 'Totul a început cu o vară',
    paragraphs: [
      'Ne-am cunoscut într-un iulie fierbinte, pe o terasă mică de lângă mare, unde amândoi căutam același colț de umbră.',
      'De atunci, am adunat drumuri, apusuri și mii de mici întâmplări. Acum ne pregătim pentru cea mai frumoasă călătorie dintre toate — și vrem să o începem alături de voi.',
    ],
    image: {
      src: '/images/story.png',
      alt: 'Alexandra și Matei ținându-se de mână pe o terasă însorită, cu vedere spre mare',
      width: 1376,
      height: 768,
    },
    caption: 'prima noastră vară',
  },
  countdown: { enabled: true },
  rsvp: {
    enabled: true,
    deadline: '2027-05-15T23:59:59+03:00',
    endpoint: null,
    defaultMaxCompanions: 2,
    dietaryOptions: ['Vegetarian', 'Vegan', 'Fără gluten', 'Fără lactoză'],
  },
  guests: {
    'ioana-andrei': { displayName: 'Ioana și Andrei', maxCompanions: 1 },
    'familia-popescu': { displayName: 'Familia Popescu', maxCompanions: 3 },
  },
  audio: {
    enabled: false,
    src: null,
    title: 'Muzica noastră',
  },
  closing: {
    title: 'Ne vedem sub soarele de iunie',
    body: 'Prezența voastră va fi cel mai frumos dar. Abia așteptăm să sărbătorim împreună.',
    signature: 'cu dragoste',
  },
  footer: {
    note: 'Invitație digitală personalizată',
    platform: 'Palfi Events',
    platformUrl: 'https://palfi.events',
  },
}
