'use client'

import { useEffect, useState } from 'react'

type Remaining = { days: number; hours: number; minutes: number; seconds: number }

const DAY_MS = 86_400_000

function getRemaining(target: number, now: number): Remaining | null {
  const diff = target - now
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / DAY_MS),
    hours: Math.floor((diff % DAY_MS) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

function plural(n: number, one: string, other: string) {
  return n === 1 ? one : other
}

export function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime()
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const remaining = now === null ? undefined : getRemaining(targetMs, now)
  const isWeddingDay = now !== null && remaining === null && now - targetMs < DAY_MS

  if (remaining === null) {
    return (
      <div className="border-y-2 border-sea py-8 text-center">
        <p className="font-serif text-3xl text-balance md:text-4xl">
          {isWeddingDay ? 'Astăzi e ziua cea mare!' : 'Ne-am spus „da” — vă mulțumim din suflet că ați fost alături de noi.'}
        </p>
      </div>
    )
  }

  const units = [
    { value: remaining?.days, label: remaining ? plural(remaining.days, 'zi', 'zile') : 'zile' },
    { value: remaining?.hours, label: remaining ? plural(remaining.hours, 'oră', 'ore') : 'ore' },
    { value: remaining?.minutes, label: remaining ? plural(remaining.minutes, 'minut', 'minute') : 'minute' },
    { value: remaining?.seconds, label: remaining ? plural(remaining.seconds, 'secundă', 'secunde') : 'secunde' },
  ]

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-olive">Până la marea zi</p>
      <div
        className="grid w-full grid-cols-4 border-y-2 border-sea"
        role="timer"
        aria-live="off"
        aria-label={
          remaining
            ? `Mai sunt ${remaining.days} zile, ${remaining.hours} ore și ${remaining.minutes} minute`
            : 'Se calculează timpul rămas'
        }
      >
        {units.map((unit, i) => (
          <div key={i} className="flex flex-col items-center gap-1 border-sea py-5 not-first:border-l md:py-7" aria-hidden="true">
            <span className="tabular font-serif text-4xl leading-none sm:text-5xl md:text-6xl">
              {unit.value === undefined ? '—' : String(unit.value).padStart(2, '0')}
            </span>
            <span className="text-xs tracking-wide text-muted-foreground sm:text-sm">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
