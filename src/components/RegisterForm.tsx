import { useId, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  EMPTY,
  EXPERIENCE,
  YEARS,
  submitRegistration,
  validate,
  type Errors,
  type Registration,
} from '../lib/registration'
import { event } from '../config/event'
import { WhatsAppButtons } from './WhatsAppButtons'

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'done'; demo: boolean } | { kind: 'error'; message: string }

export function RegisterForm() {
  const [values, setValues] = useState<Registration>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const inFlight = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)
  const doneRef = useRef<HTMLDivElement>(null)

  const set = <K extends keyof Registration>(key: K, v: string) => {
    const next = { ...values, [key]: v }
    setValues(next)
    // After the first submit attempt, re-validate as the user fixes things.
    if (touched) setErrors(validate(next))
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (inFlight.current) return
    setTouched(true)
    const errs = validate(values)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    inFlight.current = true
    setStatus({ kind: 'submitting' })
    const result = await submitRegistration(values)
    inFlight.current = false
    if (result.ok) {
      setStatus({ kind: 'done', demo: result.demo })
      requestAnimationFrame(() => doneRef.current?.focus())
    } else {
      setStatus({ kind: 'error', message: result.message })
    }
  }

  if (status.kind === 'done') {
    return (
      <div ref={doneRef} tabIndex={-1} className="rounded-[3px] border border-line bg-surface p-6 sm:p-8" role="status">
        {status.demo && (
          <p className="mb-6 rounded-[2px] border border-dashed border-gold-deep px-3 py-2 font-mono text-xs text-gold">
            Demo mode, nothing was saved. The registration endpoint is not set up yet.
          </p>
        )}
        <h3 className="text-h3">You are in, {values.fullName.trim().split(/\s+/)[0]}.</h3>
        <p className="mt-3 max-w-prose text-muted">
          Next step: join the WhatsApp community. All updates, the daily notes and the submission link are shared
          there first.
        </p>
        <div className="mt-6">
          <WhatsAppButtons />
        </div>
      </div>
    )
  }

  const submitting = status.kind === 'submitting'

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className="rounded-[3px] border border-line bg-surface p-5 sm:p-8"
      aria-describedby="privacy-note"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="fullName" error={errors.fullName} className="sm:col-span-2">
          {(p) => (
            <input
              {...p}
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={(e) => set('fullName', e.target.value)}
              className="field-input"
            />
          )}
        </Field>
        <Field label="College email" name="email" error={errors.email} className="sm:col-span-2">
          {(p) => (
            <input
              {...p}
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
              className="field-input"
            />
          )}
        </Field>
        <Field label="Year of study" name="year" error={errors.year}>
          {(p) => (
            <select {...p} value={values.year} onChange={(e) => set('year', e.target.value)} className="field-input">
              <option value="" disabled>
                Choose…
              </option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </Field>
        <Field label="Branch or programme" name="branch" error={errors.branch}>
          {(p) => (
            <input
              {...p}
              type="text"
              autoComplete="off"
              value={values.branch}
              onChange={(e) => set('branch', e.target.value)}
              className="field-input"
            />
          )}
        </Field>
        <Field
          label="WhatsApp number"
          name="whatsapp"
          error={errors.whatsapp}
          hint="Used only to add you to the First Tick group."
          className="sm:col-span-2"
        >
          {(p) => (
            <input
              {...p}
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="98765 43210"
              value={values.whatsapp}
              onChange={(e) => set('whatsapp', e.target.value)}
              className="field-input font-mono"
            />
          )}
        </Field>

        <fieldset
          className="sm:col-span-2"
          aria-invalid={errors.experience ? true : undefined}
          aria-describedby={errors.experience ? 'experience-error' : undefined}
        >
          <legend className="mb-2 text-sm font-medium text-text">Experience with trading</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {EXPERIENCE.map((x) => (
              <label
                key={x.value}
                className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[3px] border border-line bg-ink px-3.5 py-2.5 text-sm transition-colors hover:border-muted/60 has-[:checked]:border-gold has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold"
              >
                <input
                  type="radio"
                  name="experience"
                  value={x.value}
                  checked={values.experience === x.value}
                  onChange={(e) => set('experience', e.target.value)}
                  className="h-4 w-4 accent-[#E3B23C] focus-visible:outline-none"
                />
                {x.label}
              </label>
            ))}
          </div>
          {errors.experience && <ErrorText id="experience-error">{errors.experience}</ErrorText>}
        </fieldset>
      </div>

      {status.kind === 'error' && (
        <p role="alert" className="mt-6 border-l-2 border-loss pl-3 text-sm text-text">
          {status.message}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className="inline-flex min-h-[48px] items-center justify-center rounded-[3px] bg-gold px-6 text-sm font-medium text-ink transition-colors hover:bg-[#EEC55C] active:bg-gold-deep disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? 'Registering…' : 'Register for free'}
        </button>
        <p id="privacy-note" className="text-sm text-muted sm:max-w-[34ch] sm:text-right">
          Your details are used only to run {event.name}.
        </p>
      </div>
    </form>
  )
}

interface FieldProps {
  label: string
  name: keyof Registration
  error?: string
  hint?: string
  className?: string
  children: (props: {
    id: string
    name: string
    'aria-invalid'?: boolean
    'aria-describedby'?: string
  }) => ReactNode
}

function Field({ label, name, error, hint, className = '', children }: FieldProps) {
  const uid = useId()
  const id = `${name}-${uid}`
  const hintId = hint ? `${id}-hint` : undefined
  const errId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errId].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {label}
      </label>
      {children({ id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && <ErrorText id={errId!}>{error}</ErrorText>}
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-1.5 flex gap-1.5 text-sm text-loss">
      <span aria-hidden="true">!</span>
      {children}
    </p>
  )
}
