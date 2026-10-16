import { event } from '../config/event'

/** Small "Dates to be confirmed" note. Renders nothing once `datesConfirmed` is true. */
export function DatesNote({ className = '' }: { className?: string }) {
  if (event.datesConfirmed) return null
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs text-muted ${className}`}>
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full border border-muted" />
      Dates to be confirmed
    </span>
  )
}
