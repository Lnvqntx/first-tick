import { event } from '../config/event'

/** Decorative rosette seal drawn in SVG. */
function Seal() {
  const points = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2
    const r = i % 2 === 0 ? 50 : 43
    return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`
  }).join(' ')
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className="h-16 w-16 sm:h-28 sm:w-28">
      <polygon points={points} fill="#0B0A08" />
      <circle cx="50" cy="50" r="36" fill="none" stroke="#E3B23C" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="31" fill="none" stroke="#E3B23C" strokeWidth="0.6" strokeDasharray="1.5 2" />
      {/* a rising candle with a tick mark */}
      <path d="M50 30v6M50 64v6" stroke="#2FBF71" strokeWidth="2" />
      <rect x="44" y="36" width="12" height="28" rx="1.5" fill="#2FBF71" />
      <path d="M38 52l8 7 16-18" fill="none" stroke="#F7D77E" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CertificateCard() {
  const c = event.challenge.certificate
  return (
    <article
      aria-labelledby="cert-card-title"
      className="glow-edge cert-card relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-6 text-ink sm:p-8"
    >
      {/* inner hairline frame */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[1.1rem] border border-ink/25" />

      <div className="relative flex items-start justify-between gap-4">
        <span className="font-mono text-sm font-medium tracking-[0.08em]">
          FIRST<span className="text-ink/60">TICK</span>
        </span>
        <span className="flex items-center gap-2 text-right font-mono text-[0.6875rem] leading-tight">
          <span>
            {event.clubName}
            <br />
            {event.collegeName}
          </span>
          <img src={event.clubLogo.src} alt={event.clubLogo.alt} width={40} height={40} className="h-10 w-10 rounded-full" />
        </span>
      </div>

      <div className="relative mt-6 flex flex-col-reverse items-start gap-4 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h3 id="cert-card-title" className="font-display text-[clamp(1.75rem,2.6vw,2.6rem)] font-semibold leading-[1.02] text-ink">
            {c.title}
          </h3>
          <p className="mt-3 max-w-[34ch] text-sm leading-relaxed text-ink/80">{c.tiers}</p>
        </div>
        <div className="shrink-0">
          <Seal />
        </div>
      </div>

      <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink/20 pt-4">
        <p className="text-sm text-ink/80">{c.note}</p>
        <span className="rounded-full border border-ink/30 px-3 py-1 font-mono text-xs">ID FT26-XXXX</span>
      </div>
    </article>
  )
}
