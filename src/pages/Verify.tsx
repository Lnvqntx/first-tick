import { useState, type FormEvent } from 'react'
import { usePageTitle } from '../lib/usePageTitle'
import { formatLong } from '../lib/dates'

interface Certificate {
  id: string
  name: string
  tier: string
  date: string
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'found'; cert: Certificate }
  | { kind: 'missing'; id: string }
  | { kind: 'error' }

/** Upper-case and remove all whitespace, so " ft26 - sample-0001 " matches "FT26-SAMPLE-0001". */
const normaliseId = (s: string) => s.replace(/\s+/g, '').toUpperCase()

let cache: Promise<Certificate[]> | null = null
function loadCertificates(): Promise<Certificate[]> {
  cache ??= fetch('/certificates.json', { cache: 'no-cache' }).then((r) => {
    if (!r.ok) throw new Error(String(r.status))
    return r.json() as Promise<Certificate[]>
  })
  cache.catch(() => (cache = null))
  return cache
}

export default function Verify() {
  usePageTitle('Verify a certificate')
  const [value, setValue] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })
  const [inputError, setInputError] = useState('')

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const id = normaliseId(value)
    if (!id) {
      setInputError('Please enter a certificate ID.')
      return
    }
    setInputError('')
    setState({ kind: 'loading' })
    try {
      const list = await loadCertificates()
      const cert = list.find((c) => normaliseId(c.id) === id)
      setState(cert ? { kind: 'found', cert } : { kind: 'missing', id })
    } catch {
      setState({ kind: 'error' })
    }
  }

  return (
    <div className="page-x py-14 sm:py-20">
      <div className="max-w-2xl">
        <h1 className="text-h2">Verify a certificate</h1>
        <p className="mt-4 max-w-prose text-lead text-muted">
          Enter the ID printed on a First Tick certificate to check that it is genuine.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-10">
          <label htmlFor="cert-id" className="mb-2 block text-sm font-medium">
            Certificate ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="cert-id"
              name="cert-id"
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="FT26-XXXX-0000"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-invalid={inputError ? true : undefined}
              aria-describedby={inputError ? 'cert-id-error' : undefined}
              className="field-input font-mono sm:flex-1"
            />
            <button
              type="submit"
              disabled={state.kind === 'loading'}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full px-6 text-sm font-medium btn-gold glow-edge disabled:opacity-70"
            >
              {state.kind === 'loading' ? 'Checking…' : 'Verify'}
            </button>
          </div>
          {inputError && (
            <p id="cert-id-error" className="mt-1.5 text-sm text-loss">
              {inputError}
            </p>
          )}
        </form>

        <div aria-live="polite" className="mt-10">
          {state.kind === 'found' && (
            <div className="rounded-[3px] border border-line bg-surface p-6">
              <p className="flex items-center gap-2 font-mono text-xs text-gold">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <path d="M2 6.5l2.5 2.5L10 3" stroke="currentColor" strokeWidth="1.6" fill="none" />
                </svg>
                Certificate found
              </p>
              <p className="mt-4 font-display text-h3">{state.cert.name}</p>
              <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-sm">
                <dt className="text-muted">Tier</dt>
                <dd>Certificate of {state.cert.tier}</dd>
                <dt className="text-muted">Issued</dt>
                <dd>{formatLong(state.cert.date + 'T12:00:00+05:30')}</dd>
                <dt className="text-muted">ID</dt>
                <dd className="font-mono">{state.cert.id}</dd>
              </dl>
            </div>
          )}
          {state.kind === 'missing' && (
            <div className="border-l-2 border-loss pl-4">
              <p className="text-text">
                No certificate found for this ID: <span className="font-mono">{state.id}</span>
              </p>
              <p className="mt-1 text-sm text-muted">
                Check the ID for typos. If it still does not match, contact the Programming Club through the
                WhatsApp community.
              </p>
            </div>
          )}
          {state.kind === 'error' && (
            <p className="border-l-2 border-loss pl-4 text-text">
              Could not load the certificate list. Check your connection and try again.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
