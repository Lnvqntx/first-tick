import { event } from '../config/event'
import { formatLong } from '../lib/dates'

/** A sample certificate rendered in HTML. Placeholder name and ID only. */
export function CertificatePreview() {
  const issued = event.days[event.days.length - 1].date
  return (
    <figure aria-label="Sample certificate" className="w-full">
      <div className="relative aspect-[1.414/1] w-full overflow-hidden rounded-[2px] border border-line bg-surface p-[5%]">
        <div className="pointer-events-none absolute inset-[3%] border border-gold-deep/40" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex items-start justify-between gap-4">
            <span className="font-mono text-[clamp(0.55rem,1.2vw,0.8rem)] tracking-[0.08em] text-text">
              FIRST<span className="text-gold">TICK</span>
            </span>
            <span className="rounded-[2px] border border-line px-2 py-0.5 font-mono text-[clamp(0.5rem,1vw,0.7rem)] text-muted">
              Sample
            </span>
          </div>
          <div>
            <p className="font-mono text-[clamp(0.55rem,1.1vw,0.75rem)] text-muted">Certificate of Completion</p>
            <p className="mt-[2%] font-display text-[clamp(1.4rem,4vw,2.6rem)] leading-none text-text">Your Name</p>
            <p className="mt-[3%] max-w-[38ch] text-[clamp(0.6rem,1.15vw,0.85rem)] leading-snug text-muted">
              completed {event.name}, a beginner programme on financial markets and trading, and submitted a paper-trade
              assignment in the required format.
            </p>
          </div>
          <div className="flex items-end justify-between gap-4 font-mono text-[clamp(0.5rem,1vw,0.7rem)] text-muted">
            <div>
              <p>
                {event.clubName}, {event.collegeName}
              </p>
              <p>{formatLong(issued)}</p>
            </div>
            <div className="text-right">
              <p>Certificate ID</p>
              <p className="text-text">FT26-SAMPLE-0001</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-3 font-mono text-xs text-muted">
        Preview only. Real certificates carry your name and a unique ID.
      </figcaption>
    </figure>
  )
}
