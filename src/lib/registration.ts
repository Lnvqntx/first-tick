import { event } from '../config/event'

export const YEARS = ['1st year', '2nd year', '3rd year', '4th year', 'Other'] as const
export const EXPERIENCE = [
  { value: 'never', label: 'Never traded' },
  { value: 'basics', label: 'Know the basics' },
  { value: 'traded', label: 'Have traded before' },
] as const

export interface Registration {
  fullName: string
  email: string
  year: string
  branch: string
  whatsapp: string
  experience: string
}

export type Errors = Partial<Record<keyof Registration, string>>

export const EMPTY: Registration = { fullName: '', email: '', year: '', branch: '', whatsapp: '', experience: '' }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Keeps digits only and drops an Indian +91 / 0 prefix. */
export function normalisePhone(raw: string): string {
  let d = raw.replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return d
}

export function validate(r: Registration): Errors {
  const e: Errors = {}
  if (r.fullName.trim().length < 2) e.fullName = 'Please enter your full name.'
  if (!r.email.trim()) e.email = 'Please enter your college email.'
  else if (!EMAIL_RE.test(r.email.trim())) e.email = 'That does not look like an email address. Check for typos.'
  if (!r.year) e.year = 'Please choose your year of study.'
  if (!r.branch.trim()) e.branch = 'Please enter your branch or programme.'
  const phone = normalisePhone(r.whatsapp)
  if (!phone) e.whatsapp = 'Please enter your WhatsApp number.'
  else if (!/^[6-9]\d{9}$/.test(phone)) e.whatsapp = 'Enter a 10-digit Indian mobile number, for example 98765 43210.'
  if (!r.experience) e.experience = 'Please pick the option closest to you.'
  return e
}

export type SubmitResult = { ok: true; demo: boolean } | { ok: false; message: string }

/**
 * Sends the registration to the Apps Script endpoint. With no endpoint
 * configured, nothing is sent (demo mode).
 *
 * The body is sent as text/plain so the browser does not make a CORS
 * preflight request, which Apps Script web apps do not answer.
 */
export async function submitRegistration(r: Registration): Promise<SubmitResult> {
  const endpoint = event.links.registrationEndpoint
  if (!endpoint) {
    await new Promise((res) => setTimeout(res, 500))
    return { ok: true, demo: true }
  }

  const payload = {
    fullName: r.fullName.trim(),
    email: r.email.trim().toLowerCase(),
    year: r.year,
    branch: r.branch.trim(),
    whatsapp: normalisePhone(r.whatsapp),
    experience: r.experience,
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
    const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null
    if (data?.ok) return { ok: true, demo: false }
    if (data?.error === 'duplicate') {
      return { ok: false, message: 'This email is already registered. You are all set, just join the WhatsApp community.' }
    }
    return { ok: false, message: 'We could not save your registration. Please try again in a minute.' }
  } catch {
    return { ok: false, message: 'Network problem. Check your connection and try again.' }
  }
}
