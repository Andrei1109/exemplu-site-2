import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'
import { Caveat, Fraunces, Source_Sans_3 } from 'next/font/google'
import { invitationConfig } from '@/lib/invitation-config'
import { formatDayMonthYear } from '@/lib/invitation-utils'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  axes: ['SOFT', 'WONK', 'opsz'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
})

const sourceSans = Source_Sans_3({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-source-sans',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin', 'latin-ext'],
  weight: ['500'],
  variable: '--font-caveat',
  display: 'swap',
})

const { couple, tagline, theme } = invitationConfig

export const metadata: Metadata = {
  title: `${couple.partnerOne} & ${couple.partnerTwo} — Invitație de nuntă`,
  description: `${tagline}. Vă invităm la nunta noastră, pe ${formatDayMonthYear(invitationConfig.weddingDate, invitationConfig)}.`,
  generator: 'v0.app',
  robots: { index: false, follow: false },
  openGraph: {
    title: `${couple.partnerOne} & ${couple.partnerTwo} — Invitație de nuntă`,
    description: tagline,
    images: invitationConfig.images.hero ? [invitationConfig.images.hero.src] : undefined,
    locale: 'ro_RO',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: theme.colors.cream,
}

const themeVars = {
  '--sea': theme.colors.sea,
  '--sun': theme.colors.sun,
  '--cream': theme.colors.cream,
  '--olive': theme.colors.olive,
  '--terracotta': theme.colors.terracotta,
} as CSSProperties

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ro"
      style={themeVars}
      className={`${fraunces.variable} ${sourceSans.variable} ${caveat.variable} bg-background`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
