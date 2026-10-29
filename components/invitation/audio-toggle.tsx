'use client'

import { Music, Pause } from 'lucide-react'
import { useRef, useState } from 'react'
import { invitationConfig as config } from '@/lib/invitation-config'

export function AudioToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)

  if (!config.audio.enabled || !config.audio.src) return null

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  return (
    <>
      <audio ref={audioRef} src={config.audio.src} loop preload="none" onPause={() => setPlaying(false)} />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Oprește ${config.audio.title}` : `Pornește ${config.audio.title}`}
        className="fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full border-2 border-cream bg-sea text-cream shadow-lg transition-colors hover:bg-terracotta"
      >
        {playing ? <Pause className="size-5" aria-hidden="true" /> : <Music className="size-5" aria-hidden="true" />}
      </button>
    </>
  )
}
