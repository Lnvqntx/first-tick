import { event } from '../config/event'

const TZ = 'Asia/Kolkata'

/** "27 Oct" */
export function formatShort(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: TZ }).format(new Date(iso))
}

/** "Tue, 27 Oct 2026" */
export function formatLong(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TZ,
  }).format(new Date(iso))
}

/** "11:59 pm" */
export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ })
    .format(new Date(iso))
    .toLowerCase()
}

/** "27–30 Oct 2026" for the whole event. */
export function eventRange(): string {
  const first = event.days[0].date
  const last = event.days[event.days.length - 1].date
  const d = (iso: string, o: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-IN', { ...o, timeZone: TZ }).format(new Date(iso))
  const sameMonth = d(first, { month: 'short' }) === d(last, { month: 'short' })
  return sameMonth
    ? `${d(first, { day: 'numeric' })}–${d(last, { day: 'numeric' })} ${d(last, { month: 'short', year: 'numeric' })}`
    : `${formatShort(first)} – ${d(last, { day: 'numeric', month: 'short', year: 'numeric' })}`
}
