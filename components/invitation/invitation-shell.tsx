'use client'

import { MotionConfig } from 'motion/react'
import { useState, type ReactNode } from 'react'
import { AudioToggle } from './audio-toggle'
import { Hero } from './hero'
import { OpeningGate } from './opening-gate'

export function InvitationShell({ guestName, children }: { guestName: string | null; children: ReactNode }) {
  const [opened, setOpened] = useState(false)

  return (
    <MotionConfig reducedMotion="user">
      {!opened && <OpeningGate guestName={guestName} onOpened={() => setOpened(true)} />}
      <div inert={!opened} className="contents">
        <Hero opened={opened} guestName={guestName} />
        <main>{children}</main>
      </div>
      {opened && <AudioToggle />}
    </MotionConfig>
  )
}
