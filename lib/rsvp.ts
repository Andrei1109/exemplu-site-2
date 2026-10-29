export type Attendance = 'yes' | 'no'

export type RSVPValues = {
  name: string
  attendance: Attendance | ''
  companions: number
  dietary: string[]
  dietaryNote: string
  message: string
}

export type RSVPPayload = {
  eventId: string
  inviteToken: string | null
  name: string
  attending: boolean
  companions: number
  dietary: string[]
  dietaryNote: string | null
  message: string | null
  submittedAt: string
}

export type RSVPResult =
  | { ok: true; mode: 'live' }
  | { ok: true; mode: 'demo' }
  | { ok: false; error: string }

export type RSVPErrors = Partial<Record<'name' | 'attendance' | 'companions' | 'dietaryNote' | 'message', string>>

export const RSVP_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  dietaryNoteMax: 200,
  messageMax: 500,
} as const

export function validateRSVP(values: RSVPValues, maxCompanions: number): RSVPErrors {
  const errors: RSVPErrors = {}
  const name = values.name.trim()

  if (name.length < RSVP_LIMITS.nameMin) {
    errors.name = 'Vă rugăm să ne spuneți numele dumneavoastră.'
  } else if (name.length > RSVP_LIMITS.nameMax) {
    errors.name = `Numele poate avea cel mult ${RSVP_LIMITS.nameMax} de caractere.`
  }

  if (values.attendance !== 'yes' && values.attendance !== 'no') {
    errors.attendance = 'Vă rugăm să alegeți dacă veți putea fi alături de noi.'
  }

  if (values.attendance === 'yes') {
    if (!Number.isInteger(values.companions) || values.companions < 0 || values.companions > maxCompanions) {
      errors.companions =
        maxCompanions === 0
          ? 'Această invitație este pentru o singură persoană.'
          : `Puteți fi însoțit(ă) de cel mult ${maxCompanions} ${maxCompanions === 1 ? 'persoană' : 'persoane'}.`
    }
    if (values.dietaryNote.trim().length > RSVP_LIMITS.dietaryNoteMax) {
      errors.dietaryNote = `Vă rugăm să rezumați în cel mult ${RSVP_LIMITS.dietaryNoteMax} de caractere.`
    }
  }

  if (values.message.trim().length > RSVP_LIMITS.messageMax) {
    errors.message = `Mesajul poate avea cel mult ${RSVP_LIMITS.messageMax} de caractere.`
  }

  return errors
}

export function buildPayload(values: RSVPValues, eventId: string, inviteToken: string | null): RSVPPayload {
  const attending = values.attendance === 'yes'
  return {
    eventId,
    inviteToken,
    name: values.name.trim(),
    attending,
    companions: attending ? values.companions : 0,
    dietary: attending ? values.dietary : [],
    dietaryNote: attending && values.dietaryNote.trim() ? values.dietaryNote.trim() : null,
    message: values.message.trim() ? values.message.trim() : null,
    submittedAt: new Date().toISOString(),
  }
}

/**
 * Palfi Events integration point. With no endpoint configured, nothing is sent or stored
 * and the caller must present the result as a demo.
 */
export async function submitRSVP(payload: RSVPPayload, endpoint: string | null): Promise<RSVPResult> {
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return { ok: true, mode: 'demo' }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15000),
    })
    if (!response.ok) {
      return {
        ok: false,
        error:
          response.status === 409
            ? 'Am primit deja un răspuns pentru această invitație. Dacă doriți să-l modificați, scrieți-ne direct.'
            : 'Răspunsul nu a putut fi trimis. Vă rugăm să încercați din nou peste câteva momente.',
      }
    }
    return { ok: true, mode: 'live' }
  } catch {
    return {
      ok: false,
      error: 'Conexiunea a eșuat. Verificați internetul și încercați din nou — datele completate au rămas în formular.',
    }
  }
}
