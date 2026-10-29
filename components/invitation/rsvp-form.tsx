'use client'

import { Check, Loader2, Minus, Plus } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { invitationConfig as config } from '@/lib/invitation-config'
import { formatLongDate } from '@/lib/invitation-utils'
import { buildPayload, RSVP_LIMITS, submitRSVP, validateRSVP, type RSVPErrors, type RSVPValues } from '@/lib/rsvp'
import { cn } from '@/lib/utils'

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error'; message: string } | { kind: 'done'; demo: boolean; attending: boolean; name: string }

type RSVPFormProps = { guestName: string | null; inviteToken: string | null; maxCompanions: number }

export function RSVPForm({ guestName, inviteToken, maxCompanions }: RSVPFormProps) {
  const [values, setValues] = useState<RSVPValues>({
    name: guestName ?? '',
    attendance: '',
    companions: 0,
    dietary: [],
    dietaryNote: '',
    message: '',
  })
  const [errors, setErrors] = useState<RSVPErrors>({})
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [closed, setClosed] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    setClosed(Date.now() > new Date(config.rsvp.deadline).getTime())
  }, [])

  useEffect(() => {
    if (status.kind === 'done') resultRef.current?.focus()
  }, [status.kind])

  function update<K extends keyof RSVPValues>(key: K, value: RSVPValues[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as keyof RSVPErrors]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status.kind === 'submitting') return
    const nextErrors = validateRSVP(values, maxCompanions)
    setErrors(nextErrors)
    const firstInvalid = Object.keys(nextErrors).find((k) => nextErrors[k as keyof RSVPErrors])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }
    setStatus({ kind: 'submitting' })
    const result = await submitRSVP(buildPayload(values, config.eventId, inviteToken), config.rsvp.endpoint)
    if (result.ok) {
      setStatus({ kind: 'done', demo: result.mode === 'demo', attending: values.attendance === 'yes', name: values.name.trim() })
    } else {
      setStatus({ kind: 'error', message: result.error })
    }
  }

  const deadline = formatLongDate(config.rsvp.deadline, config)

  if (closed) {
    return (
      <div className="border-2 border-sea p-8 text-center">
        <p className="font-serif text-2xl text-balance">Confirmările s-au încheiat pe {deadline}.</p>
        <p className="mt-3 leading-relaxed text-muted-foreground">Dacă e ceva ce trebuie să știm, scrieți-ne direct — vă răspundem cu drag.</p>
      </div>
    )
  }

  if (status.kind === 'done') {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="flex flex-col items-center gap-5 border-2 border-sea bg-card p-8 text-center outline-none md:p-12">
        <span className="flex size-14 items-center justify-center rounded-full bg-sun text-sea" aria-hidden="true">
          <Check className="size-6" />
        </span>
        <h3 className="font-serif text-3xl text-balance md:text-4xl">
          {status.attending ? `Mulțumim, ${status.name}! Ne bucurăm nespus.` : `Mulțumim, ${status.name}. Vă vom simți lipsa.`}
        </h3>
        <p className="max-w-md leading-relaxed text-pretty">
          {status.attending
            ? 'Vă așteptăm cu brațele deschise. Itinerariul și indicațiile de drum rămân aici, pe invitație, oricând aveți nevoie de ele.'
            : 'Vă mulțumim că ne-ați anunțat. Vă purtăm în gând în ziua cea mare.'}
        </p>
        {status.demo && (
          <p className="max-w-md border border-dashed border-terracotta px-4 py-3 text-sm leading-relaxed text-terracotta">
            Mod demonstrativ: răspunsul nu a fost trimis sau salvat. Conectați endpoint-ul Palfi Events în configurație pentru confirmări reale.
          </p>
        )}
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="text-sm font-semibold underline decoration-sun decoration-2 underline-offset-4 hover:decoration-terracotta"
        >
          Modifică răspunsul
        </button>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'
  const attending = values.attendance === 'yes'
  const errorId = (field: keyof RSVPErrors) => (errors[field] ? `${id}-${field}-error` : undefined)

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="flex flex-col gap-8 border-2 border-sea bg-card p-6 md:p-10" aria-busy={submitting}>
      {!config.rsvp.endpoint && (
        <p className="border border-dashed border-terracotta px-4 py-3 text-sm leading-relaxed text-terracotta">
          Previzualizare: formularul funcționează în mod demonstrativ și nu trimite date.
        </p>
      )}

      <Field label="Numele dumneavoastră" htmlFor={`${id}-name`} error={errors.name} errorId={errorId('name')}>
        <input
          id={`${id}-name`}
          data-field="name"
          name="name"
          autoComplete="name"
          value={values.name}
          maxLength={RSVP_LIMITS.nameMax}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errorId('name')}
          className={inputClass(!!errors.name)}
        />
      </Field>

      <fieldset className="flex flex-col gap-3" aria-describedby={errorId('attendance')}>
        <legend className="mb-3 text-sm font-semibold">Veți fi alături de noi?</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { value: 'yes' as const, label: 'Da, cu mare drag' },
            { value: 'no' as const, label: 'Din păcate, nu' },
          ].map((option, i) => (
            <label
              key={option.value}
              className={cn(
                'flex cursor-pointer items-center gap-3 border-2 px-4 py-3.5 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                values.attendance === option.value ? 'border-sea bg-sea text-cream' : 'border-border bg-background hover:border-sea',
              )}
            >
              <input
                type="radio"
                name="attendance"
                value={option.value}
                data-field={i === 0 ? 'attendance' : undefined}
                checked={values.attendance === option.value}
                onChange={() => update('attendance', option.value)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-5 shrink-0 items-center justify-center rounded-full border-2',
                  values.attendance === option.value ? 'border-sun' : 'border-sea',
                )}
                aria-hidden="true"
              >
                {values.attendance === option.value && <span className="size-2.5 rounded-full bg-sun" />}
              </span>
              <span className="font-serif text-lg">{option.label}</span>
            </label>
          ))}
        </div>
        {errors.attendance && <ErrorText id={errorId('attendance')!}>{errors.attendance}</ErrorText>}
      </fieldset>

      {attending && (
        <>
          {maxCompanions > 0 && (
            <div className="flex flex-col gap-3">
              <span id={`${id}-companions-label`} className="text-sm font-semibold">
                Câte persoane vă însoțesc?
              </span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => update('companions', Math.max(0, values.companions - 1))}
                  disabled={values.companions <= 0}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-sea transition-colors hover:bg-sea hover:text-cream disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-sea"
                  aria-label="Mai puțini însoțitori"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <output
                  data-field="companions"
                  tabIndex={-1}
                  aria-labelledby={`${id}-companions-label`}
                  aria-live="polite"
                  className="tabular min-w-10 text-center font-serif text-3xl outline-none"
                >
                  {values.companions}
                </output>
                <button
                  type="button"
                  onClick={() => update('companions', Math.min(maxCompanions, values.companions + 1))}
                  disabled={values.companions >= maxCompanions}
                  className="flex size-11 items-center justify-center rounded-full border-2 border-sea transition-colors hover:bg-sea hover:text-cream disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-sea"
                  aria-label="Mai mulți însoțitori"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
                <span className="text-sm text-muted-foreground">din {maxCompanions} posibil{maxCompanions === 1 ? '' : 'e'}</span>
              </div>
              {errors.companions && <ErrorText id={errorId('companions')!}>{errors.companions}</ErrorText>}
            </div>
          )}

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-3 text-sm font-semibold">
              Preferințe alimentare <span className="font-normal text-muted-foreground">(opțional)</span>
            </legend>
            <div className="flex flex-wrap gap-2">
              {config.rsvp.dietaryOptions.map((option) => {
                const checked = values.dietary.includes(option)
                return (
                  <label
                    key={option}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-full border-2 px-4 py-2 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring',
                      checked ? 'border-olive bg-olive text-cream' : 'border-border hover:border-olive',
                    )}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={() =>
                        update('dietary', checked ? values.dietary.filter((d) => d !== option) : [...values.dietary, option])
                      }
                    />
                    {checked && <Check className="size-3.5" aria-hidden="true" />}
                    {option}
                  </label>
                )
              })}
            </div>
            <label htmlFor={`${id}-dietaryNote`} className="sr-only">
              Alte alergii sau mențiuni
            </label>
            <input
              id={`${id}-dietaryNote`}
              data-field="dietaryNote"
              placeholder="Alte alergii sau mențiuni…"
              value={values.dietaryNote}
              maxLength={RSVP_LIMITS.dietaryNoteMax}
              onChange={(e) => update('dietaryNote', e.target.value)}
              aria-invalid={!!errors.dietaryNote}
              aria-describedby={errorId('dietaryNote')}
              className={inputClass(!!errors.dietaryNote)}
            />
            {errors.dietaryNote && <ErrorText id={errorId('dietaryNote')!}>{errors.dietaryNote}</ErrorText>}
          </fieldset>
        </>
      )}

      <Field
        label={
          <>
            Un gând pentru noi <span className="font-normal text-muted-foreground">(opțional)</span>
          </>
        }
        htmlFor={`${id}-message`}
        error={errors.message}
        errorId={errorId('message')}
      >
        <textarea
          id={`${id}-message`}
          data-field="message"
          rows={3}
          value={values.message}
          maxLength={RSVP_LIMITS.messageMax}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={errorId('message')}
          className={cn(inputClass(!!errors.message), 'resize-y leading-relaxed')}
        />
      </Field>

      {status.kind === 'error' && (
        <p role="alert" className="border-l-0 bg-terracotta/10 px-4 py-3 text-sm leading-relaxed text-terracotta">
          {status.message}
        </p>
      )}

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-colors hover:bg-terracotta disabled:opacity-70"
        >
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitting ? 'Se trimite…' : 'Trimite confirmarea'}
        </button>
        <p className="text-sm text-muted-foreground">Vă rugăm să răspundeți până pe {deadline}.</p>
      </div>
    </form>
  )
}

function inputClass(invalid: boolean) {
  return cn(
    'w-full border-0 border-b-2 bg-transparent px-0 py-2.5 text-lg outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-terracotta',
    invalid ? 'border-terracotta' : 'border-sea',
  )
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  children,
}: {
  label: React.ReactNode
  htmlFor: string
  error?: string
  errorId?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && errorId && <ErrorText id={errorId}>{error}</ErrorText>}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <p id={id} className="pt-1 text-sm text-terracotta">
      {children}
    </p>
  )
}
