import { useRef } from 'react'
import { useReducedMotion } from '../lib/useReducedMotion'

function Star() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-[0.55em] w-[0.55em] shrink-0 text-gold">
      <path d="M8 0l1.9 6.1L16 8l-6.1 1.9L8 16l-1.9-6.1L0 8l6.1-1.9z" fill="currentColor" />
    </svg>
  )
}

interface BandProps {
  items: string[]
  variant: 'solid' | 'outline'
  /** Seconds for one full loop. */
  duration: number
  tilt: number
  className?: string
}

/** One tilted band. The track is duplicated and moved by -50% for a seamless loop. */
function Band({ items, variant, duration, tilt, className = '' }: BandProps) {
  const reduced = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)

  // Smoothly slow the loop on hover instead of jumping (changing CSS duration would jump).
  const setRate = (rate: number) => {
    trackRef.current?.getAnimations().forEach((a) => a.updatePlaybackRate(rate))
  }

  const size = reduced
    ? 'text-lg sm:text-2xl'
    : variant === 'solid'
      ? 'text-[clamp(1.5rem,2.6vw,2.4rem)]'
      : 'text-[clamp(1.25rem,2.2vw,2rem)]'
  const text = `font-display font-semibold ${size} ${variant === 'solid' ? 'text-text' : 'marquee-outline'}`

  const list = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className={`flex shrink-0 items-center ${reduced ? 'flex-wrap justify-center gap-y-2' : ''}`}>
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-center whitespace-nowrap leading-none ${reduced ? 'gap-3 px-2.5' : 'gap-6 px-6'} ${text}`}
        >
          <span>{item}</span>
          <Star />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      className={`relative -mx-[4%] w-[108%] border-y py-3.5 sm:py-4 ${
        variant === 'solid' ? 'border-gold/35 bg-surface' : 'border-line bg-ink'
      } ${className}`}
      style={reduced ? undefined : { transform: `rotate(${tilt}deg)` }}
      onMouseEnter={() => setRate(0.3)}
      onMouseLeave={() => setRate(1)}
    >
      {reduced ? (
        <div className="page-x">{list(false)}</div>
      ) : (
        <div ref={trackRef} className="marquee-track flex w-max" style={{ animationDuration: `${duration}s` }}>
          {list(false)}
          {list(true)}
        </div>
      )}
    </div>
  )
}

export function Marquee({ primary, secondary }: { primary: string[]; secondary: string[] }) {
  return (
    <section aria-label="What you will cover" className="relative overflow-hidden py-10 sm:py-12">
      <Band items={secondary} variant="outline" duration={60} tilt={2} className="z-0" />
      <Band items={primary} variant="solid" duration={38} tilt={-2} className="z-10 -mt-3 sm:-mt-4" />
    </section>
  )
}
